'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Search, Filter, Plus, Reply, ThumbsUp, Eye, Calendar, User, BookOpen, Pin, Lock, Clock, TrendingUp, Users } from 'lucide-react';

interface Forum {
    id: number;
    titre: string;
    description: string;
    cours_nom: string;
    instructeur: string;
    categorie: string;
    statut: 'ouvert' | 'ferme' | 'epingle';
    nombre_messages: number;
    nombre_participants: number;
    dernier_message: {
        auteur: string;
        date: string;
        contenu: string;
    };
    date_creation: string;
    tags: string[];
}

interface Message {
    id: number;
    forum_id: number;
    auteur: string;
    avatar?: string;
    contenu: string;
    date: string;
    nombre_likes: number;
    reponses: Message[];
    est_auteur: boolean;
}

function ForumsPage() {
    const [forums, setForums] = useState<Forum[]>([]);
    const [filteredForums, setFilteredForums] = useState<Forum[]>([]);
    const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('tous');
    const [selectedStatus, setSelectedStatus] = useState('tous');
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);
    const [newTopic, setNewTopic] = useState({ titre: '', description: '', categorie: '', contenu: '' });
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    useEffect(() => {
        const fetchForums = async () => {
            try {
                const response = await axios.get('/v1/forums');
                const forumsData = response.data.map((f: any, index: number) => {
                    const categories = ['Général', 'Questions techniques', 'Projets', 'Examens', 'Ressources'];
                    const statuts: ('ouvert' | 'ferme' | 'epingle')[] = ['ouvert', 'ferme', 'epingle'];
                    const tags = [['urgent', 'important'], ['débutant', 'aide'], ['projet', 'collaboration'], ['examen', 'révision'], ['ressource', 'partage']];

                    return {
                        ...f,
                        categorie: categories[index % categories.length],
                        statut: statuts[Math.floor(Math.random() * statuts.length)],
                        nombre_messages: Math.floor(Math.random() * 50) + 5,
                        nombre_participants: Math.floor(Math.random() * 20) + 3,
                        cours_nom: `Cours ${index + 1}`,
                        instructeur: `Prof. ${['Martin', 'Dubois', 'Bernard', 'Petit', 'Durand'][index % 5]}`,
                        date_creation: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                        dernier_message: {
                            auteur: `Étudiant ${Math.floor(Math.random() * 100) + 1}`,
                            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                            contenu: 'Merci pour cette information, c\'est très utile!'
                        },
                        tags: tags[index % tags.length]
                    };
                });
                setForums(forumsData);
                setFilteredForums(forumsData);
            } catch (error) {
                console.error('Erreur lors du chargement des forums:', error);
                setForums([]);
                setFilteredForums([]);
            } finally {
                setLoading(false);
            }
        };

        fetchForums();
    }, []);

    useEffect(() => {
        let filtered = forums;

        // Filtrage par recherche
        if (searchTerm) {
            filtered = filtered.filter(f =>
                f.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.cours_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filtrage par catégorie
        if (selectedCategory !== 'tous') {
            filtered = filtered.filter(f => f.categorie === selectedCategory);
        }

        // Filtrage par statut
        if (selectedStatus !== 'tous') {
            filtered = filtered.filter(f => f.statut === selectedStatus);
        }

        setFilteredForums(filtered);
    }, [searchTerm, selectedCategory, selectedStatus, forums]);

    const fetchMessages = async (forumId: number) => {
        try {
            const response = await axios.get(`/v1/forums/${forumId}/messages`);
            const messagesData = response.data.map((m: any, index: number) => ({
                ...m,
                auteur: index % 3 === 0 ? 'Moi' : `Étudiant ${Math.floor(Math.random() * 100) + 1}`,
                avatar: index % 3 === 0 ? '/avatar.jpg' : undefined,
                contenu: [
                    'Bonjour, j\'ai une question concernant le dernier exercice.',
                    'Quelqu\'un pourrait m\'expliquer ce concept en détail?',
                    'Voici ma solution pour le problème posé.',
                    'Merci pour votre aide, c\'est beaucoup plus clair maintenant.',
                    'Je pense qu\'il y a une autre approche possible pour résoudre ce problème.'
                ][index % 5],
                date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                nombre_likes: Math.floor(Math.random() * 20),
                est_auteur: index % 3 === 0,
                reponses: index % 4 === 0 ? [{
                    id: 1000 + index,
                    forum_id: forumId,
                    auteur: `Prof. ${['Martin', 'Dubois', 'Bernard'][index % 3]}`,
                    contenu: 'Excellente question! Voici une explication détaillée...',
                    date: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
                    nombre_likes: Math.floor(Math.random() * 15),
                    est_auteur: false,
                    reponses: []
                }] : []
            }));
            setMessages(messagesData);
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
            setMessages([]);
        }
    };

    const handleCreateTopic = async () => {
        try {
            const newForum: Forum = {
                id: forums.length + 1,
                titre: newTopic.titre,
                description: newTopic.description,
                cours_nom: 'Cours général',
                instructeur: 'Prof. Martin',
                categorie: newTopic.categorie,
                statut: 'ouvert',
                nombre_messages: 0,
                nombre_participants: 1,
                dernier_message: {
                    auteur: 'Moi',
                    date: new Date().toISOString(),
                    contenu: newTopic.contenu
                },
                date_creation: new Date().toISOString(),
                tags: []
            };

            setForums(prev => [newForum, ...prev]);
            setShowNewTopicModal(false);
            setNewTopic({ titre: '', description: '', categorie: '', contenu: '' });
        } catch (error) {
            console.error('Erreur lors de la création du sujet:', error);
        }
    };

    const handleReply = async (parentMessageId: number) => {
        if (!replyContent.trim()) return;

        try {
            const newMessage: Message = {
                id: messages.length + 1000,
                forum_id: selectedForum?.id || 0,
                auteur: 'Moi',
                avatar: '/avatar.jpg',
                contenu: replyContent,
                date: new Date().toISOString(),
                nombre_likes: 0,
                reponses: [],
                est_auteur: true
            };

            if (parentMessageId === 0) {
                setMessages(prev => [...prev, newMessage]);
            } else {
                setMessages(prev => prev.map(m =>
                    m.id === parentMessageId
                        ? { ...m, reponses: [...m.reponses, newMessage] }
                        : m
                ));
            }

            setReplyContent('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Erreur lors de la réponse:', error);
        }
    };

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

    const categories = ['tous', ...Array.from(new Set(forums.map(f => f.categorie)))];
    const statuts = ['tous', 'ouvert', 'ferme', 'epingle'];

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'ouvert': return 'text-green-600 bg-green-50';
            case 'ferme': return 'text-red-600 bg-red-50';
            case 'epingle': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getCategoryColor = (categorie: string) => {
        switch (categorie) {
            case 'Général': return 'text-blue-600 bg-blue-50';
            case 'Questions techniques': return 'text-purple-600 bg-purple-50';
            case 'Projets': return 'text-green-600 bg-green-50';
            case 'Examens': return 'text-red-600 bg-red-50';
            case 'Ressources': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMins = Math.floor(diffTime / (1000 * 60));
                return diffMins <= 1 ? 'À l\'instant' : `Il y a ${diffMins} min`;
            }
            return `Il y a ${diffHours}h`;
        }
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        return date.toLocaleDateString('fr-FR');
    };

    if (selectedForum) {
        return (
            <div className="space-y-8 animate-fadeInUp">
                {/* En-tête du forum */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => setSelectedForum(null)}
                            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
                        >
                            ← Retour aux forums
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">{selectedForum.titre}</h1>
                        <p className="text-gray-600 mt-2">{selectedForum.description}</p>
                    </div>
                    <button
                        onClick={() => setShowNewTopicModal(true)}
                        className="btn-gradient-blue px-4 py-2 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau sujet
                    </button>
                </div>

                {/* Messages du forum */}
                <div className="space-y-6">
                    {messages.map((message) => (
                        <Card key={message.id} className="card-gradient">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {message.auteur.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <h4 className="font-semibold text-gray-900">
                                                    {message.auteur}
                                                    {message.est_auteur && (
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Vous</span>
                                                    )}
                                                </h4>
                                                <span className="text-sm text-gray-500">{formatDate(message.date)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button className="text-gray-500 hover:text-blue-600 flex items-center text-sm">
                                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                                    {message.nombre_likes}
                                                </button>
                                                <button
                                                    onClick={() => setReplyingTo(message.id)}
                                                    className="text-gray-500 hover:text-blue-600 flex items-center text-sm"
                                                >
                                                    <Reply className="w-4 h-4 mr-1" />
                                                    Répondre
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4 leading-relaxed">{message.contenu}</p>

                                        {/* Réponses */}
                                        {message.reponses.length > 0 && (
                                            <div className="ml-8 space-y-4 border-l-2 border-gray-200 pl-4">
                                                {message.reponses.map((reponse) => (
                                                    <div key={reponse.id} className="flex items-start space-x-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                            {reponse.auteur.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h5 className="font-medium text-gray-900">{reponse.auteur}</h5>
                                                                <span className="text-xs text-gray-500">{formatDate(reponse.date)}</span>
                                                            </div>
                                                            <p className="text-gray-600 text-sm">{reponse.contenu}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Formulaire de réponse */}
                                        {replyingTo === message.id && (
                                            <div className="mt-4 ml-8">
                                                <textarea
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder="Écrivez votre réponse..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows={3}
                                                />
                                                <div className="flex items-center justify-end space-x-2 mt-2">
                                                    <button
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyContent('');
                                                        }}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button
                                                        onClick={() => handleReply(message.id)}
                                                        className="btn-gradient-blue text-sm px-4 py-2"
                                                    >
                                                        Répondre
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Formulaire de réponse principal */}
                    <Card className="card-gradient">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Participer à la discussion</h3>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Partagez votre réponse..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                            />
                            <div className="flex items-center justify-end mt-4">
                                <button
                                    onClick={() => handleReply(0)}
                                    disabled={!replyContent.trim()}
                                    className="btn-gradient-blue px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Publier
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Forums de Discussion
                    </h1>
                    <p className="text-gray-600 mt-2">Échangez avec vos camarades et instructeurs</p>
                </div>
                <button
                    onClick={() => setShowNewTopicModal(true)}
                    className="btn-gradient-blue px-4 py-2 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau sujet
                </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total forums</p>
                            <p className="text-2xl font-bold text-gray-900">{forums.length}</p>
                        </div>
                        <MessageCircle className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Messages</p>
                            <p className="text-2xl font-bold text-green-600">
                                {forums.reduce((acc, f) => acc + f.nombre_messages, 0)}
                            </p>
                        </div>
                        <MessageCircle className="w-8 h-8 text-green-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Participants</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {forums.reduce((acc, f) => acc + f.nombre_participants, 0)}
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-purple-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Actifs</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {forums.filter(f => f.statut === 'ouvert').length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-500" />
                    </div>
                </Card>
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
                                placeholder="Rechercher un forum, un sujet..."
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
                                        statut === 'ouvert' ? 'Ouverts' :
                                            statut === 'ferme' ? 'Fermés' : 'Épinglés'}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des forums */}
            <div className="space-y-6">
                {filteredForums.length > 0 ? (
                    filteredForums.map((forum) => (
                        <Card key={forum.id} className="card-gradient hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            {forum.statut === 'epingle' && <Pin className="w-4 h-4 text-yellow-500" />}
                                            {forum.statut === 'ferme' && <Lock className="w-4 h-4 text-red-500" />}
                                            <h3 className="text-xl font-bold text-gray-900">{forum.titre}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(forum.statut)}`}>
                                                {forum.statut === 'ouvert' ? 'Ouvert' :
                                                    forum.statut === 'ferme' ? 'Fermé' : 'Épinglé'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(forum.categorie)}`}>
                                                {forum.categorie}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{forum.description}</p>

                                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                                                <span>{forum.cours_nom}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1 text-green-500" />
                                                <span>{forum.instructeur}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                                                <span>Créé le {formatDate(forum.date_creation)}</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {forum.tags.length > 0 && (
                                            <div className="flex items-center space-x-2 mb-3">
                                                {forum.tags.map((tag, index) => (
                                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Dernier message */}
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <MessageCircle className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        <span className="font-medium">{forum.dernier_message.auteur}</span>: {forum.dernier_message.contenu}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">{formatDate(forum.dernier_message.date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 ml-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">{forum.nombre_messages}</p>
                                            <p className="text-xs text-gray-500">Messages</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">{forum.nombre_participants}</p>
                                            <p className="text-xs text-gray-500">Participants</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedForum(forum);
                                                fetchMessages(forum.id);
                                            }}
                                            className="btn-gradient-blue text-sm px-4 py-2"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Voir
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun forum trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos filtres ou créez un nouveau sujet</p>
                    </div>
                )}
            </div>

            {/* Modal nouveau sujet */}
            {showNewTopicModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Créer un nouveau sujet</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre du sujet
                                </label>
                                <input
                                    type="text"
                                    value={newTopic.titre}
                                    onChange={(e) => setNewTopic(prev => ({ ...prev, titre: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Entrez un titre clair et concis"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie
                                </label>
                                <select
                                    value={newTopic.categorie}
                                    onChange={(e) => setNewTopic(prev => ({ ...prev, categorie: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Sélectionnez une catégorie</option>
                                    <option value="Général">Général</option>
                                    <option value="Questions techniques">Questions techniques</option>
                                    <option value="Projets">Projets</option>
                                    <option value="Examens">Examens</option>
                                    <option value="Ressources">Ressources</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newTopic.description}
                                    onChange={(e) => setNewTopic(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Décrivez votre sujet en détail"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Premier message
                                </label>
                                <textarea
                                    value={newTopic.contenu}
                                    onChange={(e) => setNewTopic(prev => ({ ...prev, contenu: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={4}
                                    placeholder="Écrivez votre premier message pour lancer la discussion"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowNewTopicModal(false);
                                    setNewTopic({ titre: '', description: '', categorie: '', contenu: '' });
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreateTopic}
                                disabled={!newTopic.titre || !newTopic.categorie || !newTopic.contenu}
                                className="btn-gradient-blue px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Créer le sujet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(ForumsPage);
