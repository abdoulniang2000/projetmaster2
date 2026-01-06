'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

export default function AuthGuard({
    children,
    requireAuth = true,
    redirectTo = '/'
}: AuthGuardProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Si l'authentification est requise et que l'utilisateur n'est pas connecté
        if (requireAuth && !user) {
            router.push(redirectTo);
            return;
        }

        // Si l'utilisateur est connecté et essaie d'accéder à la page de login/register
        if (!requireAuth && user && (redirectTo === '/login' || redirectTo === '/register')) {
            router.push('/dashboard');
            return;
        }
    }, [user, isLoading, requireAuth, redirectTo, router]);

    // Si l'authentification est requise et que l'utilisateur n'est pas encore chargé
    if (requireAuth && isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner-gradient"></div>
            </div>
        );
    }

    // Si l'authentification est requise et que l'utilisateur n'est pas connecté
    if (requireAuth && !user) {
        return null; // Le useEffect gérera la redirection
    }

    // Si l'utilisateur est connecté et essaie d'accéder à login/register
    if (!requireAuth && user) {
        return null; // Le useEffect gérera la redirection
    }

    return <>{children}</>;
}
