'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, BookOpen, FileText, Activity, Calendar, Download, Filter } from 'lucide-react';

interface Analytics {
    totalUsers: number;
    activeUsers: number;
    totalCours: number;
    totalDevoirs: number;
    totalSoumissions: number;
    completionRate: number;
    averageGrade: number;
}

function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics>({
        totalUsers: 0,
        activeUsers: 0,
        totalCours: 0,
        totalDevoirs: 0,
        totalSoumissions: 0,
        completionRate: 0,
        averageGrade: 0
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Simuler des données d'analyse
                setAnalytics({
                    totalUsers: 150,
                    activeUsers: 120,
                    totalCours: 25,
                    totalDevoirs: 45,
                    totalSoumissions: 380,
                    completionRate: 78,
                    averageGrade: 15.5
                });
            } catch (error) {
                console.error('Erreur lors du chargement des analyses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des analyses...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Utilisateurs totaux',
            value: analytics.totalUsers,
            subtitle: `${analytics.activeUsers} actifs ce mois`,
            icon: Users,
            color: 'orange',
            trend: '+12%',
            positive: true
        },
        {
            title: 'Cours',
            value: analytics.totalCours,
            subtitle: 'Cours publiés',
            icon: BookOpen,
            color: 'blue',
            trend: '+8%',
            positive: true
        },
        {
            title: 'Devoirs',
            value: analytics.totalDevoirs,
            subtitle: `${analytics.totalSoumissions} soumissions`,
            icon: FileText,
            color: 'green',
            trend: '+15%',
            positive: true
        },
        {
            title: 'Taux de complétion',
            value: `${analytics.completionRate}%`,
            subtitle: 'Moyenne de complétion',
            icon: Activity,
            color: 'purple',
            trend: '+5%',
            positive: true
        }
    ];

    const getStatCardClasses = (color: string) => {
        const colorClasses = {
            orange: 'from-orange-400 to-orange-600 shadow-orange',
            blue: 'from-blue-400 to-blue-600 shadow-blue',
            green: 'from-green-400 to-green-600 shadow-green',
            purple: 'from-purple-400 to-purple-600 shadow-purple'
        };
        return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Analyses et Statistiques
                    </h1>
                    <p className="text-gray-600 mt-2">Suivez les performances de votre plateforme</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        className="input-gradient"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="week">Dernière semaine</option>
                        <option value="month">Dernier mois</option>
                        <option value="quarter">Dernier trimestre</option>
                        <option value="year">Dernière année</option>
                    </select>
                    <button className="btn-gradient-primary flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Exporter</span>
                    </button>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div
                        key={card.title}
                        className={`card-gradient p-6 animate-scaleIn hover:transform hover:scale-105 transition-all duration-300`}
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
                            <p className="text-sm text-gray-600">{card.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graphique d'activité */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            <span>Activité des utilisateurs</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Graphique d'activité à implémenter</p>
                                <p className="text-sm text-gray-500 mt-2">Utilisateurs actifs par jour</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Graphique de progression */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <span>Taux de complétion des cours</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Graphique de progression à implémenter</p>
                                <p className="text-sm text-gray-500 mt-2">Taux moyen: {analytics.completionRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tableau de performances */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                        <span>Performance des cours</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cours</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Inscrits</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Complétés</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Taux de complétion</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Note moyenne</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">Introduction à React</td>
                                    <td className="py-3 px-4">45</td>
                                    <td className="py-3 px-4">38</td>
                                    <td className="py-3 px-4">
                                        <span className="text-green-600 font-medium">84%</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-blue-600 font-medium">16.2/20</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">JavaScript Avancé</td>
                                    <td className="py-3 px-4">32</td>
                                    <td className="py-3 px-4">25</td>
                                    <td className="py-3 px-4">
                                        <span className="text-green-600 font-medium">78%</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-blue-600 font-medium">15.8/20</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">Design UI/UX</td>
                                    <td className="py-3 px-4">28</td>
                                    <td className="py-3 px-4">20</td>
                                    <td className="py-3 px-4">
                                        <span className="text-yellow-600 font-medium">71%</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-blue-600 font-medium">14.5/20</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Statistiques supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="text-lg">Note moyenne générale</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{analytics.averageGrade}/20</p>
                            <p className="text-sm text-gray-600 mt-2">Sur tous les devoirs</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="text-lg">Temps moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">2h 30min</p>
                            <p className="text-sm text-gray-600 mt-2">Par jour d'étude</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="text-lg">Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-orange-600">4.8/5</p>
                            <p className="text-sm text-gray-600 mt-2">Note de satisfaction</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default withAuth(AnalyticsPage);
