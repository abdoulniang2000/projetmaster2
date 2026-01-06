'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, Plus, Users, Clock, Edit, Trash2, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

interface Cours {
    id: number;
    nom: string;
    description: string;
    enseignant: {
        first_name: string;
        last_name: string;
    };
    nombre_etudiants?: number;
    created_at?: string;
}

export default function CoursList() {
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [retryCount, setRetryCount] = useState(0);

    const fetchCours = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/v1/cours');
            setCours(response.data || []);
            setError(null);
        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
            setError('Impossible de charger les cours. Veuillez vérifier votre connexion ou réessayer plus tard.');
            setCours([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCours();
    }, [retryCount]);

    const filteredCours = cours.filter(c =>
        c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des cours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8 animate-fadeInUp">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Tous les Cours
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez et explorez tous les cours disponibles</p>
                </div>

                <Card className="card-gradient border-red-200">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleRetry}
                                className="btn-gradient-blue flex items-center justify-center space-x-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Réessayer</span>
                            </button>
                            <button className="btn-gradient-primary flex items-center justify-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Créer un cours</span>
                            </button>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Solutions possibles :</strong>
                            </p>
                            <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
                                <li>• Vérifiez votre connexion internet</li>
                                <li>• Assurez-vous que le serveur backend est en cours d'exécution</li>
                                <li>• Contactez l'administrateur si le problème persiste</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête avec actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Tous les Cours
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez et explorez tous les cours disponibles</p>
                </div>
                <button className="btn-gradient-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Créer un cours</span>
                </button>
            </div>

            {/* Filtres et recherche */}
            <Card className="card-gradient">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un cours..."
                                className="input-gradient w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="input-gradient pl-10 appearance-none"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">Tous les cours</option>
                                <option value="recent">Récents</option>
                                <option value="popular">Populaires</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total cours</p>
                                <p className="text-2xl font-bold text-gray-900">{cours.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total étudiants</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {cours.reduce((sum, c) => sum + (c.nombre_etudiants || 0), 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Moyenne étudiants</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {cours.length > 0 ? Math.round(cours.reduce((sum, c) => sum + (c.nombre_etudiants || 0), 0) / cours.length) : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <Plus className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Grille des cours */}
            {cours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCours.map((c) => (
                        <Card key={c.id} className="card-gradient hover:transform hover:scale-105 transition-all duration-300">
                            <CardHeader>
                                <div className="h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg relative">
                                    <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <CardTitle className="text-white text-lg font-bold">{c.nom}</CardTitle>
                                        <p className="text-white/90 text-sm">
                                            Prof. {c.enseignant.first_name} {c.enseignant.last_name}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{c.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {c.nombre_etudiants || 0} étudiants
                                    </div>
                                    {c.created_at && (
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/dashboard/cours/${c.id}`}
                                        className="btn-gradient-blue text-sm px-4 py-2"
                                    >
                                        Voir détails
                                    </Link>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'Aucun cours trouvé pour cette recherche' : 'Aucun cours disponible'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm
                            ? 'Essayez avec d autres termes de recherche'
                            : 'Commencez par créer votre premier cours'
                        }
                    </p>
                    <button className="btn-gradient-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Créer un cours
                    </button>
                </div>
            )}
        </div>
    );
}
