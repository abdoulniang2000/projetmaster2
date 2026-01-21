'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Home, Book, Edit3, MessageSquare, User, Bell, Shield, LogOut, Settings, Users, BookOpen, Mail, BarChart3, CheckCircle, Download, FileText, MessageCircle, Calendar, Award, Clock, Upload } from 'lucide-react';

const studentLinks = [
    { href: '/dashboard/etudiant', label: 'Dashboard', icon: Home, color: 'orange' },
    { href: '/dashboard/etudiant/cours', label: 'Mes Cours', icon: Book, color: 'blue' },
    { href: '/dashboard/etudiant/supports', label: 'Supports de cours', icon: Download, color: 'green' },
    { href: '/dashboard/etudiant/devoirs', label: 'Dépôt de devoirs', icon: Upload, color: 'purple' },
    { href: '/dashboard/etudiant/notes', label: 'Notes & Feedback', icon: Award, color: 'indigo' },
    { href: '/dashboard/etudiant/forums', label: 'Forums', icon: MessageCircle, color: 'yellow' },
    { href: '/dashboard/etudiant/calendrier', label: 'Calendrier', icon: Calendar, color: 'red' },
];

const enseignantLinks = [
    { href: '/dashboard/enseignant', label: 'Dashboard', icon: Home, color: 'orange' },
    { href: '/dashboard/enseignant/cours', label: 'Gestion des Cours', icon: Book, color: 'blue' },
    { href: '/dashboard/enseignant/supports', label: 'Supports Pédagogiques', icon: BookOpen, color: 'green' },
    { href: '/dashboard/enseignant/devoirs', label: 'Gestion des Devoirs', icon: Edit3, color: 'purple' },
    { href: '/dashboard/enseignant/corrections', label: 'Corrections', icon: CheckCircle, color: 'indigo' },
    { href: '/dashboard/enseignant/annonces', label: 'Annonces', icon: Bell, color: 'yellow' },
    { href: '/dashboard/enseignant/etudiants', label: 'Gestion Étudiants', icon: Users, color: 'red' },
];

const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: BarChart3, color: 'blue' },
    { href: '/dashboard/admin/users', label: 'Utilisateurs', icon: Users, color: 'orange' },
    { href: '/dashboard/admin/modules', label: 'Modules', icon: BookOpen, color: 'green' },
    { href: '/dashboard/admin/messages', label: 'Messagerie', icon: Mail, color: 'purple' },
    { href: '/dashboard/admin/notifications', label: 'Notifications', icon: Bell, color: 'indigo' },
    { href: '/dashboard/admin/profile', label: 'Profil', icon: User, color: 'yellow' },
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

        // Ajouter les liens communs seulement pour les non-admins
        if (!isAdmin) {
            navLinks = [...navLinks, ...commonLinks];
        }
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
                case 'purple':
                    return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25`;
                case 'indigo':
                    return `${baseClasses} bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25`;
                case 'yellow':
                    return `${baseClasses} bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25`;
                case 'red':
                    return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25`;
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
                case 'purple':
                    return `${baseClasses} hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200 hover:text-purple-700 text-gray-700`;
                case 'indigo':
                    return `${baseClasses} hover:bg-gradient-to-r hover:from-indigo-100 hover:to-indigo-200 hover:text-indigo-700 text-gray-700`;
                case 'yellow':
                    return `${baseClasses} hover:bg-gradient-to-r hover:from-yellow-100 hover:to-yellow-200 hover:text-yellow-700 text-gray-700`;
                case 'red':
                    return `${baseClasses} hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 hover:text-red-700 text-gray-700`;
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
            case 'purple': return 'text-purple-500';
            case 'indigo': return 'text-indigo-500';
            case 'yellow': return 'text-yellow-500';
            case 'red': return 'text-red-500';
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
