const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";


export interface UserResponse {
    id: string;
    email: string;
    role: "super_admin" | "hr" | "employee";
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: UserResponse;
}

export interface AccessTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface ApiError {
    error_code: string;
    message: string;
    details?: unknown;
}


// ── Helpers ────────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok){
        throw data as ApiError;
    }
    return data as T
}

// ── Auth API  ──────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-type":"application/json" },
        body: JSON.stringify({ email,password }),
    });
    return handleResponse<TokenResponse>(res);
}

export async function apiLogout(accessToken: string): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { 
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}` 
        },
    });
}

export async function apiRefreshToken(refreshToken: string): Promise<AccessTokenResponse> {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return handleResponse<AccessTokenResponse>(res);
}

export async function apiGetMe(accessToken: string): Promise<UserResponse> {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return handleResponse<UserResponse>(res);
}