'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Users, CheckCircle, TrendingUp, Activity, Bell, Calendar, Clock, Target, Award, Upload, Edit, Eye, Plus } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalCours: number;
    totalDevoirs: number;
    totalEtudiants: number;
    totalSoumissions: number;
    pendingCorrections: number;
    publishedAnnonces: number;
    averageGrade: number;
    weeklyActivity: number;
    upcomingDeadlines: number;
    newSubmissions: number;
}

interface RecentActivity {
    id: string;
    type: 'course' | 'assignment' | 'submission' | 'announcement';
    description: string;
    timestamp: string;
    user: string;
    priority: 'low' | 'medium' | 'high';
}

interface UpcomingDeadline {
    id: string;
    title: string;
    course: string;
    deadline: string;
    submissionsCount: number;
}

function EnseignantDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalCours: 0,
        totalDevoirs: 0,
        totalEtudiants: 0,
        totalSoumissions: 0,
        pendingCorrections: 0,
        publishedAnnonces: 0,
        averageGrade: 0,
        weeklyActivity: 0,
        upcomingDeadlines: 0,
        newSubmissions: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [coursesRes, assignmentsRes, usersRes] = await Promise.all([
                    axios.get('/v1/cours/enseignant'),
                    axios.get('/v1/devoirs/enseignant'),
                    axios.get('/v1/users/etudiants')
                ]);

                const cours = coursesRes.data || [];
                const devoirs = assignmentsRes.data || [];
                const etudiants = usersRes.data || [];

                // Simuler les soumissions et corrections
                const soumissions = devoirs.length * 3; // Simulation
                const pendingCorrections = Math.floor(soumissions * 0.3);

                const averageGrade = soumissions > 0 ?
                    Math.round(Math.random() * 20 + 10) : 0;

                setStats({
                    totalCours: cours.length,
                    totalDevoirs: devoirs.length,
                    totalEtudiants: etudiants.length,
                    totalSoumissions: soumissions,
                    pendingCorrections,
                    publishedAnnonces: Math.floor(Math.random() * 10) + 5,
                    averageGrade,
                    weeklyActivity: Math.floor(Math.random() * 500) + 200,
                    upcomingDeadlines: devoirs.filter((d: any) => new Date(d.date_limite) > new Date()).length,
                    newSubmissions: Math.floor(Math.random() * 10) + 1
                });

                // Simuler l'activité récente
                setRecentActivities([
                    {
                        id: '1',
                        type: 'submission',
                        description: 'Nouvelle soumission de devoir',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        user: 'Alice Martin',
                        priority: 'medium'
                    },
                    {
                        id: '2',
                        type: 'course',
                        description: 'Nouveau support pédagogique ajouté',
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                        user: 'Vous',
                        priority: 'low'
                    },
                    {
                        id: '3',
                        type: 'assignment',
                        description: 'Nouveau devoir créé',
                        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                        user: 'Vous',
                        priority: 'high'
                    },
                    {
                        id: '4',
                        type: 'announcement',
                        description: 'Annonce publiée aux étudiants',
                        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                        user: 'Vous',
                        priority: 'medium'
                    }
                ]);

                // Simuler les échéances à venir
                setUpcomingDeadlines([
                    {
                        id: '1',
                        title: 'Devoir Final',
                        course: 'Mathématiques',
                        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                        submissionsCount: 12
                    },
                    {
                        id: '2',
                        title: 'Projet Groupe',
                        course: 'Informatique',
                        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        submissionsCount: 8
                    }
                ]);

            } catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
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
            title: 'Mes Cours',
            value: stats.totalCours,
            subtitle: 'Modules actifs',
            icon: BookOpen,
            color: 'blue',
            trend: '+2 ce mois',
            positive: true,
            detail: `${stats.totalEtudiants} étudiants inscrits`
        },
        {
            title: 'Devoirs',
            value: stats.totalDevoirs,
            subtitle: `${stats.pendingCorrections} à corriger`,
            icon: FileText,
            color: 'green',
            trend: '+5 cette semaine',
            positive: true,
            detail: `${stats.totalSoumissions} soumissions totales`
        },
        {
            title: 'Étudiants',
            value: stats.totalEtudiants,
            subtitle: 'Actifs cette semaine',
            icon: Users,
            color: 'orange',
            trend: '+12%',
            positive: true,
            detail: 'Moyenne: ' + Math.floor(stats.totalEtudiants * 0.8) + ' par cours'
        },
        {
            title: 'Corrections',
            value: stats.pendingCorrections,
            subtitle: 'En attente',
            icon: CheckCircle,
            color: 'purple',
            trend: '-3',
            positive: true,
            detail: 'Urgentes: ' + Math.floor(stats.pendingCorrections * 0.4)
        },
        {
            title: 'Performance',
            value: stats.averageGrade + '/20',
            subtitle: 'Note moyenne',
            icon: Award,
            color: 'indigo',
            trend: '+1.5',
            positive: true,
            detail: 'Réussite: ' + Math.floor(stats.averageGrade * 5) + '%'
        },
        {
            title: 'Activité',
            value: stats.weeklyActivity,
            subtitle: 'Actions cette semaine',
            icon: Activity,
            color: 'yellow',
            trend: '+25%',
            positive: true,
            detail: `${stats.newSubmissions} nouvelles soumissions`
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

    const quickActions = [
        {
            title: 'Nouveau Cours',
            description: 'Créer un nouveau cours',
            icon: Plus,
            color: 'blue',
            href: '/dashboard/enseignant/cours'
        },
        {
            title: 'Ajouter Devoir',
            description: 'Créer un nouveau devoir',
            icon: Plus,
            color: 'green',
            href: '/dashboard/enseignant/devoirs'
        },
        {
            title: 'Supports',
            description: 'Gérer les supports pédagogiques',
            icon: Upload,
            color: 'purple',
            href: '/dashboard/enseignant/supports'
        },
        {
            title: 'Corrections',
            description: 'Corriger les devoirs',
            icon: CheckCircle,
            color: 'indigo',
            href: '/dashboard/enseignant/corrections'
        },
        {
            title: 'Annonces',
            description: 'Publier une annonce',
            icon: Bell,
            color: 'yellow',
            href: '/dashboard/enseignant/annonces'
        },
        {
            title: 'Étudiants',
            description: 'Gérer les étudiants',
            icon: Users,
            color: 'orange',
            href: '/dashboard/enseignant/etudiants'
        }
    ];

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                        Espace Enseignant
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez vos cours et suivez vos étudiants</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleString('fr-FR')}</p>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
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
                            style={{ animationDelay: `${(index + 6) * 0.1}s` }}
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

            {/* Échéances à venir */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Échéances à venir</h2>
                    <div className="space-y-3">
                        {upcomingDeadlines.map((deadline) => (
                            <div key={deadline.id} className="p-4 bg-red-50 rounded-lg border border-red-200 animate-fadeInUp">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-gray-900">{deadline.title}</p>
                                            <span className="text-sm text-red-600 font-medium">
                                                {new Date(deadline.deadline).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{deadline.course}</p>
                                        <p className="text-xs text-gray-500 mt-1">{deadline.submissionsCount} soumissions</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activité récente */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Activité récente</h2>
                    <div className="space-y-3">
                        {recentActivities.map((activity) => (
                            <Link key={activity.id} href="#" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-fadeInUp">
                                <div className="flex items-start space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'submission' ? 'bg-green-100' :
                                        activity.type === 'course' ? 'bg-blue-100' :
                                            activity.type === 'assignment' ? 'bg-purple-100' :
                                                'bg-yellow-100'
                                        }`}>
                                        {
                                            activity.type === 'submission' ? <FileText className="w-4 h-4 text-green-600" /> :
                                                activity.type === 'course' ? <BookOpen className="w-4 h-4 text-blue-600" /> :
                                                    activity.type === 'assignment' ? <Edit className="w-4 h-4 text-purple-600" /> :
                                                        <Bell className="w-4 h-4 text-yellow-600" />
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
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(EnseignantDashboardPage);
