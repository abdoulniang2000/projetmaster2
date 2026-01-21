'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Video, Image, Search, Filter, Eye, Calendar, User, FileIcon, FolderOpen, BookOpen } from 'lucide-react';

interface Support {
    id: number;
    titre: string;
    description: string;
    type: 'pdf' | 'ppt' | 'video' | 'image' | 'document';
    taille: string;
    date_ajout: string;
    cours_nom: string;
    instructeur: string;
    nombre_telechargements: number;
    url: string;
    categorie: string;
}

function SupportsPage() {
    const [supports, setSupports] = useState<Support[]>([]);
    const [filteredSupports, setFilteredSupports] = useState<Support[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('tous');
    const [selectedCategory, setSelectedCategory] = useState('tous');

    useEffect(() => {
        const fetchSupports = async () => {
            try {
                const response = await axios.get('/v1/supports');
                const supportsData = response.data.map((s: any, index: number) => {
                    const types: ('pdf' | 'ppt' | 'video' | 'image' | 'document')[] = ['pdf', 'ppt', 'video', 'image', 'document'];
                    const categories = ['Cours', 'Exercices', 'Corrigés', 'Ressources', 'Examens'];

                    return {
                        ...s,
                        type: types[index % types.length],
                        taille: `${Math.floor(Math.random() * 50) + 1} MB`,
                        date_ajout: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                        cours_nom: `Cours ${index + 1}`,
                        instructeur: `Prof. ${['Martin', 'Dubois', 'Bernard', 'Petit', 'Durand'][index % 5]}`,
                        nombre_telechargements: Math.floor(Math.random() * 500) + 10,
                        categorie: categories[index % categories.length],
                        url: `/supports/support_${index + 1}.${types[index % types.length] === 'ppt' ? 'pptx' : types[index % types.length]}`
                    };
                });
                setSupports(supportsData);
                setFilteredSupports(supportsData);
            } catch (error) {
                console.error('Erreur lors du chargement des supports:', error);
                setSupports([]);
                setFilteredSupports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSupports();
    }, []);

    useEffect(() => {
        let filtered = supports;

        // Filtrage par recherche
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.cours_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.instructeur.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par type
        if (selectedType !== 'tous') {
            filtered = filtered.filter(s => s.type === selectedType);
        }

        // Filtrage par catégorie
        if (selectedCategory !== 'tous') {
            filtered = filtered.filter(s => s.categorie === selectedCategory);
        }

        setFilteredSupports(filtered);
    }, [searchTerm, selectedType, selectedCategory, supports]);

    const handleDownload = async (support: Support) => {
        try {
            // Simuler un téléchargement
            console.log(`Téléchargement de ${support.titre}`);
            // En production, utiliser: window.open(support.url, '_blank');

            // Mettre à jour le compteur de téléchargements
            setSupports(prev => prev.map(s =>
                s.id === support.id
                    ? { ...s, nombre_telechargements: s.nombre_telechargements + 1 }
                    : s
            ));
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
        }
    };

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

    const types = ['tous', 'pdf', 'ppt', 'video', 'image', 'document'];
    const categories = ['tous', ...Array.from(new Set(supports.map(s => s.categorie)))];

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
            case 'ppt': return <FileIcon className="w-6 h-6 text-orange-500" />;
            case 'video': return <Video className="w-6 h-6 text-purple-500" />;
            case 'image': return <Image className="w-6 h-6 text-green-500" />;
            default: return <FileIcon className="w-6 h-6 text-blue-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf': return 'bg-red-100 text-red-700';
            case 'ppt': return 'bg-orange-100 text-orange-700';
            case 'video': return 'bg-purple-100 text-purple-700';
            case 'image': return 'bg-green-100 text-green-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Supports de Cours
                </h1>
                <p className="text-gray-600 mt-2">Téléchargez et consultez les ressources pédagogiques</p>
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
                                placeholder="Rechercher un support, un cours..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtre par type */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>
                                    {type === 'tous' ? 'Tous les types' : type.toUpperCase()}
                                </option>
                            ))}
                        </select>

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
                    </div>
                </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total supports</p>
                            <p className="text-2xl font-bold text-gray-900">{supports.length}</p>
                        </div>
                        <FolderOpen className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">PDF</p>
                            <p className="text-2xl font-bold text-red-600">{supports.filter(s => s.type === 'pdf').length}</p>
                        </div>
                        <FileText className="w-8 h-8 text-red-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Vidéos</p>
                            <p className="text-2xl font-bold text-purple-600">{supports.filter(s => s.type === 'video').length}</p>
                        </div>
                        <Video className="w-8 h-8 text-purple-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Téléchargements</p>
                            <p className="text-2xl font-bold text-green-600">
                                {supports.reduce((acc, s) => acc + s.nombre_telechargements, 0)}
                            </p>
                        </div>
                        <Download className="w-8 h-8 text-green-500" />
                    </div>
                </Card>
            </div>

            {/* Liste des supports */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSupports.length > 0 ? (
                    filteredSupports.map((support) => (
                        <div key={support.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            {/* En-tête du support */}
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            {getFileIcon(support.type)}
                                        </div>
                                        <div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(support.type)}`}>
                                                {support.type.toUpperCase()}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{support.taille}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                        {support.categorie}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{support.titre}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{support.description}</p>
                            </div>

                            {/* Informations du support */}
                            <div className="p-6">
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                                        <span className="font-medium">{support.cours_nom}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="w-4 h-4 mr-2 text-green-500" />
                                        <span>{support.instructeur}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                                        <span>{formatDate(support.date_ajout)}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Download className="w-4 h-4 mr-2 text-purple-500" />
                                        <span>{support.nombre_telechargements} téléchargements</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDownload(support)}
                                        className="flex-1 btn-gradient-blue text-sm px-4 py-2 flex items-center justify-center"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Télécharger
                                    </button>
                                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun support trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos filtres ou termes de recherche</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(SupportsPage);
