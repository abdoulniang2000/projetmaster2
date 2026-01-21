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
    Smile
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

function MessageriePage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('tous');
    const [newMessage, setNewMessage] = useState('');
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    const [viewMode, setViewMode] = useState<'liste' | 'cours'>('liste');

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get('/api/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId: number) => {
        try {
            const response = await axios.get(`/api/messages/conversations/${conversationId}`);
            setMessages(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const response = await axios.post(`/api/messages/conversations/${selectedConversation.id}`, {
                contenu: newMessage,
                type: 'texte'
            });

            setMessages([...messages, response.data]);
            setNewMessage('');

            // Mettre à jour la conversation
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

    const markAsRead = async (conversationId: number) => {
        try {
            await axios.put(`/api/conversations/${conversationId}/marquer-lue`);

            const updatedConversations = conversations.map(conv =>
                conv.id === conversationId
                    ? { ...conv, nombre_messages_non_lus: 0 }
                    : conv
            );
            setConversations(updatedConversations);
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'tous' || conv.type === filterType;
        return matchesSearch && matchesType;
    });

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

    return (
        <div className="h-full flex flex-col animate-fadeInUp">
            {/* En-tête */}
            <div className="border-b border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">
                        <GradientText from="orange" to="blue">
                            Messagerie Interne
                        </GradientText>
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant={viewMode === 'liste' ? 'blue' : 'outline'}
                            onClick={() => setViewMode('liste')}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Liste
                        </Button>
                        <Button
                            variant={viewMode === 'cours' ? 'blue' : 'outline'}
                            onClick={() => setViewMode('cours')}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Par matière
                        </Button>
                        <Button variant="orange" onClick={() => setShowNewConversationModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle conversation
                        </Button>
                    </div>
                </div>

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
                                    onClick={() => {
                                        setSelectedConversation(conversation);
                                        markAsRead(conversation.id);
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            {getTypeIcon(conversation.type)}
                                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(conversation.type)}`}>
                                                {conversation.type}
                                            </span>
                                        </div>
                                        {conversation.nombre_messages_non_lus > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                {conversation.nombre_messages_non_lus}
                                            </span>
                                        )}
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
                            {/* En-tête de la conversation */}
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
                                            <Filter className="w-4 h-4 mr-2" />
                                            Filtrer
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Bell className="w-4 h-4 mr-2" />
                                            Notifications
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
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
                                                <span className="text-xs opacity-70">
                                                    {new Date(message.date_envoi).toLocaleTimeString()}
                                                </span>
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

                            {/* Zone de saisie */}
                            <div className="border-t border-gray-200/50 p-4">
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                    <input
                                        type="text"
                                        placeholder="Tapez votre message..."
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
        </div>
    );
}

export default withAuth(MessageriePage);
