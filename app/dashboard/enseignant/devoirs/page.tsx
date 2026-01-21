'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { FileText, Plus, Edit, Trash2, Calendar, Clock, Users, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Devoir {
    id: number;
    titre: string;
    description: string;
    date_limite: string;
    cours_id: number;
    cours_nom: string;
    created_at: string;
    soumissions_count?: number;
    corrige_count?: number;
    fichier_joint?: string;
}

interface Cours {
    id: number;
    nom: string;
}

function DevoirsPage() {
    const [devoirs, setDevoirs] = useState<Devoir[]>([]);
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCours, setSelectedCours] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDevoir, setSelectedDevoir] = useState<Devoir | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [devoirsRes, coursRes] = await Promise.all([
                axios.get('/v1/devoirs/enseignant'),
                axios.get('/v1/cours/enseignant')
            ]);
            setDevoirs(devoirsRes.data || []);
            setCours(coursRes.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/v1/devoirs/${id}`);
            setDevoirs(devoirs.filter(d => d.id !== id));
            setShowDeleteModal(false);
            setSelectedDevoir(null);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const getStatusColor = (dateLimite: string) => {
        const now = new Date();
        const deadline = new Date(dateLimite);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'text-red-600 bg-red-50';
        if (diffDays <= 3) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
    };

    const getStatusText = (dateLimite: string) => {
        const now = new Date();
        const deadline = new Date(dateLimite);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Expiré';
        if (diffDays === 0) return 'Expire aujourd\'hui';
        if (diffDays === 1) return 'Expire demain';
        if (diffDays <= 3) return `Expire dans ${diffDays} jours`;
        return `${diffDays} jours restants`;
    };

    const filteredDevoirs = devoirs.filter(devoir => {
        const matchesSearch = devoir.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            devoir.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCours = !selectedCours || devoir.cours_id === selectedCours;
        return matchesSearch && matchesCours;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des devoirs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Devoirs</h1>
                    <p className="text-gray-600 mt-2">Créez et gérez les devoirs pour vos cours</p>
                </div>
                <Link
                    href="/dashboard/enseignant/devoirs/create"
                    className="btn-gradient-blue flex items-center space-x-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouveau Devoir</span>
                </Link>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un devoir..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={selectedCours || ''}
                    onChange={(e) => setSelectedCours(e.target.value ? parseInt(e.target.value) : null)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tous les cours</option>
                    {cours.map(c => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                </select>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total devoirs</p>
                            <p className="text-2xl font-bold text-gray-900">{devoirs.length}</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En cours</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {devoirs.filter(d => new Date(d.date_limite) > new Date()).length}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total soumissions</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {devoirs.reduce((sum, d) => sum + (d.soumissions_count || 0), 0)}
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Corrections</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {devoirs.reduce((sum, d) => sum + (d.corrige_count || 0), 0)}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Liste des devoirs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des devoirs</h2>
                </div>

                {filteredDevoirs.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || selectedCours ? 'Aucun devoir trouvé' : 'Aucun devoir créé'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || selectedCours ? 'Essayez d\'autres filtres' : 'Commencez par créer votre premier devoir'}
                        </p>
                        {!searchTerm && !selectedCours && (
                            <Link
                                href="/dashboard/enseignant/devoirs/create"
                                className="btn-gradient-blue inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Créer un devoir</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredDevoirs.map((devoir) => (
                            <div key={devoir.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{devoir.titre}</h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(devoir.date_limite)}`}>
                                                {getStatusText(devoir.date_limite)}
                                            </span>
                                            {devoir.fichier_joint && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    Fichier joint
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{devoir.description}</p>
                                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{devoir.cours_nom}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Limité le {new Date(devoir.date_limite).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{devoir.soumissions_count || 0} soumissions</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>{devoir.corrige_count || 0} corrigées</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <Link
                                            href={`/dashboard/enseignant/devoirs/${devoir.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/dashboard/enseignant/devoirs/${devoir.id}/corrections`}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setSelectedDevoir(devoir);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de suppression */}
            {showDeleteModal && selectedDevoir && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Supprimer le devoir
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer le devoir "{selectedDevoir.titre}" ?
                            Cette action est irréversible et supprimera également toutes les soumissions associées.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedDevoir(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDelete(selectedDevoir.id)}
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

export default withAuth(DevoirsPage);
