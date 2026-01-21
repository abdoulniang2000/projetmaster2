'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Users, Search, Filter, CheckCircle, XCircle, Clock, Mail, Phone, Calendar, BookOpen, Award, TrendingUp, Eye, MessageSquare } from 'lucide-react';

interface Etudiant {
    id: number;
    nom: string;
    email: string;
    telephone?: string;
    date_inscription: string;
    valide: boolean;
    cours_inscrits: number;
    devoirs_soumis: number;
    moyenne_generale?: number;
    derniere_activite?: string;
    photo?: string;
}

interface Cours {
    id: number;
    nom: string;
}

function EtudiantsPage() {
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'pending'>('all');
    const [selectedCours, setSelectedCours] = useState<number | null>(null);
    const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [etudiantsRes, coursRes] = await Promise.all([
                axios.get('/v1/users/etudiants'),
                axios.get('/v1/cours/enseignant')
            ]);
            setEtudiants(etudiantsRes.data || []);
            setCours(coursRes.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleValidation = async (etudiantId: number, valide: boolean) => {
        try {
            await axios.put(`/v1/users/${etudiantId}/valider`, { valide });
            setEtudiants(prev => prev.map(e =>
                e.id === etudiantId ? { ...e, valide } : e
            ));
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
        }
    };

    const filteredEtudiants = etudiants.filter(etudiant => {
        const matchesSearch = etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            etudiant.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'valid' && etudiant.valide) ||
            (filterStatus === 'pending' && !etudiant.valide);
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: etudiants.length,
        valides: etudiants.filter(e => e.valide).length,
        en_attente: etudiants.filter(e => !e.valide).length,
        moyenne: etudiants.filter(e => e.moyenne_generale).reduce((sum, e) => sum + (e.moyenne_generale || 0), 0) / etudiants.filter(e => e.moyenne_generale).length || 0
    };

    const getActiviteColor = (derniereActivite?: string) => {
        if (!derniereActivite) return 'text-gray-500';
        const now = new Date();
        const lastActivity = new Date(derniereActivite);
        const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'text-green-600';
        if (diffDays <= 7) return 'text-orange-600';
        return 'text-red-600';
    };

    const getActiviteText = (derniereActivite?: string) => {
        if (!derniereActivite) return 'Jamais';
        const now = new Date();
        const lastActivity = new Date(derniereActivite);
        const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Aujourd\'hui';
        if (diffDays === 1) return 'Hier';
        if (diffDays <= 7) return `Il y a ${diffDays} jours`;
        if (diffDays <= 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
        return `Il y a ${Math.floor(diffDays / 30)} mois`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des étudiants...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Étudiants</h1>
                    <p className="text-gray-600 mt-2">Suivez et gérez les étudiants inscrits à vos cours</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-blue-500" />
                </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un étudiant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tous les étudiants</option>
                    <option value="valid">Validés</option>
                    <option value="pending">En attente</option>
                </select>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total étudiants</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Validés</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.valides}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En attente</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.en_attente}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Moyenne générale</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.moyenne.toFixed(1)}/20</p>
                        </div>
                        <Award className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Liste des étudiants */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des étudiants</h2>
                </div>

                {filteredEtudiants.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || filterStatus !== 'all' ? 'Aucun étudiant trouvé' : 'Aucun étudiant inscrit'}
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm || filterStatus !== 'all' ? 'Essayez d\'autres filtres' : 'Les étudiants inscrits apparaîtront ici'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredEtudiants.map((etudiant) => (
                            <div key={etudiant.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            {etudiant.photo ? (
                                                <img src={etudiant.photo} alt={etudiant.nom} className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <Users className="w-6 h-6 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{etudiant.nom}</h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${etudiant.valide
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {etudiant.valide ? 'Validé' : 'En attente'}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActiviteColor(etudiant.derniere_activite)}`}>
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {getActiviteText(etudiant.derniere_activite)}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{etudiant.email}</span>
                                                </div>
                                                {etudiant.telephone && (
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{etudiant.telephone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Inscrit le {new Date(etudiant.date_inscription).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{etudiant.cours_inscrits} cours</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{etudiant.devoirs_soumis} devoirs</span>
                                                </div>
                                                {etudiant.moyenne_generale && (
                                                    <div className="flex items-center space-x-1">
                                                        <Award className="w-4 h-4" />
                                                        <span>Moyenne: {etudiant.moyenne_generale.toFixed(1)}/20</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => {
                                                setSelectedEtudiant(etudiant);
                                                setShowDetailsModal(true);
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        {!etudiant.valide && (
                                            <button
                                                onClick={() => handleValidation(etudiant.id, true)}
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Valider</span>
                                            </button>
                                        )}
                                        {etudiant.valide && (
                                            <button
                                                onClick={() => handleValidation(etudiant.id, false)}
                                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>Invalider</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            {showDetailsModal && selectedEtudiant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Détails de l'étudiant
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    {selectedEtudiant.photo ? (
                                        <img src={selectedEtudiant.photo} alt={selectedEtudiant.nom} className="w-16 h-16 rounded-full object-cover" />
                                    ) : (
                                        <Users className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{selectedEtudiant.nom}</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedEtudiant.valide
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {selectedEtudiant.valide ? 'Validé' : 'En attente de validation'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedEtudiant.email}</p>
                                </div>
                                {selectedEtudiant.telephone && (
                                    <div>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                        <p className="font-medium">{selectedEtudiant.telephone}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">Date d'inscription</p>
                                    <p className="font-medium">{new Date(selectedEtudiant.date_inscription).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dernière activité</p>
                                    <p className="font-medium">{getActiviteText(selectedEtudiant.derniere_activite)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{selectedEtudiant.cours_inscrits}</p>
                                    <p className="text-sm text-gray-600">Cours inscrits</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{selectedEtudiant.devoirs_soumis}</p>
                                    <p className="text-sm text-gray-600">Devoirs soumis</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                        {selectedEtudiant.moyenne_generale?.toFixed(1) || 'N/A'}/20
                                    </p>
                                    <p className="text-sm text-gray-600">Moyenne générale</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedEtudiant(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Fermer
                            </button>
                            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>Contacter</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(EtudiantsPage);
