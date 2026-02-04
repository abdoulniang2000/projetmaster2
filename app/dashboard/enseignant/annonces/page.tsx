'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Bell, Plus, Edit, Trash2, Search, Filter, Send, Calendar, Users, Eye, Megaphone, Clock, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Annonce {
    id: number;
    titre: string;
    contenu: string;
    type: 'general' | 'cours' | 'urgent';
    cours_id?: number;
    cours_nom?: string;
    date_publication: string;
    date_expiration?: string;
    active: boolean;
    destinataires_count?: number;
    lectures_count?: number;
}

interface Cours {
    id: number;
    nom: string;
}

function AnnoncesPage() {
    const [annonces, setAnnonces] = useState<Annonce[]>([]);
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'general' | 'cours' | 'urgent'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
    const [formData, setFormData] = useState({
        titre: '',
        contenu: '',
        type: 'general' as 'general' | 'cours' | 'urgent',
        cours_id: '',
        date_expiration: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [annoncesRes, coursRes] = await Promise.all([
                axios.get('/v1/annonces/enseignant'),
                axios.get('/v1/cours/enseignant')
            ]);
            setAnnonces(annoncesRes.data || []);
            setCours(coursRes.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/v1/annonces', formData);
            setShowCreateModal(false);
            setFormData({
                titre: '',
                contenu: '',
                type: 'general',
                cours_id: '',
                date_expiration: ''
            });
            fetchData();
        } catch (error) {
            console.error('Erreur lors de la création:', error);
        }
    };

    const handlePublish = async (id: number) => {
        try {
            await axios.post(`/v1/annonces/${id}/publish`);
            fetchData();
        } catch (error) {
            console.error('Erreur lors de la publication:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/v1/annonces/${id}`);
            setAnnonces(annonces.filter(a => a.id !== id));
            setShowDeleteModal(false);
            setSelectedAnnonce(null);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'cours': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'urgent': return AlertCircle;
            case 'cours': return BookOpen;
            default: return Bell;
        }
    };

    const filteredAnnonces = annonces.filter(annonce => {
        const matchesSearch = annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            annonce.contenu.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || annonce.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des annonces...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Annonces</h1>
                    <p className="text-gray-600 mt-2">Communiquez avec vos étudiants et publiez des informations importantes</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-gradient-blue flex items-center space-x-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouvelle Annonce</span>
                </button>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher une annonce..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tous les types</option>
                    <option value="general">Général</option>
                    <option value="cours">Par cours</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total annonces</p>
                            <p className="text-2xl font-bold text-gray-900">{annonces.length}</p>
                        </div>
                        <Megaphone className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Actives</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {annonces.filter(a => a.active).length}
                            </p>
                        </div>
                        <Bell className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total lectures</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {annonces.reduce((sum, a) => sum + (a.lectures_count || 0), 0)}
                            </p>
                        </div>
                        <Eye className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Destinataires</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {annonces.reduce((sum, a) => sum + (a.destinataires_count || 0), 0)}
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Liste des annonces */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des annonces</h2>
                </div>

                {filteredAnnonces.length === 0 ? (
                    <div className="p-12 text-center">
                        <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || filterType !== 'all' ? 'Aucune annonce trouvée' : 'Aucune annonce publiée'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filterType !== 'all' ? 'Essayez d\'autres filtres' : 'Commencez par publier votre première annonce'}
                        </p>
                        {!searchTerm && filterType === 'all' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-gradient-blue inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Publier une annonce</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredAnnonces.map((annonce) => {
                            const TypeIcon = getTypeIcon(annonce.type);
                            return (
                                <div key={annonce.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <TypeIcon className="w-5 h-5 text-gray-600" />
                                                <h3 className="text-lg font-semibold text-gray-900">{annonce.titre}</h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(annonce.type)}`}>
                                                    {annonce.type === 'urgent' ? 'Urgent' :
                                                        annonce.type === 'cours' ? 'Cours' : 'Général'}
                                                </span>
                                                {annonce.active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-4 line-clamp-3">{annonce.contenu}</p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Publié le {new Date(annonce.date_publication).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                                {annonce.date_expiration && (
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Expire le {new Date(annonce.date_expiration).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                )}
                                                {annonce.cours_nom && (
                                                    <div className="flex items-center space-x-1">
                                                        <BookOpen className="w-4 h-4" />
                                                        <span>{annonce.cours_nom}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>{annonce.lectures_count || 0} lectures</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{annonce.destinataires_count || 0} destinataires</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button onClick={() => handlePublish(annonce.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Send className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedAnnonce(annonce);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal de création */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Publier une nouvelle annonce
                        </h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={formData.titre}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type d'annonce
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="general">Général</option>
                                    <option value="cours">Spécifique à un cours</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            {formData.type === 'cours' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cours concerné
                                    </label>
                                    <select
                                        value={formData.cours_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, cours_id: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner un cours</option>
                                        {cours.map(c => (
                                            <option key={c.id} value={c.id}>{c.nom}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenu
                                </label>
                                <textarea
                                    rows={6}
                                    value={formData.contenu}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Rédigez votre annonce ici..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date d'expiration (optionnel)
                                </label>
                                <input
                                    type="date"
                                    value={formData.date_expiration}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date_expiration: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Publier</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de suppression */}
            {showDeleteModal && selectedAnnonce && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Supprimer l'annonce
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer l'annonce "{selectedAnnonce.titre}" ?
                            Cette action est irréversible.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedAnnonce(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDelete(selectedAnnonce.id)}
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

export default withAuth(AnnoncesPage);
