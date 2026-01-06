'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification {
    id: number;
    titre: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    lu: boolean;
    created_at: string;
}

export default function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/v1/notifications');
                setNotifications(response.data || []);
            } catch (error) {
                setError('Les notifications seront bientôt disponibles.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId: number) => {
        try {
            await axios.patch(`/v1/notifications/${notificationId}`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, lu: true } : n)
            );
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch('/v1/notifications');
            setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
        } catch (error) {
            console.error('Erreur lors du marquage de toutes comme lues:', error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-100 border-green-200 text-green-800';
            case 'warning': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
            case 'error': return 'bg-red-100 border-red-200 text-red-800';
            default: return 'bg-blue-100 border-blue-200 text-blue-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    if (loading) return <div>Chargement des notifications...</div>;
    if (error) return <div className="text-yellow-600">{error}</div>;

    const unreadCount = notifications.filter(n => !n.lu).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    Notifications {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                        </span>
                    )}
                </h2>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <Card
                            key={notification.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${!notification.lu ? 'border-l-4 border-l-blue-500' : ''
                                }`}
                            onClick={() => !notification.lu && markAsRead(notification.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">
                                        {getTypeIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">{notification.titre}</h3>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs rounded ${getTypeColor(notification.type)}`}>
                                                    {notification.type}
                                                </span>
                                                {!notification.lu && (
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="text-4xl mb-4">🔔</div>
                            <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
                            <p className="text-muted-foreground">
                                Vous n'avez aucune notification pour le moment.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Paramètres de notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Recevoir les notifications par email</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Notifications pour les nouveaux devoirs</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Notifications pour les nouvelles notes</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Notifications pour les messages</span>
                        </label>
                    </div>
                    <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                        Sauvegarder les préférences
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
