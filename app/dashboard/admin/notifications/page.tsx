'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, MessageSquare, Send, Search, Filter, Clock, CheckCircle, AlertCircle, Info, X, Reply, Forward, Archive, Trash2, Star, Users, Calendar, Paperclip, Smile, MoreVertical } from 'lucide-react';

interface Notification {
    id: number;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    action_url?: string;
    sender?: {
        id: number;
        first_name: string;
        last_name: string;
        avatar?: string;
    };
    metadata?: {
        course_id?: number;
        assignment_id?: number;
        message_id?: number;
    };
}

interface Message {
    id: number;
    subject: string;
    content: string;
    sender: {
        id: number;
        first_name: string;
        last_name: string;
        role: string;
        avatar?: string;
    };
    recipient: {
        id: number;
        first_name: string;
        last_name: string;
        role: string;
    };
    created_at: string;
    read_at?: string;
    has_attachments: boolean;
    attachments?: {
        id: number;
        filename: string;
        size: number;
        url: string;
    }[];
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    thread_id?: number;
    reply_count: number;
}

interface Conversation {
    id: number;
    participant: {
        id: number;
        first_name: string;
        last_name: string;
        role: string;
        avatar?: string;
        is_online: boolean;
        last_seen?: string;
    };
    last_message: {
        content: string;
        created_at: string;
        sender_id: number;
        read: boolean;
    };
    unread_count: number;
    is_pinned: boolean;
    tags: string[];
}

