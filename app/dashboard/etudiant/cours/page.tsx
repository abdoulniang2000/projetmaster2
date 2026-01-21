'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BookOpen, Clock, Users, Star, Search, Filter, Play, CheckCircle, Lock } from 'lucide-react';

interface Cours {
    id: number;
    nom: string;
    description: string;
    progression: number;
    instructeur: string;
    duree: number;
    nombre_etudiants: number;
    note_moyenne: number;
    statut: 'actif' | 'terminé' | 'non_commencé';
    categorie: string;
    niveau: string;
}

function CoursPage() {
    const [cours, setCours] = useState<Cours[]>([]);
    const [filteredCours, setFilteredCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('tous');
    const [selectedStatus, setSelectedStatus] = useState('tous');

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const response = await axios.get('/v1/cours');
                const coursData = response.data.map((c: any) => ({
                    ...c,
                    progression: Math.floor(Math.random() * 100),
                    duree: Math.floor(Math.random() * 40) + 10,
                    nombre_etudiants: Math.floor(Math.random() * 200) + 50,
                    note_moyenne: (Math.random() * 2 + 3).toFixed(1),
                    statut: Math.random() > 0.7 ? 'terminé' : Math.random() > 0.3 ? 'actif' : 'non_commencé',
                    categorie: ['Développement', 'Design', 'Marketing', 'Business'][Math.floor(Math.random() * 4)],
                    niveau: ['Débutant', 'Intermédiaire', 'Avancé'][Math.floor(Math.random() * 3)]
                }));
                setCours(coursData);
                setFilteredCours(coursData);
            } catch (error) {
                console.error('Erreur lors du chargement des cours:', error);
                setCours([]);
                setFilteredCours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCours();
    }, []);

    useEffect(() => {
        let filtered = cours;

        // Filtrage par recherche
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.instructeur.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par catégorie
        if (selectedCategory !== 'tous') {
            filtered = filtered.filter(c => c.categorie === selectedCategory);
        }

        // Filtrage par statut
        if (selectedStatus !== 'tous') {
            filtered = filtered.filter(c => c.statut === selectedStatus);
        }

        setFilteredCours(filtered);
    }, [searchTerm, selectedCategory, selectedStatus, cours]);

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

    const categories = ['tous', ...Array.from(new Set(cours.map(c => c.categorie)))];
    const statuts = ['tous', 'actif', 'terminé', 'non_commencé'];

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'actif': return 'text-blue-600 bg-blue-50';
            case 'terminé': return 'text-green-600 bg-green-50';
            case 'non_commencé': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getProgressionColor = (progression: number) => {
        if (progression >= 80) return 'bg-green-500';
        if (progression >= 50) return 'bg-blue-500';
        if (progression >= 30) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getNiveauColor = (niveau: string) => {
        switch (niveau) {
            case 'Débutant': return 'text-green-600 bg-green-50';
            case 'Intermédiaire': return 'text-blue-600 bg-blue-50';
            case 'Avancé': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Mes Cours
                </h1>
                <p className="text-gray-600 mt-2">Explorez et continuez votre apprentissage</p>
            </div>

            {/* Filtres et recherche */}
            <Card className="card-gradient">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Barre de recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un cours, un instructeur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtre par catégorie */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'tous' ? 'Toutes les catégories' : cat}
                                </option>
                            ))}
                        </select>

                        {/* Filtre par statut */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statuts.map(statut => (
                                <option key={statut} value={statut}>
                                    {statut === 'tous' ? 'Tous les statuts' :
                                        statut === 'actif' ? 'En cours' :
                                            statut === 'terminé' ? 'Terminés' : 'Non commencés'}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total cours</p>
                            <p className="text-2xl font-bold text-gray-900">{cours.length}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En cours</p>
                            <p className="text-2xl font-bold text-blue-600">{cours.filter(c => c.statut === 'actif').length}</p>
                        </div>
                        <Play className="w-8 h-8 text-green-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Terminés</p>
                            <p className="text-2xl font-bold text-green-600">{cours.filter(c => c.statut === 'terminé').length}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Progression moyenne</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {Math.round(cours.reduce((acc, c) => acc + c.progression, 0) / cours.length)}%
                            </p>
                        </div>
                        <Star className="w-8 h-8 text-purple-500" />
                    </div>
                </Card>
            </div>

            {/* Liste des cours */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCours.length > 0 ? (
                    filteredCours.map((c) => (
                        <div key={c.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            {/* En-tête du cours */}
                            <div className="h-40 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.statut)}`}>
                                        {c.statut === 'actif' ? 'En cours' :
                                            c.statut === 'terminé' ? 'Terminé' : 'Non commencé'}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white font-bold text-xl mb-1 line-clamp-2">{c.nom}</h3>
                                    <p className="text-white/90 text-sm">Prof. {c.instructeur}</p>
                                </div>
                            </div>

                            {/* Contenu du cours */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getNiveauColor(c.niveau)}`}>
                                        {c.niveau}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {c.categorie}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{c.description}</p>

                                {/* Statistiques */}
                                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                    <div>
                                        <div className="flex items-center justify-center text-gray-500 mb-1">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span className="text-xs">{c.duree}h</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center text-gray-500 mb-1">
                                            <Users className="w-4 h-4 mr-1" />
                                            <span className="text-xs">{c.nombre_etudiants}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center text-gray-500 mb-1">
                                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                            <span className="text-xs">{c.note_moyenne}</span>
                                        </div>
                                    </div>
                                </div>

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
                                        href={`/dashboard/etudiant/cours/${c.id}`}
                                        className="btn-gradient-blue text-sm px-4 py-2 flex-1 mr-2"
                                    >
                                        {c.statut === 'non_commencé' ? 'Commencer' :
                                            c.statut === 'actif' ? 'Continuer' : 'Revoir'}
                                    </Link>
                                    {c.statut === 'terminé' && (
                                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun cours trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos filtres ou termes de recherche</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(CoursPage);
