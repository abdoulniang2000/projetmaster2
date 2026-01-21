'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Calendar, Clock, CheckCircle, AlertCircle, Search, Filter, Eye, Download, History, Plus, BookOpen, User, Award } from 'lucide-react';

interface Devoir {
    id: number;
    titre: string;
    description: string;
    cours_nom: string;
    instructeur: string;
    date_limite: string;
    date_publication: string;
    type: 'devoir' | 'projet' | 'examen';
    statut: 'a_faire' | 'soumis' | 'en_retard' | 'corrige';
    note?: number;
    feedback?: string;
    nombre_soumissions: number;
}

interface Soumission {
    id: number;
    devoir_id: number;
    fichier_nom: string;
    fichier_taille: string;
    date_soumission: string;
    version: number;
    commentaire: string;
    statut: 'en_attente' | 'corrige' | 'rejete';
    note?: number;
    feedback?: string;
}

function DevoirsPage() {
    const [devoirs, setDevoirs] = useState<Devoir[]>([]);
    const [soumissions, setSoumissions] = useState<Soumission[]>([]);
    const [filteredDevoirs, setFilteredDevoirs] = useState<Devoir[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('tous');
    const [selectedType, setSelectedType] = useState('tous');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedDevoir, setSelectedDevoir] = useState<Devoir | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadComment, setUploadComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [devoirsRes, soumissionsRes] = await Promise.all([
                    axios.get('/v1/devoirs'),
                    axios.get('/v1/soumissions')
                ]);

                const devoirsData = devoirsRes.data.map((d: any, index: number) => {
                    const types: ('devoir' | 'projet' | 'examen')[] = ['devoir', 'projet', 'examen'];
                    const statuts: ('a_faire' | 'soumis' | 'en_retard' | 'corrige')[] = ['a_faire', 'soumis', 'en_retard', 'corrige'];
                    const now = new Date();
                    const deadline = new Date(now.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000);

                    return {
                        ...d,
                        type: types[index % types.length],
                        statut: statuts[index % statuts.length],
                        date_limite: deadline.toISOString(),
                        date_publication: new Date(now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
                        cours_nom: `Cours ${index + 1}`,
                        instructeur: `Prof. ${['Martin', 'Dubois', 'Bernard', 'Petit', 'Durand'][index % 5]}`,
                        nombre_soumissions: Math.floor(Math.random() * 30) + 5,
                        note: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 15 : undefined,
                        feedback: Math.random() > 0.5 ? 'Bon travail, quelques améliorations possibles.' : undefined
                    };
                });

                const soumissionsData = soumissionsRes.data.map((s: any, index: number) => ({
                    ...s,
                    devoir_id: (index % 10) + 1,
                    fichier_nom: `devoir_${index + 1}_v${Math.floor(Math.random() * 3) + 1}.pdf`,
                    fichier_taille: `${Math.floor(Math.random() * 10) + 1} MB`,
                    date_soumission: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                    version: Math.floor(Math.random() * 3) + 1,
                    commentaire: 'Voici ma soumission pour ce devoir.',
                    statut: ['en_attente', 'corrige', 'rejete'][Math.floor(Math.random() * 3)],
                    note: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 15 : undefined,
                    feedback: Math.random() > 0.4 ? 'Excellent travail!' : undefined
                }));

                setDevoirs(devoirsData);
                setSoumissions(soumissionsData);
                setFilteredDevoirs(devoirsData);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setDevoirs([]);
                setSoumissions([]);
                setFilteredDevoirs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = devoirs;

        // Filtrage par recherche
        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.cours_nom.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par statut
        if (selectedStatus !== 'tous') {
            filtered = filtered.filter(d => d.statut === selectedStatus);
        }

        // Filtrage par type
        if (selectedType !== 'tous') {
            filtered = filtered.filter(d => d.type === selectedType);
        }

        setFilteredDevoirs(filtered);
    }, [searchTerm, selectedStatus, selectedType, devoirs]);

    const handleUpload = async () => {
        if (!selectedDevoir || !uploadFile) return;

        try {
            const formData = new FormData();
            formData.append('fichier', uploadFile);
            formData.append('devoir_id', selectedDevoir.id.toString());
            formData.append('commentaire', uploadComment);
            formData.append('version', (Math.max(...soumissions.filter(s => s.devoir_id === selectedDevoir.id).map(s => s.version), 0) + 1).toString());

            // Simuler l'upload
            console.log('Upload du fichier:', uploadFile.name);

            // Mettre à jour l'état
            const newSoumission: Soumission = {
                id: soumissions.length + 1,
                devoir_id: selectedDevoir.id,
                fichier_nom: uploadFile.name,
                fichier_taille: `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
                date_soumission: new Date().toISOString(),
                version: Math.max(...soumissions.filter(s => s.devoir_id === selectedDevoir.id).map(s => s.version), 0) + 1,
                commentaire: uploadComment,
                statut: 'en_attente'
            };

            setSoumissions(prev => [...prev, newSoumission]);
            setDevoirs(prev => prev.map(d =>
                d.id === selectedDevoir.id
                    ? { ...d, statut: 'soumis', nombre_soumissions: d.nombre_soumissions + 1 }
                    : d
            ));

            // Réinitialiser le formulaire
            setShowUploadModal(false);
            setSelectedDevoir(null);
            setUploadFile(null);
            setUploadComment('');
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
        }
    };

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

    const statuts = ['tous', 'a_faire', 'soumis', 'en_retard', 'corrige'];
    const types = ['tous', 'devoir', 'projet', 'examen'];

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'a_faire': return 'text-blue-600 bg-blue-50';
            case 'soumis': return 'text-yellow-600 bg-yellow-50';
            case 'en_retard': return 'text-red-600 bg-red-50';
            case 'corrige': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'devoir': return 'text-blue-600 bg-blue-50';
            case 'projet': return 'text-purple-600 bg-purple-50';
            case 'examen': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysUntilDeadline = (deadline: string) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: `En retard de ${Math.abs(diffDays)} jours`, color: 'text-red-600' };
        if (diffDays === 0) return { text: 'Aujourd\'hui', color: 'text-orange-600' };
        if (diffDays === 1) return { text: 'Demain', color: 'text-yellow-600' };
        return { text: `Dans ${diffDays} jours`, color: 'text-green-600' };
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Dépôt de Devoirs
                </h1>
                <p className="text-gray-600 mt-2">Soumettez vos travaux et suivez leur évaluation</p>
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
                                placeholder="Rechercher un devoir..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtre par statut */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statuts.map(statut => (
                                <option key={statut} value={statut}>
                                    {statut === 'tous' ? 'Tous les statuts' :
                                        statut === 'a_faire' ? 'À faire' :
                                            statut === 'soumis' ? 'Soumis' :
                                                statut === 'en_retard' ? 'En retard' : 'Corrigés'}
                                </option>
                            ))}
                        </select>

                        {/* Filtre par type */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>
                                    {type === 'tous' ? 'Tous les types' :
                                        type === 'devoir' ? 'Devoirs' :
                                            type === 'projet' ? 'Projets' : 'Examens'}
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
                            <p className="text-sm text-gray-600">Total devoirs</p>
                            <p className="text-2xl font-bold text-gray-900">{devoirs.length}</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">À faire</p>
                            <p className="text-2xl font-bold text-blue-600">{devoirs.filter(d => d.statut === 'a_faire').length}</p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Soumis</p>
                            <p className="text-2xl font-bold text-yellow-600">{devoirs.filter(d => d.statut === 'soumis').length}</p>
                        </div>
                        <Upload className="w-8 h-8 text-yellow-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Corrigés</p>
                            <p className="text-2xl font-bold text-green-600">{devoirs.filter(d => d.statut === 'corrige').length}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </Card>
            </div>

            {/* Liste des devoirs */}
            <div className="space-y-6">
                {filteredDevoirs.length > 0 ? (
                    filteredDevoirs.map((devoir) => {
                        const deadlineInfo = getDaysUntilDeadline(devoir.date_limite);
                        const devoirSoumissions = soumissions.filter(s => s.devoir_id === devoir.id);

                        return (
                            <Card key={devoir.id} className="card-gradient">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{devoir.titre}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(devoir.type)}`}>
                                                    {devoir.type === 'devoir' ? 'Devoir' :
                                                        devoir.type === 'projet' ? 'Projet' : 'Examen'}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(devoir.statut)}`}>
                                                    {devoir.statut === 'a_faire' ? 'À faire' :
                                                        devoir.statut === 'soumis' ? 'Soumis' :
                                                            devoir.statut === 'en_retard' ? 'En retard' : 'Corrigé'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-3">{devoir.description}</p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                                                    <span>{devoir.cours_nom}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 mr-1 text-green-500" />
                                                    <span>{devoir.instructeur}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                                                    <span>Publié le {formatDate(devoir.date_publication)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deadline et note */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex items-center ${deadlineInfo.color}`}>
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                <span className="text-sm font-medium">
                                                    {deadlineInfo.text} ({formatDate(devoir.date_limite)})
                                                </span>
                                            </div>
                                            {devoir.note && (
                                                <div className="flex items-center text-green-600">
                                                    <Award className="w-4 h-4 mr-1" />
                                                    <span className="text-sm font-medium">Note: {devoir.note}/20</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Soumissions précédentes */}
                                    {devoirSoumissions.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <History className="w-4 h-4 mr-1" />
                                                Historique des soumissions ({devoirSoumissions.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {devoirSoumissions.slice(-3).map((soumission) => (
                                                    <div key={soumission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <FileText className="w-4 h-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{soumission.fichier_nom}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    Version {soumission.version} • {soumission.fichier_taille} • {formatDate(soumission.date_soumission)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${soumission.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-700' :
                                                                soumission.statut === 'corrige' ? 'bg-green-100 text-green-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                {soumission.statut === 'en_attente' ? 'En attente' :
                                                                    soumission.statut === 'corrige' ? 'Corrigé' : 'Rejeté'}
                                                            </span>
                                                            {soumission.note && (
                                                                <span className="text-sm font-medium text-green-600">{soumission.note}/20</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center space-x-3">
                                        {devoir.statut !== 'corrige' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedDevoir(devoir);
                                                    setShowUploadModal(true);
                                                }}
                                                className="btn-gradient-blue text-sm px-4 py-2 flex items-center"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                {devoirSoumissions.length > 0 ? 'Nouvelle version' : 'Soumettre'}
                                            </button>
                                        )}
                                        {devoirSoumissions.length > 0 && (
                                            <button className="btn-gray text-sm px-4 py-2 flex items-center">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Voir les soumissions
                                            </button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun devoir trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos filtres ou termes de recherche</p>
                    </div>
                )}
            </div>

            {/* Modal d'upload */}
            {showUploadModal && selectedDevoir && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Soumettre: {selectedDevoir.titre}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fichier
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Commentaire (optionnel)
                                </label>
                                <textarea
                                    value={uploadComment}
                                    onChange={(e) => setUploadComment(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Ajoutez un commentaire pour votre soumission..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedDevoir(null);
                                    setUploadFile(null);
                                    setUploadComment('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!uploadFile}
                                className="btn-gradient-blue px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Soumettre
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(DevoirsPage);
