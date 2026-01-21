'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertCircle, Info, X, Search, Filter, Calendar, Clock, BookOpen, Award, MessageCircle, FileText, Video } from 'lucide-react';

interface Notification {
    id: number;
    titre: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    categorie: 'cours' | 'devoir' | 'note' | 'forum' | 'systeme';
    date_creation: string;
    lue: boolean;
    priorite: 'basse' | 'moyenne' | 'haute';
    action_url?: string;
    action_label?: string;
    expire_le?: string;
}

function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('tous');
    const [selectedCategory, setSelectedCategory] = useState('tous');
    const [selectedStatus, setSelectedStatus] = useState('tous');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/v1/notifications');
                const notificationsData = response.data.map((n: any, index: number) => {
                    const types: ('info' | 'success' | 'warning' | 'error')[] = ['info', 'success', 'warning', 'error'];
                    const categories: ('cours' | 'devoir' | 'note' | 'forum' | 'systeme')[] = ['cours', 'devoir', 'note', 'forum', 'systeme'];
                    const priorites: ('basse' | 'moyenne' | 'haute')[] = ['basse', 'moyenne', 'haute'];

                    const messages = [
                        'Nouveau cours disponible: React Avancé',
                        'Votre devoir a été corrigé',
                        'Nouveau message dans le forum',
                        'Rappel: Examen demain à 14h',
                        'Félicitations! Vous avez terminé le module',
                        'Mise à jour du calendrier académique',
                        'Nouveau support de cours disponible',
                        'Votre inscription a été confirmée',
                        'Maintenance système prévue ce soir',
                        'Nouveau webinaire annoncé'
                    ];

                    return {
                        ...n,
                        type: types[index % types.length],
                        categorie: categories[index % categories.length],
                        priorite: priorites[index % priorites.length],
                        titre: messages[index % messages.length].split(':')[0] || 'Notification',
                        message: messages[index % messages.length],
                        date_creation: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                        lue: Math.random() > 0.3,
                        action_url: Math.random() > 0.5 ? '/dashboard/etudiant/cours' : undefined,
                        action_label: Math.random() > 0.5 ? 'Voir les détails' : undefined,
                        expire_le: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
                    };
                });
                setNotifications(notificationsData);
                setFilteredNotifications(notificationsData);
            } catch (error) {
                console.error('Erreur lors du chargement des notifications:', error);
                setNotifications([]);
                setFilteredNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        let filtered = notifications;

        // Filtrage par recherche
        if (searchTerm) {
            filtered = filtered.filter(n =>
                n.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par type
        if (selectedType !== 'tous') {
            filtered = filtered.filter(n => n.type === selectedType);
        }

        // Filtrage par catégorie
        if (selectedCategory !== 'tous') {
            filtered = filtered.filter(n => n.categorie === selectedCategory);
        }

        // Filtrage par statut (lu/non lu)
        if (selectedStatus !== 'tous') {
            filtered = filtered.filter(n => selectedStatus === 'lues' ? n.lue : !n.lue);
        }

        setFilteredNotifications(filtered);
    }, [searchTerm, selectedType, selectedCategory, selectedStatus, notifications]);

    const markAsRead = async (notificationId: number) => {
        try {
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, lue: true } : n
            ));
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, lue: true })));
        } catch (error) {
            console.error('Erreur lors du marquage tout comme lu:', error);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

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

    const types = ['tous', 'info', 'success', 'warning', 'error'];
    const categories = ['tous', 'cours', 'devoir', 'note', 'forum', 'systeme'];
    const statuts = ['tous', 'non_lues', 'lues'];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'success': return 'text-green-600 bg-green-50 border-green-200';
            case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'error': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getCategoryIcon = (categorie: string) => {
        switch (categorie) {
            case 'cours': return <BookOpen className="w-5 h-5" />;
            case 'devoir': return <FileText className="w-5 h-5" />;
            case 'note': return <Award className="w-5 h-5" />;
            case 'forum': return <MessageCircle className="w-5 h-5" />;
            case 'systeme': return <Info className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getPriorityColor = (priorite: string) => {
        switch (priorite) {
            case 'haute': return 'border-l-red-500';
            case 'moyenne': return 'border-l-yellow-500';
            case 'basse': return 'border-l-green-500';
            default: return 'border-l-gray-500';
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

    const unreadCount = notifications.filter(n => !n.lue).length;

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Notifications
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes vos notifications'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="btn-gradient-blue px-4 py-2 flex items-center"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                        </div>
                        <Bell className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Non lues</p>
                            <p className="text-2xl font-bold text-yellow-600">{unreadCount}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Priorité haute</p>
                            <p className="text-2xl font-bold text-red-600">
                                {notifications.filter(n => n.priorite === 'haute').length}
                            </p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Cette semaine</p>
                            <p className="text-2xl font-bold text-green-600">
                                {notifications.filter(n => {
                                    const notifDate = new Date(n.date_creation);
                                    const now = new Date();
                                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                                    return notifDate >= weekStart;
                                }).length}
                            </p>
                        </div>
                        <Calendar className="w-8 h-8 text-green-500" />
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
                                placeholder="Rechercher une notification..."
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
                                    {type === 'tous' ? 'Tous les types' :
                                        type === 'info' ? 'Informations' :
                                            type === 'success' ? 'Succès' :
                                                type === 'warning' ? 'Avertissements' : 'Erreurs'}
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
                                    {cat === 'tous' ? 'Toutes les catégories' :
                                        cat === 'cours' ? 'Cours' :
                                            cat === 'devoir' ? 'Devoirs' :
                                                cat === 'note' ? 'Notes' :
                                                    cat === 'forum' ? 'Forums' : 'Système'}
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
                                    {statut === 'tous' ? 'Toutes' :
                                        statut === 'non_lues' ? 'Non lues' : 'Lues'}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des notifications */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`card-gradient border-l-4 ${getPriorityColor(notification.priorite)} ${!notification.lue ? 'bg-blue-50/50' : ''
                                } hover:shadow-lg transition-all duration-300`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Icône de catégorie */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)}`}>
                                            {getCategoryIcon(notification.categorie)}
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className={`font-semibold text-gray-900 ${!notification.lue ? 'font-bold' : ''}`}>
                                                    {notification.titre}
                                                </h3>
                                                {!notification.lue && (
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                )}
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                                                    {notification.type === 'info' ? 'Info' :
                                                        notification.type === 'success' ? 'Succès' :
                                                            notification.type === 'warning' ? 'Attention' : 'Erreur'}
                                                </span>
                                                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                                    {notification.categorie}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-3">{notification.message}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        <span>{formatDate(notification.date_creation)}</span>
                                                    </div>
                                                    {notification.expire_le && (
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            <span>Expire le {new Date(notification.expire_le).toLocaleDateString('fr-FR')}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center space-x-2">
                                                    {!notification.lue && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Marquer comme lu
                                                        </button>
                                                    )}
                                                    {notification.action_url && (
                                                        <a
                                                            href={notification.action_url}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                        >
                                                            {notification.action_label || 'Voir les détails'}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bouton de suppression */}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-gray-400 hover:text-red-600 ml-4"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
                        <p className="text-gray-600">
                            {searchTerm || selectedType !== 'tous' || selectedCategory !== 'tous' || selectedStatus !== 'tous'
                                ? 'Essayez de modifier vos filtres'
                                : 'Vous n\'avez aucune notification pour le moment'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(NotificationsPage);
