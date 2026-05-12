"use client";

/**
 * lib/context/AuthContext.tsx
 *
 * Context global untuk sesi admin.
 * - Simpan access_token & user di memory (tidak di localStorage untuk keamanan)
 * - refresh_token disimpan di httpOnly cookie via /api/auth/* route handler
 *   (untuk MVP: pakai sessionStorage dengan catatan security)
 * - Hanya super_admin dan hr yang boleh akses web admin
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  UserResponse,
  apiLogin,
  apiLogout,
  apiRefreshToken,
  ApiError,
} from "@/lib/api/auth";

// ─── Role guard ────────────────────────────────────────────────────────────────
export const ALLOWED_ROLES: UserResponse["role"][] = ["super_admin", "hr"];

export function isAllowedRole(role: UserResponse["role"]): boolean {
  return ALLOWED_ROLES.includes(role);
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Token aktif — sudah auto-refresh jika expired */
  getToken: () => string | null;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────
const REFRESH_KEY = "meridian_refresh_token";
const USER_KEY = "meridian_user";

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
  });

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedRefresh = sessionStorage.getItem(REFRESH_KEY);
        const storedUser = sessionStorage.getItem(USER_KEY);

        if (!storedRefresh || !storedUser) {
          setState((p) => ({ ...p, isLoading: false }));
          return;
        }

        // Ambil access token baru dari refresh token
        const tokens = await apiRefreshToken(storedRefresh);
        const user: UserResponse = JSON.parse(storedUser);

        // Simpan refresh token baru (rotasi)
        sessionStorage.setItem(REFRESH_KEY, tokens.refresh_token);

        if (!isAllowedRole(user.role)) {
          sessionStorage.clear();
          setState((p) => ({ ...p, isLoading: false }));
          return;
        }

        setState({ user, accessToken: tokens.access_token, isLoading: false });
      } catch {
        // Refresh gagal — clear session
        sessionStorage.removeItem(REFRESH_KEY);
        sessionStorage.removeItem(USER_KEY);
        setState((p) => ({ ...p, isLoading: false }));
      }
    }

    restoreSession();
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);

    // Guard: hanya super_admin & hr yang boleh akses web admin
    if (!isAllowedRole(data.user.role)) {
      const err: ApiError = {
        error_code: "FORBIDDEN_ROLE",
        message:
          "Akses ditolak. Portal ini hanya untuk Super Admin dan HR Manager.",
      };
      throw err;
    }

    // Simpan di sessionStorage (clear saat tab ditutup)
    sessionStorage.setItem(REFRESH_KEY, data.refresh_token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));

    setState({
      user: data.user,
      accessToken: data.access_token,
      isLoading: false,
    });
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const token = state.accessToken;
    if (token) {
      try {
        await apiLogout(token);
      } catch {
        // Tetap logout lokal walaupun API gagal
      }
    }

    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);

    setState({ user: null, accessToken: null, isLoading: false });
    router.push("/auth/login");
  }, [state.accessToken, router]);

  // ── Get token (sync) ──────────────────────────────────────────────────────
  const getToken = useCallback(() => state.accessToken, [state.accessToken]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}