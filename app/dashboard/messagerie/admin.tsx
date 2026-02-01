'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/app/components/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/theme/ThemeComponents';
import {
    MessageSquare,
    Users,
    BookOpen,
    Plus,
    Search,
    Filter,
    Hash,
    Bell,
    Send,
    Paperclip,
    Smile,
    Settings,
    BarChart3,
    Download,
    Eye,
    Archive,
    Trash2,
    Shield,
    AlertTriangle,
    Activity,
    Mail,
    MessageCircle,
    UserX,
    Ban,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';

interface Conversation {
    id: number;
    titre: string;
    description?: string;
    type: 'prive' | 'groupe' | 'matiere';
    cours_id?: number;
    createur_id: number;
    statut: 'actif' | 'archive' | 'ferme';
    dernier_message_date?: string;
    dernier_message_contenu?: string;
    dernier_message_auteur?: string;
    nombre_messages: number;
    nombre_participants: number;
    nombre_messages_non_lus: number;
    role_utilisateur: string;
    cours?: any;
    createur?: any;
    participants?: any[];
}

interface Message {
    id: number;
    conversation_id: number;
    expediteur_id: number;
    contenu: string;
    type: 'texte' | 'fichier' | 'image' | 'lien';
    fichier_path?: string;
    fichier_nom?: string;
    fichier_taille?: string;
    lien_url?: string;
    lien_titre?: string;
    est_edite: boolean;
    date_edition?: string;
    date_envoi: string;
    expediteur?: any;
    tags?: any[];
}

interface SystemStats {
    totalConversations: number;
    totalMessages: number;
    totalUsers: number;
    messagesAujourdHui: number;
    conversationsActives: number;
    utilisateursActifs: number;
    signalements: number;
    messagesSignales: number;
}

function AdminMessageriePage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('tous');
    const [filterStatus, setFilterStatus] = useState('tous');
    const [newMessage, setNewMessage] = useState('');
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    const [viewMode, setViewMode] = useState<'liste' | 'cours' | 'matiere' | 'signalements'>('liste');
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [newConversation, setNewConversation] = useState({
        titre: '',
        description: '',
        type: 'prive' as 'prive' | 'groupe' | 'matiere',
        cours_id: '',
        participants: [] as number[]
    });
    const [availableTags, setAvailableTags] = useState<{ [key: string]: string }>({});
    const [showStats, setShowStats] = useState(true);
    const [systemStats, setSystemStats] = useState<SystemStats>({
        totalConversations: 0,
        totalMessages: 0,
        totalUsers: 0,
        messagesAujourdHui: 0,
        conversationsActives: 0,
        utilisateursActifs: 0,
        signalements: 0,
        messagesSignales: 0
    });
    const [showModerationPanel, setShowModerationPanel] = useState(false);
    const [reportedMessages, setReportedMessages] = useState<Message[]>([]);

    useEffect(() => {
        fetchConversations();
        fetchAvailableUsers();
        fetchAvailableCourses();
        fetchAvailableTags();
        fetchSystemStats();
        fetchReportedMessages();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const fetchSystemStats = async () => {
        try {
            // Simuler des statistiques système
            const stats: SystemStats = {
                totalConversations: conversations.length,
                totalMessages: 1250,
                totalUsers: 150,
                messagesAujourdHui: 89,
                conversationsActives: 45,
                utilisateursActifs: 78,
                signalements: 3,
                messagesSignales: 7
            };
            setSystemStats(stats);
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques système:', error);
        }
    };

    const fetchReportedMessages = async () => {
        try {
            // Simuler des messages signalés
            const reported = [
                {
                    id: 1,
                    conversation_id: 1,
                    expediteur_id: 5,
                    contenu: "Message inapproprié signalé",
                    type: 'texte' as const,
                    est_edite: false,
                    date_envoi: new Date().toISOString(),
                    expediteur: { name: "Utilisateur 5", email: "user5@example.com" },
                    tags: [{ tag: '#signale', couleur: '#ef4444' }]
                }
            ];
            setReportedMessages(reported);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages signalés:', error);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const response = await axios.get('/v1/users');
            setAvailableUsers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const fetchAvailableCourses = async () => {
        try {
            const response = await axios.get('/v1/cours');
            setAvailableCourses(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des cours:', error);
        }
    };

    const fetchAvailableTags = async () => {
        try {
            const response = await axios.get('/v1/messages/tags');
            setAvailableTags(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des tags:', error);
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await axios.get('/v1/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId: number) => {
        try {
            const response = await axios.get(`/v1/conversations/${conversationId}/messages`);
            setMessages(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const tags = newMessage.match(/#\w+/g) || [];

            const response = await axios.post(`/v1/conversations/${selectedConversation.id}/messages`, {
                contenu: newMessage,
                type: 'texte',
                tags: tags
            });

            setMessages([...messages, response.data]);
            setNewMessage('');

            const updatedConversations = conversations.map(conv =>
                conv.id === selectedConversation.id
                    ? { ...conv, dernier_message_contenu: newMessage, dernier_message_date: new Date().toISOString() }
                    : conv
            );
            setConversations(updatedConversations);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    const createNewConversation = async () => {
        try {
            const response = await axios.post('/v1/conversations', newConversation);
            setConversations([response.data, ...conversations]);
            setShowNewConversationModal(false);
            setNewConversation({
                titre: '',
                description: '',
                type: 'prive',
                cours_id: '',
                participants: []
            });
            setSelectedConversation(response.data);
        } catch (error) {
            console.error('Erreur lors de la création de la conversation:', error);
        }
    };

    const addTagToMessage = (tag: string) => {
        setNewMessage(prev => prev + (prev ? ' ' : '') + tag);
    };

    const deleteConversation = async (conversationId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
            try {
                await axios.delete(`/v1/conversations/${conversationId}`);
                setConversations(conversations.filter(conv => conv.id !== conversationId));
                if (selectedConversation?.id === conversationId) {
                    setSelectedConversation(null);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const archiveConversation = async (conversationId: number) => {
        try {
            await axios.put(`/v1/conversations/${conversationId}/archive`);
            setConversations(conversations.filter(conv => conv.id !== conversationId));
        } catch (error) {
            console.error('Erreur lors de l\'archivage:', error);
        }
    };

    const banUser = async (userId: number) => {
        if (confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) {
            try {
                await axios.put(`/v1/users/${userId}/ban`);
                fetchAvailableUsers();
                alert('Utilisateur banni avec succès');
            } catch (error) {
                console.error('Erreur lors du bannissement:', error);
            }
        }
    };

    const deleteMessage = async (messageId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            try {
                await axios.delete(`/v1/messages/${messageId}`);
                setMessages(messages.filter(msg => msg.id !== messageId));
            } catch (error) {
                console.error('Erreur lors de la suppression du message:', error);
            }
        }
    };

    const exportData = async (type: 'conversations' | 'messages' | 'users') => {
        try {
            const response = await axios.get(`/v1/admin/export/${type}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_export.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'prive': return <Users className="w-4 h-4" />;
            case 'groupe': return <Users className="w-4 h-4" />;
            case 'matiere': return <BookOpen className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'prive': return 'text-blue-600 bg-blue-50';
            case 'groupe': return 'text-green-600 bg-green-50';
            case 'matiere': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'tous' || conv.type === filterType;
        const matchesStatus = filterStatus === 'tous' || conv.statut === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="h-full flex flex-col animate-fadeInUp">
            {/* En-tête admin */}
            <div className="border-b border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            <GradientText from="orange" to="blue">
                                Administration Messagerie
                            </GradientText>
                        </h1>
                        <p className="text-gray-600 mt-2">Gestion complète du système de messagerie</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowModerationPanel(!showModerationPanel)}
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Modération
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowStats(!showStats)}
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Statistiques
                        </Button>
                        <Button variant="blue" onClick={() => setShowNewConversationModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer une conversation
                        </Button>
                    </div>
                </div>

                {/* Statistiques système */}
                {showStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="card-gradient">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total conversations</p>
                                        <p className="text-2xl font-bold text-blue-600">{systemStats.totalConversations}</p>
                                    </div>
                                    <MessageSquare className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card-gradient">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total messages</p>
                                        <p className="text-2xl font-bold text-green-600">{systemStats.totalMessages}</p>
                                    </div>
                                    <Mail className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card-gradient">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                                        <p className="text-2xl font-bold text-purple-600">{systemStats.utilisateursActifs}</p>
                                    </div>
                                    <Activity className="w-8 h-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card-gradient">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Signalements</p>
                                        <p className="text-2xl font-bold text-red-600">{systemStats.signalements}</p>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Panneau de modération */}
                {showModerationPanel && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-red-800">Panneau de modération</h3>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => exportData('messages')}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Exporter
                                </Button>
                                <Button variant="outline" size="sm" onClick={fetchReportedMessages}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Actualiser
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {reportedMessages.map((message) => (
                                <div key={message.id} className="bg-white p-3 rounded border border-red-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">{message.contenu}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Par {message.expediteur?.name} • {new Date(message.date_envoi).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => banUser(message.expediteur_id)}>
                                                <Ban className="w-4 h-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => deleteMessage(message.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reportedMessages.length === 0 && (
                                <p className="text-center text-gray-500 py-4">Aucun message signalé</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Barre de recherche et filtres */}
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher une conversation..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="tous">Tous les types</option>
                        <option value="prive">Privées</option>
                        <option value="groupe">Groupes</option>
                        <option value="matiere">Matières</option>
                    </select>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="tous">Tous les statuts</option>
                        <option value="actif">Actives</option>
                        <option value="archive">Archivées</option>
                        <option value="ferme">Fermées</option>
                    </select>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex overflow-hidden">
                {/* Liste des conversations */}
                <div className="w-1/3 border-r border-gray-200/50 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center">
                            <div className="animate-pulse">Chargement...</div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200/50">
                            {filteredConversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => setSelectedConversation(conversation)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            {getTypeIcon(conversation.type)}
                                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(conversation.type)}`}>
                                                {conversation.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {conversation.nombre_messages_non_lus > 0 && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                    {conversation.nombre_messages_non_lus}
                                                </span>
                                            )}
                                            <Button variant="ghost" size="sm" onClick={(e) => {
                                                e.stopPropagation();
                                                archiveConversation(conversation.id);
                                            }}>
                                                <Archive className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={(e) => {
                                                e.stopPropagation();
                                                deleteConversation(conversation.id);
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{conversation.titre}</h3>
                                    {conversation.dernier_message_contenu && (
                                        <p className="text-sm text-gray-600 truncate">
                                            {conversation.dernier_message_contenu}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500">
                                            {conversation.dernier_message_auteur}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {conversation.dernier_message_date &&
                                                new Date(conversation.dernier_message_date).toLocaleDateString()
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Zone de conversation */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="border-b border-gray-200/50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {selectedConversation.titre}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {selectedConversation.nombre_participants} participants
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="w-4 h-4 mr-2" />
                                            Voir détails
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Gérer
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.expediteur_id === 1 ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-xs lg:max-w-md ${message.expediteur_id === 1
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                            } rounded-lg p-3`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold">
                                                    {message.expediteur?.name || 'Utilisateur'}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs opacity-70">
                                                        {new Date(message.date_envoi).toLocaleTimeString()}
                                                    </span>
                                                    <Button variant="ghost" size="sm" onClick={() => deleteMessage(message.id)}>
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm">{message.contenu}</p>
                                            {message.tags && message.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {message.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs px-2 py-1 rounded-full"
                                                            style={{ backgroundColor: tag.couleur + '20', color: tag.couleur }}
                                                        >
                                                            {tag.tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200/50 p-4">
                                {Object.keys(availableTags).length > 0 && (
                                    <div className="mb-3 flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Tags rapides:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {Object.entries(availableTags).map(([tag, color]) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => addTagToMessage(tag)}
                                                    className="text-xs px-2 py-1 rounded-full hover:opacity-80 transition-opacity"
                                                    style={{ backgroundColor: color + '20', color: color }}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                    <input
                                        type="text"
                                        placeholder="Tapez votre message... (utilisez #tag pour ajouter un tag)"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <Button variant="blue" onClick={sendMessage}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Sélectionnez une conversation
                                </h3>
                                <p className="text-gray-600">
                                    Choisissez une conversation dans la liste pour commencer à discuter
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nouvelle Conversation */}
            {showNewConversationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Nouvelle conversation</h3>
                            <button
                                onClick={() => setShowNewConversationModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type de conversation
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newConversation.type}
                                    onChange={(e) => setNewConversation({ ...newConversation, type: e.target.value as any })}
                                >
                                    <option value="prive">Privée</option>
                                    <option value="groupe">Groupe</option>
                                    <option value="matiere">Matière</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Entrez le titre de la conversation"
                                    value={newConversation.titre}
                                    onChange={(e) => setNewConversation({ ...newConversation, titre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Participants <span className="text-red-500">*</span>
                                </label>
                                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                                    {availableUsers.map((user: any) => (
                                        <label key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                checked={newConversation.participants.includes(user.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewConversation({
                                                            ...newConversation,
                                                            participants: [...newConversation.participants, user.id]
                                                        });
                                                    } else {
                                                        setNewConversation({
                                                            ...newConversation,
                                                            participants: newConversation.participants.filter(id => id !== user.id)
                                                        });
                                                    }
                                                }}
                                            />
                                            <span className="text-sm text-gray-700">
                                                {user.first_name} {user.last_name} ({user.email})
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowNewConversationModal(false)}
                                    className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={createNewConversation}
                                    disabled={!newConversation.titre || newConversation.participants.length === 0}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Créer la conversation</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(AdminMessageriePage);
