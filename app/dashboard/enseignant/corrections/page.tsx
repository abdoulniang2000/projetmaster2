'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { CheckCircle, Clock, AlertCircle, Search, Filter, Download, Eye, Star, MessageSquare, Calendar } from 'lucide-react';

interface Soumission {
    id: number;
    etudiant_id: number;
    etudiant_nom: string;
    etudiant_email: string;
    devoir_id: number;
    devoir_titre: string;
    cours_nom: string;
    fichier: string;
    date_soumission: string;
    note?: number;
    commentaire?: string;
    corrige: boolean;
    date_correction?: string;
}

interface CorrectionData {
    note: number;
    commentaire: string;
}

function CorrectionsPage() {
    const [soumissions, setSoumissions] = useState<Soumission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'corrected'>('all');
    const [selectedSoumission, setSelectedSoumission] = useState<Soumission | null>(null);
    const [showCorrectionModal, setShowCorrectionModal] = useState(false);
    const [correctionData, setCorrectionData] = useState<CorrectionData>({
        note: 0,
        commentaire: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSoumissions();
    }, []);

    const fetchSoumissions = async () => {
        try {
            const response = await axios.get('/v1/soumissions/enseignant');
            setSoumissions(response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des soumissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCorrection = async () => {
        if (!selectedSoumission) return;

        setSubmitting(true);
        try {
            await axios.post(`/v1/soumissions/${selectedSoumission.id}/corriger`, correctionData);

            // Update the submission in the list
            setSoumissions(prev => prev.map(s =>
                s.id === selectedSoumission.id
                    ? {
                        ...s,
                        note: correctionData.note,
                        commentaire: correctionData.commentaire,
                        corrige: true,
                        date_correction: new Date().toISOString()
                    }
                    : s
            ));

            setShowCorrectionModal(false);
            setSelectedSoumission(null);
            setCorrectionData({ note: 0, commentaire: '' });
        } catch (error) {
            console.error('Erreur lors de la correction:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const openCorrectionModal = (soumission: Soumission) => {
        setSelectedSoumission(soumission);
        setCorrectionData({
            note: soumission.note || 0,
            commentaire: soumission.commentaire || ''
        });
        setShowCorrectionModal(true);
    };

    const filteredSoumissions = soumissions.filter(soumission => {
        const matchesSearch = soumission.etudiant_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            soumission.devoir_titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            soumission.cours_nom.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'pending' && !soumission.corrige) ||
            (filterStatus === 'corrected' && soumission.corrige);

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: soumissions.length,
        pending: soumissions.filter(s => !s.corrige).length,
        corrected: soumissions.filter(s => s.corrige).length,
        averageGrade: soumissions.filter(s => s.note).reduce((sum, s) => sum + (s.note || 0), 0) / soumissions.filter(s => s.note).length || 0
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des soumissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Corrections des Devoirs</h1>
                    <p className="text-gray-600 mt-2">Examinez et corrigez les soumissions des étudiants</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher une soumission..."
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
                    <option value="all">Toutes les soumissions</option>
                    <option value="pending">En attente de correction</option>
                    <option value="corrected">Corrigées</option>
                </select>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total soumissions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En attente</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Corrigées</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.corrected}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Note moyenne</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageGrade.toFixed(1)}/20</p>
                        </div>
                        <Star className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Liste des soumissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des soumissions</h2>
                </div>

                {filteredSoumissions.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || filterStatus !== 'all' ? 'Aucune soumission trouvée' : 'Aucune soumission reçue'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filterStatus !== 'all' ? 'Essayez d\'autres filtres' : 'Les soumissions des étudiants apparaîtront ici'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredSoumissions.map((soumission) => (
                            <div key={soumission.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{soumission.etudiant_nom}</h3>
                                            <span className="text-sm text-gray-500">{soumission.etudiant_email}</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${soumission.corrige
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {soumission.corrige ? 'Corrigé' : 'En attente'}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                                            <p><strong>Devoir:</strong> {soumission.devoir_titre}</p>
                                            <p><strong>Cours:</strong> {soumission.cours_nom}</p>
                                            <p><strong>Soumis le:</strong> {new Date(soumission.date_soumission).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</p>
                                            {soumission.date_correction && (
                                                <p><strong>Corrigé le:</strong> {new Date(soumission.date_correction).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</p>
                                            )}
                                        </div>
                                        {soumission.note && (
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span className="font-medium text-gray-900">Note: {soumission.note}/20</span>
                                            </div>
                                        )}
                                        {soumission.commentaire && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-700">{soumission.commentaire}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {!soumission.corrige && (
                                            <button
                                                onClick={() => openCorrectionModal(soumission)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Corriger</span>
                                            </button>
                                        )}
                                        {soumission.corrige && (
                                            <button
                                                onClick={() => openCorrectionModal(soumission)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Modifier</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de correction */}
            {showCorrectionModal && selectedSoumission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Corriger la soumission
                        </h3>
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p><strong>Étudiant:</strong> {selectedSoumission.etudiant_nom}</p>
                            <p><strong>Devoir:</strong> {selectedSoumission.devoir_titre}</p>
                            <p><strong>Cours:</strong> {selectedSoumission.cours_nom}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note sur 20
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    value={correctionData.note}
                                    onChange={(e) => setCorrectionData(prev => ({ ...prev, note: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Commentaire
                                </label>
                                <textarea
                                    rows={6}
                                    value={correctionData.commentaire}
                                    onChange={(e) => setCorrectionData(prev => ({ ...prev, commentaire: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Donnez votre feedback détaillé à l'étudiant..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCorrectionModal(false);
                                    setSelectedSoumission(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCorrection}
                                disabled={submitting}
                                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Enregistrement...' : 'Enregistrer la correction'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(CorrectionsPage);
