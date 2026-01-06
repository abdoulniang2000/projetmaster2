'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, TrendingUp, Clock, Award, Target, Calendar, Play } from 'lucide-react';

interface Cours {
    id: number;
    nom: string;
    description: string;
    progression: number;
    instructeur: string;
}

function EtudiantDashboardPage() {
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const response = await axios.get('/v1/cours');
                setCours(response.data.slice(0, 6) || []);
            } catch (error) {
                console.error('Erreur lors du chargement des cours:', error);
                // En cas d'erreur, afficher un tableau vide
                setCours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCours();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de vos cours...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Cours actifs',
            value: cours.length,
            subtitle: 'En cours',
            icon: BookOpen,
            color: 'blue'
        },
        {
            title: 'Progression moyenne',
            value: '68%',
            subtitle: 'Taux de complétion',
            icon: TrendingUp,
            color: 'green'
        },
        {
            title: 'Temps d\'étude',
            value: '12h',
            subtitle: 'Cette semaine',
            icon: Clock,
            color: 'orange'
        },
        {
            title: 'Certificats',
            value: 2,
            subtitle: 'Obtenus',
            icon: Award,
            color: 'purple'
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

    const getProgressionColor = (progression: number) => {
        if (progression >= 80) return 'bg-green-500';
        if (progression >= 50) return 'bg-blue-500';
        if (progression >= 30) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Mon Tableau de Bord
                </h1>
                <p className="text-gray-600 mt-2">Continuez votre apprentissage et suivez votre progression</p>
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
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                            <p className="text-sm text-gray-600">{card.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cours récents */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            <span>Mes cours</span>
                        </div>
                        <Link href="/dashboard/cours" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Voir tous les cours →
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {cours.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cours.map((c) => (
                                <div key={c.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    {/* En-tête du cours */}
                                    <div className="h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative">
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-white font-bold text-lg mb-1">{c.nom}</h3>
                                            <p className="text-white/90 text-sm">Prof. {c.instructeur}</p>
                                        </div>
                                    </div>

                                    {/* Contenu du cours */}
                                    <div className="p-4">
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{c.description}</p>

                                        {/* Barre de progression */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Progression</span>
                                                <span className="text-sm font-bold text-gray-900">{c.progression}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${getProgressionColor(c.progression)}`}
                                                    style={{ width: `${c.progression}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/dashboard/cours/${c.id}`}
                                                className="btn-gradient-blue text-sm px-4 py-2"
                                            >
                                                <Play className="w-4 h-4 mr-1" />
                                                Continuer
                                            </Link>
                                            {c.progression === 100 && (
                                                <div className="flex items-center text-green-600 text-sm font-medium">
                                                    <Award className="w-4 h-4 mr-1" />
                                                    Terminé
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun cours disponible</h3>
                            <p className="text-gray-600 mb-6">Commencez par explorer notre catalogue de cours</p>
                            <Link href="/dashboard/cours" className="btn-gradient-primary">
                                Explorer les cours
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Objectifs et recommandations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Objectifs de la semaine */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Target className="w-5 h-5 text-orange-500" />
                            <span>Objectifs de la semaine</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Terminer le module React</p>
                                        <p className="text-sm text-gray-600">2 leçons restantes</p>
                                    </div>
                                </div>
                                <div className="text-orange-600 font-bold">75%</div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Soumettre le devoir JS</p>
                                        <p className="text-sm text-gray-600">Date limite: Vendredi</p>
                                    </div>
                                </div>
                                <div className="text-blue-600 font-bold">0%</div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Revoir les notes</p>
                                        <p className="text-sm text-gray-600">Terminé</p>
                                    </div>
                                </div>
                                <div className="text-green-600 font-bold">100%</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Prochains événements */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-green-500" />
                            <span>Prochains événements</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Examen JavaScript</p>
                                    <p className="text-sm text-gray-600">Aujourd'hui, 14:00</p>
                                    <p className="text-xs text-red-600 font-medium">Dans 2 heures</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Session Q&A React</p>
                                    <p className="text-sm text-gray-600">Demain, 16:00</p>
                                    <p className="text-xs text-blue-600 font-medium">En ligne</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Limite devoir Design</p>
                                    <p className="text-sm text-gray-600">Vendredi, 23:59</p>
                                    <p className="text-xs text-gray-600">Dans 3 jours</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default withAuth(EtudiantDashboardPage);
