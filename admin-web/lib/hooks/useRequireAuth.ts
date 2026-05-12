"use client";

import { useRouter } from "next/router";
import { isAllowedRole, useAuth } from "../context/AuthContext";
import { useEffect } from "react";

/**
 * lib/hooks/useRequireAuth.ts
 *
 * Gunakan di setiap page yang butuh autentikasi.
 * Redirect ke /auth/login jika belum login.
 * Redirect ke /forbidden jika role tidak diizinkan.
 */

export function useRequireAuth(){
    const { user,  isLoading } = useAuth();
    const router = useRouter();

    useEffect(()=> {
        if (isLoading) return;

        if (!user) {
            router.replace("/auth/login");
            return;
        }

        if (!isAllowedRole(user.role)) {
            router.replace("/auth/login");
        }
    }, [user, isLoading, router]);

    return { user, isLoading };
}