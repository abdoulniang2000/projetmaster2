'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, FileText, Plus, BarChart3, MessageSquare, TrendingUp, Users, Clock } from 'lucide-react';

interface Cours {
    id: number;
    nom: string;
    description: string;
}

interface Devoir {
    id: number;
    titre: string;
    date_limite: string;
    cours: {
        nom: string;
    };
}

function EnseignantDashboardPage() {
    const [cours, setCours] = useState<Cours[]>([]);
    const [devoirs, setDevoirs] = useState<Devoir[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursRes, devoirsRes] = await Promise.all([
                    axios.get('/v1/cours'),
                    axios.get('/v1/devoirs')
                ]);

                setCours(coursRes.data.slice(0, 5) || []);
                setDevoirs(devoirsRes.data.slice(0, 5) || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                // En cas d'erreur, afficher des tableaux vides
                setCours([]);
                setDevoirs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            title: 'Mes cours',
            value: cours.length,
            subtitle: 'Cours actifs',
            icon: BookOpen,
            color: 'blue',
            href: '/dashboard/cours'
        },
        {
            title: 'Devoirs',
            value: devoirs.length,
            subtitle: 'Devoirs créés',
            icon: FileText,
            color: 'green',
            href: '/dashboard/devoirs'
        },
        {
            title: 'Étudiants',
            value: 45,
            subtitle: 'Étudiants totaux',
            icon: Users,
            color: 'orange',
            href: '#'
        },
        {
            title: 'Taux de complétion',
            value: '78%',
            subtitle: 'Moyenne',
            icon: TrendingUp,
            color: 'purple',
            href: '#'
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
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Tableau de bord Enseignant
                </h1>
                <p className="text-gray-600 mt-2">Gérez vos cours et suivez la progression de vos étudiants</p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <a
                        key={card.title}
                        href={card.href}
                        className={`card-gradient p-6 animate-scaleIn hover:transform hover:scale-105 transition-all duration-300 cursor-pointer`}
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
                    </a>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mes cours */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            <span>Mes cours récents</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cours.length > 0 ? (
                            <div className="space-y-4">
                                {cours.map((c) => (
                                    <div key={c.id} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                                        <h3 className="font-semibold text-gray-900 mb-2">{c.nom}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{c.description.substring(0, 100)}...</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-blue-600 font-medium">15 étudiants</span>
                                            <Link href={`/dashboard/cours/${c.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Voir détails →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                <Link href="/dashboard/cours" className="btn-gradient-blue w-full text-center">
                                    Voir tous les cours
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Aucun cours trouvé</p>
                                <button className="btn-gradient-blue mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Créer un cours
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Derniers devoirs */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            <span>Derniers devoirs</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {devoirs.length > 0 ? (
                            <div className="space-y-4">
                                {devoirs.map((d) => (
                                    <div key={d.id} className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300">
                                        <h3 className="font-semibold text-gray-900 mb-2">{d.titre}</h3>
                                        <p className="text-sm text-gray-600 mb-1">Cours: {d.cours.nom}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-xs text-orange-600">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Limite: {new Date(d.date_limite).toLocaleDateString('fr-FR')}
                                            </div>
                                            <Link href={`/dashboard/devoirs/${d.id}`} className="text-green-600 hover:text-green-800 text-sm font-medium">
                                                Gérer →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                <Link href="/dashboard/devoirs" className="btn-gradient-green w-full text-center">
                                    Voir tous les devoirs
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Aucun devoir trouvé</p>
                                <button className="btn-gradient-green mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Créer un devoir
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions rapides */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Plus className="w-5 h-5 text-orange-500" />
                        <span>Actions rapides</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-left">
                            <Plus className="w-6 h-6 text-blue-600 mb-2" />
                            <h3 className="font-semibold text-gray-900">Créer un cours</h3>
                            <p className="text-sm text-gray-600">Ajouter un nouveau cours</p>
                        </button>
                        <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300 text-left">
                            <Plus className="w-6 h-6 text-green-600 mb-2" />
                            <h3 className="font-semibold text-gray-900">Créer un devoir</h3>
                            <p className="text-sm text-gray-600">Ajouter un nouveau devoir</p>
                        </button>
                        <Link href="/dashboard/notes" className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300 text-left block">
                            <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
                            <h3 className="font-semibold text-gray-900">Gérer les notes</h3>
                            <p className="text-sm text-gray-600">Noter les soumissions</p>
                        </Link>
                        <Link href="/dashboard/messagerie" className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 text-left block">
                            <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
                            <h3 className="font-semibold text-gray-900">Messagerie</h3>
                            <p className="text-sm text-gray-600">Contacter les étudiants</p>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(EnseignantDashboardPage);
