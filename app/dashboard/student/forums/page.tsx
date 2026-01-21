'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Clock, Search, Plus, Eye, Pin, Lock } from 'lucide-react';

interface Forum {
    id: number;
    titre: string;
    description: string;
    cours?: {
        id: number;
        nom: string;
    };
    createur: {
        first_name: string;
        last_name: string;
    };
    discussions: Discussion[];
    is_active: boolean;
    created_at: string;
}

interface Discussion {
    id: number;
    titre: string;
    contenu: string;
    user: {
        first_name: string;
        last_name: string;
    };
    is_pinned: boolean;
    is_locked: boolean;
    reponses: Reponse[];
    created_at: string;
}

interface Reponse {
    id: number;
    contenu: string;
    user: {
        first_name: string;
        last_name: string;
    };
    is_best_answer: boolean;
    created_at: string;
}

function ForumsPage() {
    const [forums, setForums] = useState<Forum[]>([]);
    const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchForums();
    }, []);

    const fetchForums = async () => {
        try {
            const response = await axios.get('/v1/forums');
            setForums(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des forums:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredForums = forums.filter(forum =>
        forum.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.cours?.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des forums...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Forums de Discussion
                    </h1>
                    <p className="text-gray-600 mt-2">Participez aux discussions avec vos camarades et enseignants</p>
                </div>
                <Button className="btn-gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Discussion
                </Button>
            </div>

            {/* Barre de recherche */}
            <Card className="card-gradient">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher un forum, une discussion..."
                            className="input-gradient w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Liste des forums */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Forums disponibles</h2>
                    {filteredForums.map((forum) => (
                        <Card
                            key={forum.id}
                            className={`card-gradient hover:shadow-lg transition-all cursor-pointer ${selectedForum?.id === forum.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                            onClick={() => setSelectedForum(forum)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{forum.titre}</h3>
                                            {forum.cours && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {forum.cours.nom}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{forum.description}</p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span className="flex items-center space-x-1">
                                                <Users className="w-3 h-3" />
                                                {forum.discussions.length} discussions
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <MessageSquare className="w-3 h-3" />
                                                {forum.discussions.reduce((acc, d) => acc + d.reponses.length, 0)} réponses
                                            </span>
                                            <span>Par {forum.createur.first_name} {forum.createur.last_name}</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Discussions du forum sélectionné */}
                {selectedForum && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Discussions - {selectedForum.titre}
                            </h2>
                            <Button
                                size="sm"
                                className="btn-gradient-secondary"
                                onClick={() => {/* Ouvrir modal nouvelle discussion */ }}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Nouveau
                            </Button>
                        </div>

                        {selectedForum.discussions.length === 0 ? (
                            <Card className="card-gradient">
                                <CardContent className="p-8 text-center">
                                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Aucune discussion pour le moment</p>
                                    <p className="text-sm text-gray-500 mt-2">Soyez le premier à lancer une discussion !</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {selectedForum.discussions.map((discussion) => (
                                    <Card key={discussion.id} className="card-gradient hover:shadow-md transition-all cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        {discussion.is_pinned && (
                                                            <Pin className="w-4 h-4 text-orange-500" />
                                                        )}
                                                        {discussion.is_locked && (
                                                            <Lock className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <h4 className="font-medium text-gray-900">{discussion.titre}</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{discussion.contenu}</p>
                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                        <span>Par {discussion.user.first_name} {discussion.user.last_name}</span>
                                                        <span className="flex items-center space-x-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(discussion.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <MessageSquare className="w-3 h-3" />
                                                            {discussion.reponses.length} réponses
                                                        </span>
                                                        {discussion.reponses.some(r => r.is_best_answer) && (
                                                            <span className="text-green-600 font-medium">✓ Résolue</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(ForumsPage);
