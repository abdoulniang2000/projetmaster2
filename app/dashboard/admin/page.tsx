'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileText, CheckCircle, TrendingUp, Activity, AlertCircle, Settings, Download, MessageSquare, Bell, BarChart3, Calendar, Clock, Target, Award, UserCheck, BookMarked, Trash2, Edit, Eye, Ban, User, Mail, Inbox } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalUsers: number;
    totalCours: number;
    totalDevoirs: number;
    totalSoumissions: number;
    activeStudents: number;
    submissionRate: number;
    averageGrade: number;
    weeklyActivity: number;
    pendingValidations: number;
    reportedContent: number;
    systemHealth: number;
    storageUsed: number;
}

interface RecentActivity {
    id: string;
    type: 'user' | 'course' | 'assignment' | 'submission';
    description: string;
    timestamp: string;
    user: string;
    priority: 'low' | 'medium' | 'high';
}

interface SystemAlert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
    action?: string;
}

function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalCours: 0,
        totalDevoirs: 0,
        totalSoumissions: 0,
        activeStudents: 0,
        submissionRate: 0,
        averageGrade: 0,
        weeklyActivity: 0,
        pendingValidations: 0,
        reportedContent: 0,
        systemHealth: 100,
        storageUsed: 0
    });
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [cours, setCours] = useState([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [analyticsRes, usersRes, coursesRes] = await Promise.all([
                    axios.get('/v1/analytics/dashboard').catch(() => ({ data: { stats: { utilisateurs: { total: 0, actifs: 0 } } } })),
                    axios.get('/v1/users').catch(() => ({ data: [] })),
                    axios.get('/v1/cours').catch(() => ({ data: [] }))
                ]);

                const analyticsData = analyticsRes.data;
                const users = usersRes.data || [];
                const cours = coursesRes.data || [];

                const devoirs: any[] = [];
                const soumissions: any[] = [];
                const activeStudents = analyticsData.stats?.utilisateurs?.actifs || 0;

                const submissionRate = devoirs.length > 0 ?
                    Math.round((soumissions.length / devoirs.length) * 100) : 0;

                const averageGrade = soumissions.length > 0 ?
                    Math.round(soumissions.reduce((acc: number, s: any) => acc + (s.grade || 0), 0) / soumissions.length) : 0;

                setStats({
                    totalUsers: users.length,
                    totalCours: cours.length,
                    totalDevoirs: devoirs.length,
                    totalSoumissions: soumissions.length,
                    activeStudents,
                    submissionRate,
                    averageGrade,
                    weeklyActivity: Math.floor(Math.random() * 1000) + 500,
                    pendingValidations: users.filter((u: any) => !u.validated).length,
                    reportedContent: Math.floor(Math.random() * 5),
                    systemHealth: 95 + Math.floor(Math.random() * 5),
                    storageUsed: Math.floor(Math.random() * 80) + 20
                });

                // Simuler l'activité récente
                setRecentActivities([
                    {
                        id: '1',
                        type: 'user',
                        description: 'Nouvel étudiant inscrit',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        user: 'Jean Dupont',
                        priority: 'medium'
                    },
                    {
                        id: '2',
                        type: 'assignment',
                        description: 'Nouveau devoir soumis',
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                        user: 'Marie Curie',
                        priority: 'low'
                    },
                    {
                        id: '3',
                        type: 'course',
                        description: 'Nouveau cours publié',
                        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                        user: 'Prof. Martin',
                        priority: 'high'
                    }
                ]);

                // Simuler les alertes système
                setSystemAlerts([
                    {
                        id: '1',
                        type: 'warning',
                        message: 'Espace disque faible sur le serveur',
                        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                        action: 'Vérifier le stockage'
                    },
                    {
                        id: '2',
                        type: 'info',
                        message: 'Mise à jour système disponible',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        action: 'Voir les détails'
                    }
                ]);

            } catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
                setStats({
                    totalUsers: 0,
                    totalCours: 0,
                    totalDevoirs: 0,
                    totalSoumissions: 0,
                    activeStudents: 0,
                    submissionRate: 0,
                    averageGrade: 0,
                    weeklyActivity: 0,
                    pendingValidations: 0,
                    reportedContent: 0,
                    systemHealth: 0,
                    storageUsed: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Utilisateurs',
            value: stats.totalUsers,
            subtitle: `${stats.activeStudents} actifs cette semaine`,
            icon: Users,
            color: 'orange',
            trend: '+12%',
            positive: true,
            detail: 'Étudiants: ' + stats.totalUsers * 0.8 + ', Enseignants: ' + stats.totalUsers * 0.15 + ', Admins: ' + stats.totalUsers * 0.05
        },
        {
            title: 'Cours',
            value: stats.totalCours,
            subtitle: 'Modules publiés',
            icon: BookOpen,
            color: 'blue',
            trend: '+8%',
            positive: true,
            detail: 'Actifs: ' + Math.floor(stats.totalCours * 0.9) + ', En préparation: ' + Math.ceil(stats.totalCours * 0.1)
        },
        {
            title: 'Devoirs',
            value: stats.totalDevoirs,
            subtitle: `Taux de soumission: ${stats.submissionRate}%`,
            icon: FileText,
            color: 'green',
            trend: '+15%',
            positive: true,
            detail: 'À corriger: ' + Math.max(0, stats.totalSoumissions - stats.totalDevoirs * 0.7)
        },
        {
            title: 'Performance',
            value: stats.averageGrade + '%',
            subtitle: 'Note moyenne',
            icon: Award,
            color: 'purple',
            trend: '+3%',
            positive: true,
            detail: 'Réussite: ' + Math.floor(stats.averageGrade * 0.8) + '%'
        },
        {
            title: 'Activité',
            value: stats.weeklyActivity,
            subtitle: 'Actions cette semaine',
            icon: Activity,
            color: 'indigo',
            trend: '+22%',
            positive: true,
            detail: 'Pages vues: ' + Math.floor(stats.weeklyActivity * 2.5)
        },
        {
            title: 'Validations',
            value: stats.pendingValidations,
            subtitle: 'En attente',
            icon: UserCheck,
            color: 'yellow',
            trend: '-5%',
            positive: true,
            detail: 'Urgents: ' + Math.floor(stats.pendingValidations * 0.3)
        }
    ];

    const quickActions = [
        {
            title: 'Dashboard',
            description: 'Vue d\'ensemble des statistiques et activités',
            icon: BarChart3,
            color: 'blue',
            href: '/dashboard/admin'
        },
        {
            title: 'Utilisateurs',
            description: 'Gérer les comptes utilisateurs et les rôles',
            icon: Users,
            color: 'orange',
            href: '/dashboard/admin/users'
        },
        {
            title: 'Modules',
            description: 'Gérer les modules, matières et semestres',
            icon: BookOpen,
            color: 'green',
            href: '/dashboard/admin/modules'
        },
        {
            title: 'Messagerie',
            description: 'Consulter et envoyer des messages',
            icon: Mail,
            color: 'purple',
            href: '/dashboard/admin/messages'
        },
        {
            title: 'Notifications',
            description: 'Gérer les notifications système',
            icon: Bell,
            color: 'indigo',
            href: '/dashboard/admin/notifications'
        },
        {
            title: 'Profil',
            description: 'Gérer votre profil administrateur',
            icon: User,
            color: 'yellow',
            href: '/dashboard/admin/profile'
        }
    ];


    const getStatCardClasses = (color: string) => {
        const colorClasses = {
            orange: 'from-orange-400 to-orange-600 shadow-orange',
            blue: 'from-blue-400 to-blue-600 shadow-blue',
            green: 'from-green-400 to-green-600 shadow-green',
            purple: 'from-purple-400 to-purple-600 shadow-purple',
            indigo: 'from-indigo-400 to-indigo-600 shadow-indigo',
            yellow: 'from-yellow-400 to-yellow-600 shadow-yellow'
        };
        return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
    };

    const getActionCardClasses = (color: string) => {
        const colorClasses = {
            orange: 'card-orange hover:shadow-orange',
            blue: 'card-blue hover:shadow-blue',
            green: 'card-green hover:shadow-green',
            purple: 'bg-purple-50 hover:shadow-purple',
            indigo: 'bg-indigo-50 hover:shadow-indigo',
            yellow: 'bg-yellow-50 hover:shadow-yellow'
        };
        return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Tableau de bord Admin
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez votre plateforme d'apprentissage</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleString('fr-FR')}</p>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Statistiques globales</h2>
                    <div className="flex space-x-2">
                        {(['week', 'month', 'year'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={card.title}
                            className={`card-gradient p-6 animate-scaleIn hover:transform hover:scale-105 transition-all duration-300 cursor-pointer`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${getStatCardClasses(card.color)} rounded-xl flex items-center justify-center text-white`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center text-sm font-medium ${card.positive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    {card.trend}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                                <p className="text-sm text-gray-600 mb-2">{card.subtitle}</p>
                                <p className="text-xs text-gray-500">{card.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions rapides */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className={`card-gradient p-6 rounded-xl ${getActionCardClasses(action.color)} animate-fadeInUp hover:transform hover:scale-105 transition-all duration-300 cursor-pointer`}
                            style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`w-10 h-10 bg-gradient-to-br ${getStatCardClasses(action.color)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                                    <p className="text-sm text-gray-600">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Activité récente */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Activité récente</h2>
                    <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-fadeInUp">
                            <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'user' ? 'bg-orange-100' :
                                    activity.type === 'course' ? 'bg-blue-100' :
                                        activity.type === 'assignment' ? 'bg-green-100' :
                                            'bg-purple-100'
                                    }`}>
                                    {
                                        activity.type === 'user' ? <Users className="w-4 h-4 text-orange-600" /> :
                                            activity.type === 'course' ? <BookOpen className="w-4 h-4 text-blue-600" /> :
                                                activity.type === 'assignment' ? <FileText className="w-4 h-4 text-green-600" /> :
                                                    <CheckCircle className="w-4 h-4 text-purple-600" />
                                    }
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {activity.priority === 'high' ? 'Urgent' : activity.priority === 'medium' ? 'Moyen' : 'Bas'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-xs text-gray-500">{activity.user}</p>
                                        <span className="text-gray-300">•</span>
                                        <p className="text-xs text-gray-500">
                                            {new Date(activity.timestamp).toLocaleString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default withAuth(AdminDashboardPage);