function NotificationCenterPage() {
    const [activeTab, setActiveTab] = useState<'notifications' | 'messages' | 'conversations'>('notifications');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messageContent, setMessageContent] = useState('');
    const [showCompose, setShowCompose] = useState(false);
    const [newMessage, setNewMessage] = useState({
        recipient_id: 0,
        subject: '',
        content: '',
        priority: 'medium' as const,
        tags: [] as string[]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notificationsRes, messagesRes, conversationsRes] = await Promise.all([
                    axios.get('/v1/notifications'),
                    axios.get('/v1/messages'),
                    axios.get('/v1/conversations')
                ]);
                setNotifications(notificationsRes.data || []);
                setMessages(messagesRes.data || []);
                setConversations(conversationsRes.data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const markNotificationAsRead = async (notificationId: number) => {
        try {
            await axios.put(`/v1/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Erreur lors de la marquage comme lu:', error);
        }
    };

    const markMessageAsRead = async (messageId: number) => {
        try {
            await axios.put(`/v1/messages/${messageId}/read`);
            setMessages(prev =>
                prev.map(m => m.id === messageId ? { ...m, read_at: new Date().toISOString() } : m)
            );
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    };

    const sendMessage = async () => {
        if (!messageContent.trim() || !selectedConversation) return;

        try {
            await axios.post('/v1/messages', {
                recipient_id: selectedConversation.participant.id,
                content: messageContent,
                thread_id: selectedConversation.id
            });

            setMessageContent('');
            // Rafraîchir la conversation
            const messagesRes = await axios.get(`/v1/conversations/${selectedConversation.id}/messages`);
            // Mettre à jour les messages de la conversation
        } catch (error) {
            console.error('Erreur lors de l\\'envoi du message: ', error);
        }
    };

    const sendNewMessage = async () => {
        try {
            await axios.post('/v1/messages', newMessage);
            setShowCompose(false);
            setNewMessage({
                recipient_id: 0,
                subject: '',
                content: '',
                priority: 'medium',
                tags: []
            });
            // Rafraîchir les messages
            const messagesRes = await axios.get('/v1/messages');
            setMessages(messagesRes.data || []);
        } catch (error) {
            console.error('Erreur lors de l\\'envoi du message: ', error);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            await axios.delete(`/v1/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const archiveConversation = async (conversationId: number) => {
        try {
            await axios.put(`/v1/conversations/${conversationId}/archive`);
            setConversations(prev => prev.filter(c => c.id !== conversationId));
        } catch (error) {
            console.error('Erreur lors de l\\'archivage: ', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getNotificationBadgeClass = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || n.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Centre de Notifications
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez vos notifications et messages</p>
                </div>
                <button
                    onClick={() => setShowCompose(true)}
                    className="btn-gradient-primary flex items-center space-x-2"
                >
                    <Send className="w-5 h-5" />
                    <span>Nouveau message</span>
                </button>
            </div>

            {/* Onglets */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'notifications'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {notifications.filter(n => !n.read).length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'messages'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                    {messages.filter(m => !m.read_at).length > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {messages.filter(m => !m.read_at).length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('conversations')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'conversations'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    <span>Conversations</span>
                    {conversations.reduce((acc, c) => acc + c.unread_count, 0) > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {conversations.reduce((acc, c) => acc + c.unread_count, 0)}
                        </span>
                    )}
                </button>
            </div>

            {/* Barre de recherche et filtres */}
            <Card className="card-gradient">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="input-gradient w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {activeTab === 'notifications' && (
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    className="input-gradient pl-10 appearance-none"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="info">Informations</option>
                                    <option value="success">Succès</option>
                                    <option value="warning">Avertissements</option>
                                    <option value="error">Erreurs</option>
                                </select>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Contenu des onglets */}
            {activeTab === 'notifications' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                                    }`}
                                onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className="mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getNotificationBadgeClass(notification.priority)}`}>
                                                    {notification.priority}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(notification.created_at).toLocaleString('fr-FR')}
                                                </span>
                                                {notification.sender && (
                                                    <span>Par {notification.sender.first_name} {notification.sender.last_name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredNotifications.length === 0 && (
                            <div className="text-center py-12">
                                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {searchTerm || filterType !== 'all' ? 'Aucune notification trouvée' : 'Aucune notification'}
                                </h3>
                                <p className="text-gray-600">
                                    Vous êtes à jour !
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Résumé */}
                    <div className="space-y-4">
                        <Card className="card-gradient">
                            <CardHeader>
                                <CardTitle className="text-lg">Résumé</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Non lues</span>
                                    <span className="font-semibold">{notifications.filter(n => !n.read).length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Urgentes</span>
                                    <span className="font-semibold text-red-600">
                                        {notifications.filter(n => n.priority === 'urgent').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Aujourd'hui</span>
                                    <span className="font-semibold">
                                        {notifications.filter(n =>
                                            new Date(n.created_at).toDateString() === new Date().toDateString()
                                        ).length}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-gradient">
                            <CardHeader>
                                <CardTitle className="text-lg">Actions rapides</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <span className="text-sm">Marquer tout comme lu</span>
                                </button>
                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <span className="text-sm">Archiver les lues</span>
                                </button>
                                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <span className="text-sm">Paramètres de notification</span>
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'messages' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Messages reçus ({messages.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${message.read_at ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                                        }`}
                                    onClick={() => !message.read_at && markMessageAsRead(message.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {message.sender.first_name[0]}{message.sender.last_name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                                                    {!message.read_at && (
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{message.content}</p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span>De {message.sender.first_name} {message.sender.last_name}</span>
                                                    <span className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(message.created_at).toLocaleString('fr-FR')}
                                                    </span>
                                                    {message.has_attachments && (
                                                        <span className="flex items-center space-x-1">
                                                            <Paperclip className="w-3 h-3" />
                                                            Pièce jointe
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <Reply className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <Forward className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <Archive className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun message</h3>
                                    <p className="text-gray-600">Votre boîte de réception est vide</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'conversations' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {selectedConversation ? (
                            <Card className="card-gradient">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {selectedConversation.participant.first_name[0]}{selectedConversation.participant.last_name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {selectedConversation.participant.first_name} {selectedConversation.participant.last_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {selectedConversation.participant.is_online ? 'En ligne' : `Vu ${selectedConversation.participant.last_seen ? new Date(selectedConversation.participant.last_seen).toLocaleString('fr-FR') : 'jamais'}`}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 mb-4">
                                        {/* Messages de la conversation */}
                                        <div className="text-center text-gray-500 text-sm">
                                            Conversation chargée...
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Écrivez votre message..."
                                            className="input-gradient flex-1"
                                            value={messageContent}
                                            onChange={(e) => setMessageContent(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        />
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Smile className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={sendMessage}
                                            className="btn-gradient-primary"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-center py-12">
                                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
                                <p className="text-gray-600">Choisissez une conversation pour commencer à discuter</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedConversation?.id === conversation.id
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'bg-white border-gray-200'
                                    }`}
                                onClick={() => setSelectedConversation(conversation)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {conversation.participant.first_name[0]}{conversation.participant.last_name[0]}
                                        </div>
                                        {conversation.participant.is_online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {conversation.participant.first_name} {conversation.participant.last_name}
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                {new Date(conversation.last_message.created_at).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">
                                            {conversation.last_message.content}
                                        </p>
                                    </div>
                                    {conversation.unread_count > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                            {conversation.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal composition */}
            {showCompose && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl animate-scaleIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Nouveau message</h3>
                            <button
                                onClick={() => setShowCompose(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                                <select
                                    className="input-gradient w-full"
                                    value={newMessage.recipient_id}
                                    onChange={(e) => setNewMessage({ ...newMessage, recipient_id: parseInt(e.target.value) })}
                                >
                                    <option value="0">Sélectionner un destinataire</option>
                                    {/* Options à charger depuis l'API */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                                <input
                                    type="text"
                                    className="input-gradient w-full"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    className="input-gradient w-full h-32"
                                    value={newMessage.content}
                                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                                <select
                                    className="input-gradient w-full"
                                    value={newMessage.priority}
                                    onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value as any })}
                                >
                                    <option value="low">Basse</option>
                                    <option value="medium">Moyenne</option>
                                    <option value="high">Haute</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowCompose(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={sendNewMessage}
                                className="btn-gradient-primary"
                            >
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(NotificationCenterPage);
