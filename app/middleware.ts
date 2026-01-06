import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value || '';
    const isLoginPage = request.nextUrl.pathname === '/';
    const isRegisterPage = request.nextUrl.pathname === '/register';
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

    // Si l'utilisateur a un token et essaie d'accéder à la page d'accueil (connexion), le rediriger vers dashboard
    if (token && (isLoginPage || isRegisterPage)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Ne pas bloquer l'accès au dashboard - laisser le composant withAuth gérer l'authentification côté client
    // Le middleware ne fait que rediriger les utilisateurs déjà authentifiés loin de la page de connexion

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/register', '/dashboard/:path*']
};
