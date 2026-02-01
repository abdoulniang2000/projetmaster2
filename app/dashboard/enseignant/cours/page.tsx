'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { BookOpen, Plus, Edit, Trash2, Users, Calendar, Search, Filter, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface Cours {
    id: number;
    nom: string;
    description: string;
    created_at: string;
    updated_at: string;
    etudiants_count?: number;
    devoirs_count?: number;
}

function CoursPage() {
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCours, setSelectedCours] = useState<Cours | null>(null);

    useEffect(() => {
        fetchCours();
    }, []);

    const fetchCours = async () => {
        try {
            const response = await axios.get('/v1/cours'); // Changé de /v1/cours/enseignant à /v1/cours
            setCours(response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/v1/cours/${id}`);
            setCours(cours.filter(c => c.id !== id));
            setShowDeleteModal(false);
            setSelectedCours(null);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const filteredCours = cours.filter(c =>
        c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
                    <p className="text-gray-600 mt-2">Gérez vos cours et leurs contenus</p>
                </div>
                <Link
                    href="/dashboard/enseignant/cours/create"
                    className="btn-gradient-blue flex items-center space-x-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouveau Cours</span>
                </Link>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un cours..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5" />
                    <span>Filtrer</span>
                </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total des cours</p>
                            <p className="text-2xl font-bold text-gray-900">{cours.length}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total étudiants</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {cours.reduce((sum, c) => sum + (c.etudiants_count || 0), 0)}
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total devoirs</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {cours.reduce((sum, c) => sum + (c.devoirs_count || 0), 0)}
                            </p>
                        </div>
                        <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Liste des cours */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des cours</h2>
                </div>

                {filteredCours.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'Aucun cours trouvé' : 'Aucun cours créé'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm ? 'Essayez une autre recherche' : 'Commencez par créer votre premier cours'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/dashboard/enseignant/cours/create"
                                className="btn-gradient-blue inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Créer un cours</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredCours.map((course) => (
                            <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{course.nom}</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Actif
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{course.etudiants_count || 0} étudiants</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{course.devoirs_count || 0} devoirs</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <Link
                                            href={`/dashboard/enseignant/cours/${course.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setSelectedCours(course);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de suppression */}
            {showDeleteModal && selectedCours && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Supprimer le cours
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer le cours "{selectedCours.nom}" ?
                            Cette action est irréversible.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedCours(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDelete(selectedCours.id)}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(CoursPage);
