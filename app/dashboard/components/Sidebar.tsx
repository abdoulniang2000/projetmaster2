'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Home, Book, Edit3, MessageSquare, User, Bell, Shield, LogOut, Settings } from 'lucide-react';

const studentLinks = [
    { href: '/dashboard/etudiant', label: 'Dashboard', icon: Home, color: 'orange' },
    { href: '/dashboard/cours', label: 'Mes Cours', icon: Book, color: 'blue' },
    { href: '/dashboard/notes', label: 'Mes Notes', icon: Edit3, color: 'green' },
];

const enseignantLinks = [
    { href: '/dashboard/enseignant', label: 'Dashboard', icon: Home, color: 'orange' },
    { href: '/dashboard/cours', label: 'Mes Cours', icon: Book, color: 'blue' },
    { href: '/dashboard/devoirs', label: 'Devoirs', icon: Edit3, color: 'green' },
];

const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: Shield, color: 'orange' },
    { href: '/dashboard/cours', label: 'Gestion Cours', icon: Book, color: 'blue' },
    { href: '/dashboard/devoirs', label: 'Gestion Devoirs', icon: Edit3, color: 'green' },
];

const commonLinks = [
    { href: '/dashboard/messagerie', label: 'Messagerie', icon: MessageSquare, color: 'blue' },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, color: 'orange' },
    { href: '/dashboard/profil', label: 'Profil', icon: User, color: 'green' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    let navLinks: { href: string; label: string; icon: React.ElementType; color: string }[] = [];

    if (user) {
        const isAdmin = user.roles.some(role => role.name === 'admin');
        const isEnseignant = user.roles.some(role => role.name === 'enseignant');

        if (isAdmin) navLinks = [...adminLinks];
        else if (isEnseignant) navLinks = [...enseignantLinks];
        else navLinks = [...studentLinks];

        navLinks = [...navLinks, ...commonLinks];
    }

    const getColorClasses = (color: string, isActive: boolean) => {
        const baseClasses = 'transition-all duration-300 ease-in-out transform hover:scale-105';
        if (isActive) {
            switch (color) {
                case 'orange':
                    return `${baseClasses} bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25`;
                case 'blue':
                    return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25`;
                case 'green':
                    return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25`;
                default:
                    return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white`;
            }
        } else {
            switch (color) {
                case 'orange':
                    return `${baseClasses} hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-200 hover:text-orange-700 text-gray-700`;
                case 'blue':
                    return `${baseClasses} hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 text-gray-700`;
                case 'green':
                    return `${baseClasses} hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 hover:text-green-700 text-gray-700`;
                default:
                    return `${baseClasses} hover:bg-gray-100 text-gray-700`;
            }
        }
    };

    const getIconColor = (color: string, isActive: boolean) => {
        if (isActive) return 'text-white';
        switch (color) {
            case 'orange': return 'text-orange-500';
            case 'blue': return 'text-blue-500';
            case 'green': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <aside className="w-72 bg-white/95 backdrop-blur-lg border-r border-gray-200/50 shadow-xl flex flex-col animate-fadeInLeft">
            {/* Logo et titre */}
            <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-blue-500 to-green-500 rounded-xl flex items-center justify-center animate-pulse-slow">
                        <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                            LMS Platform
                        </h1>
                        <p className="text-xs text-gray-500">Espace d'apprentissage</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navLinks.map(({ href, label, icon: Icon, color }, index) => {
                    const isActive = pathname === href;
                    return (
                        <Link key={href} href={href}>
                            <div
                                className={`flex items-center px-4 py-3 rounded-xl font-medium ${getColorClasses(color, isActive)} animate-fadeInLeft`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Icon className={`mr-3 w-5 h-5 ${getIconColor(color, isActive)}`} />
                                <span>{label}</span>
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer avec déconnexion */}
            <div className="p-4 border-t border-gray-200/50">
                <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    <LogOut className="mr-3 w-5 h-5" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
