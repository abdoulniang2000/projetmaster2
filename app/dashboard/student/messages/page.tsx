'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Search, Users, Clock, Check, AlertCircle, Paperclip } from 'lucide-react';

interface Message {
    id: number;
    sujet?: string;
    contenu: string;
    expediteur: {
        id: number;
        first_name: string;
        last_name: string;
    };
    destinataire?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    groupe?: {
        id: number;
        nom: string;
    };
    tags: string[];
    is_urgent: boolean;
    is_read: boolean;
    read_at?: string;
    created_at: string;
    fichiers?: any[];
}

interface Conversation {
    user: {
        id: number;
        first_name: string;
        last_name: string;
    };
    messages: Message[];
    unread_count: number;
}

function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [groupMessages, setGroupMessages] = useState<Message[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [recipientId, setRecipientId] = useState<number | null>(null);
    const [isUrgent, setIsUrgent] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'private' | 'group'>('private');

    useEffect(() => {
        fetchConversations();
        fetchGroupMessages();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await axios.get('/v1/messages');
            const conversationsData = Object.entries(response.data).map(([userId, messages]: [string, any]) => ({
                user: (messages as Message[])[0]?.expediteur || (messages as Message[])[0]?.destinataire,
                messages: messages as Message[],
                unread_count: (messages as Message[]).filter(m => !m.is_read && m.destinataire?.id !== (messages as Message[])[0]?.expediteur?.id).length
            }));
            setConversations(conversationsData);
        } catch (error) {
            console.error('Erreur lors du chargement des conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupMessages = async (courseId?: number) => {
        try {
            const url = courseId ? `/v1/cours/${courseId}/messages` : '/v1/messages?groupe_only=true';
            const response = await axios.get(url);
            setGroupMessages(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des messages de groupe:', error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            const payload: any = {
                contenu: message,
                is_urgent: isUrgent,
                tags: tags
            };

            if (activeTab === 'private' && recipientId) {
                payload.destinataire_id = recipientId;
                payload.sujet = subject;
            } else if (activeTab === 'group' && selectedCourse) {
                payload.groupe_id = selectedCourse;
            }

            const response = await axios.post('/v1/messages', payload);

            if (activeTab === 'private' && selectedConversation) {
                setSelectedConversation(prev => ({
                    ...prev!,
                    messages: [...prev!.messages, response.data]
                }));
            } else if (activeTab === 'group') {
                setGroupMessages(prev => [...prev, response.data]);
            }

            setMessage('');
            setSubject('');
            setIsUrgent(false);
            setTags([]);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    const markAsRead = async (messageId: number) => {
        try {
            await axios.put(`/v1/messages/${messageId}/read`);
            // Update local state
            setConversations(prev => prev.map(conv => ({
                ...conv,
                messages: conv.messages.map(m =>
                    m.id === messageId ? { ...m, is_read: true, read_at: new Date().toISOString() } : m
                ),
                unread_count: conv.messages.filter(m => m.id === messageId && !m.is_read).length > 0
                    ? conv.unread_count - 1
                    : conv.unread_count
            })));
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des messages...</p>
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
                        Messagerie
                    </h1>
                    <p className="text-gray-600 mt-2">Communiquez avec vos camarades et enseignants</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant={activeTab === 'private' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('private')}
                        className={activeTab === 'private' ? 'btn-gradient-primary' : ''}
                    >
                        Messages privés
                    </Button>
                    <Button
                        variant={activeTab === 'group' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('group')}
                        className={activeTab === 'group' ? 'btn-gradient-primary' : ''}
                    >
                        Groupes de cours
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Liste des conversations/groupes */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {activeTab === 'private' ? 'Conversations' : 'Groupes'}
                    </h2>

                    {activeTab === 'private' ? (
                        <div className="space-y-2">
                            {conversations.map((conversation) => (
                                <Card
                                    key={conversation.user.id}
                                    className={`card-gradient hover:shadow-md transition-all cursor-pointer ${selectedConversation?.user.id === conversation.user.id ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    onClick={() => setSelectedConversation(conversation)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-medium text-gray-900">
                                                        {conversation.user.first_name} {conversation.user.last_name}
                                                    </h3>
                                                    {conversation.unread_count > 0 && (
                                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                                            {conversation.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {conversation.messages[conversation.messages.length - 1]?.contenu}
                                                </p>
                                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(conversation.messages[conversation.messages.length - 1]?.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* TODO: Charger la liste des cours de l'étudiant */}
                            <Card className="card-gradient hover:shadow-md transition-all cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">Développement Web</h3>
                                            <p className="text-sm text-gray-600">Groupe principal</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Zone de conversation */}
                <div className="lg:col-span-2">
                    {activeTab === 'private' && selectedConversation ? (
                        <Card className="card-gradient h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                            {selectedConversation.user.first_name[0]}{selectedConversation.user.last_name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {selectedConversation.user.first_name} {selectedConversation.user.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-600">En ligne</p>
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
                                    {selectedConversation.messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.expediteur.id === 1 ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.expediteur.id === 1
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                }`}>
                                                {msg.sujet && (
                                                    <p className="font-medium mb-1">{msg.sujet}</p>
                                                )}
                                                <p className="text-sm">{msg.contenu}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs opacity-70">
                                                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {msg.expediteur.id === 1 && (
                                                        <Check className="w-3 h-3 opacity-70" />
                                                    )}
                                                </div>
                                                {msg.is_urgent && (
                                                    <div className="flex items-center space-x-1 mt-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span className="text-xs">Urgent</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Zone d'envoi */}
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Sujet (optionnel)"
                                        className="input-gradient w-full"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Tapez votre message..."
                                            className="input-gradient flex-1"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        />
                                        <Button
                                            onClick={sendMessage}
                                            className="btn-gradient-primary"
                                            disabled={!message.trim()}
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={isUrgent}
                                                onChange={(e) => setIsUrgent(e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-600">Urgent</span>
                                        </label>
                                        <Button variant="ghost" size="sm">
                                            <Paperclip className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : activeTab === 'group' ? (
                        <Card className="card-gradient h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Groupe de cours</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
                                    {groupMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.expediteur.id === 1 ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.expediteur.id === 1
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                }`}>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-medium text-sm">
                                                        {msg.expediteur.first_name} {msg.expediteur.last_name}
                                                    </span>
                                                    {msg.is_urgent && (
                                                        <AlertCircle className="w-3 h-3 text-red-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm">{msg.contenu}</p>
                                                <span className="text-xs opacity-70 mt-1 block">
                                                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Message pour le groupe..."
                                            className="input-gradient flex-1"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        />
                                        <Button
                                            onClick={sendMessage}
                                            className="btn-gradient-primary"
                                            disabled={!message.trim()}
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="card-gradient h-full flex items-center justify-center">
                            <CardContent className="text-center">
                                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {activeTab === 'private' ? 'Sélectionnez une conversation' : 'Sélectionnez un groupe'}
                                </h3>
                                <p className="text-gray-600">
                                    {activeTab === 'private'
                                        ? 'Choisissez une conversation dans la liste pour commencer à discuter'
                                        : 'Choisissez un groupe de cours pour voir les messages'
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

export default withAuth(MessagesPage);
