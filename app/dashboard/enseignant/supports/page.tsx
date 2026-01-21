'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Upload, FileText, Download, Trash2, Search, Filter, Plus, Eye, File, Image, Video, FileArchive } from 'lucide-react';
import Link from 'next/link';

interface Support {
    id: number;
    titre: string;
    type: 'document' | 'image' | 'video' | 'archive';
    fichier: string;
    taille: number;
    cours_id: number;
    cours_nom: string;
    created_at: string;
}

interface Cours {
    id: number;
    nom: string;
}

function SupportsPage() {
    const [supports, setSupports] = useState<Support[]>([]);
    const [cours, setCours] = useState<Cours[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCours, setSelectedCours] = useState<number | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({
        titre: '',
        cours_id: '',
        fichier: null as File | null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [supportsRes, coursRes] = await Promise.all([
                axios.get('/v1/supports/enseignant'),
                axios.get('/v1/cours/enseignant')
            ]);
            setSupports(supportsRes.data || []);
            setCours(coursRes.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadData.fichier) return;

        const formData = new FormData();
        formData.append('titre', uploadData.titre);
        formData.append('cours_id', uploadData.cours_id);
        formData.append('fichier', uploadData.fichier);

        try {
            await axios.post('/v1/supports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowUploadModal(false);
            setUploadData({ titre: '', cours_id: '', fichier: null });
            fetchData();
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce support ?')) {
            try {
                await axios.delete(`/v1/supports/${id}`);
                setSupports(supports.filter(s => s.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image': return Image;
            case 'video': return Video;
            case 'archive': return FileArchive;
            default: return FileText;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredSupports = supports.filter(support => {
        const matchesSearch = support.titre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCours = !selectedCours || support.cours_id === selectedCours;
        return matchesSearch && matchesCours;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des supports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supports Pédagogiques</h1>
                    <p className="text-gray-600 mt-2">Gérez vos documents et ressources pédagogiques</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-gradient-blue flex items-center space-x-2 px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un support</span>
                </button>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un support..."
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
                            <p className="text-sm text-gray-600">Total supports</p>
                            <p className="text-2xl font-bold text-gray-900">{supports.length}</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Documents</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {supports.filter(s => s.type === 'document').length}
                            </p>
                        </div>
                        <FileText className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Images</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {supports.filter(s => s.type === 'image').length}
                            </p>
                        </div>
                        <Image className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
                <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Vidéos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {supports.filter(s => s.type === 'video').length}
                            </p>
                        </div>
                        <Video className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Liste des supports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Liste des supports</h2>
                </div>

                {filteredSupports.length === 0 ? (
                    <div className="p-12 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || selectedCours ? 'Aucun support trouvé' : 'Aucun support ajouté'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || selectedCours ? 'Essayez d\'autres filtres' : 'Commencez par ajouter votre premier support pédagogique'}
                        </p>
                        {!searchTerm && !selectedCours && (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="btn-gradient-blue inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Ajouter un support</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredSupports.map((support) => {
                            const Icon = getFileIcon(support.type);
                            return (
                                <div key={support.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{support.titre}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                    <span>{support.cours_nom}</span>
                                                    <span>•</span>
                                                    <span>{formatFileSize(support.taille)}</span>
                                                    <span>•</span>
                                                    <span>{new Date(support.created_at).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(support.id)}
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

            {/* Modal d'upload */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Ajouter un support pédagogique
                        </h3>
                        <form onSubmit={handleFileUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={uploadData.titre}
                                    onChange={(e) => setUploadData(prev => ({ ...prev, titre: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cours
                                </label>
                                <select
                                    value={uploadData.cours_id}
                                    onChange={(e) => setUploadData(prev => ({ ...prev, cours_id: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Sélectionner un cours</option>
                                    {cours.map(c => (
                                        <option key={c.id} value={c.id}>{c.nom}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fichier
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setUploadData(prev => ({ ...prev, fichier: e.target.files?.[0] || null }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(SupportsPage);
