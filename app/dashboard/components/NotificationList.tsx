'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/theme/ThemeComponents';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info, Check } from 'lucide-react';

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
                const response = await axios.get('/api/notifications');
                setNotifications(response.data || []);
            } catch (error) {
                setError('Les notifications seront bientôt disponibles.');
                // Données de test en attendant l'API
                setNotifications([
                    {
                        id: 1,
                        titre: 'Nouveau devoir disponible',
                        message: 'Un nouveau devoir a été publié dans votre cours de Mathématiques.',
                        type: 'info',
                        lu: false,
                        created_at: new Date().toISOString()
                    },
                    {
                        id: 2,
                        titre: 'Note disponible',
                        message: 'Votre note pour le devoir de Physique est maintenant disponible.',
                        type: 'success',
                        lu: false,
                        created_at: new Date(Date.now() - 3600000).toISOString()
                    },
                    {
                        id: 3,
                        titre: 'Rappel : Examen demain',
                        message: 'N\'oubliez pas votre examen d\'Informatique prévu pour demain à 9h.',
                        type: 'warning',
                        lu: true,
                        created_at: new Date(Date.now() - 7200000).toISOString()
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId: number) => {
        try {
            await axios.patch(`/api/notifications/${notificationId}/marquer-lu`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, lu: true } : n)
            );
        } catch (error) {
            // Simulation en attendant l'API
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, lu: true } : n)
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch('/api/notifications/marquer-toutes-lues');
            setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
        } catch (error) {
            // Simulation en attendant l'API
            setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-600 bg-green-50 border-green-200';
            case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'error': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'error': return <XCircle className="w-5 h-5" />;
            default: return <Info className="w-5 h-5" />;
        }
    };

    if (loading) return <div className="text-center py-8">Chargement des notifications...</div>;
    if (error) return <div className="text-center py-8 text-orange-600">{error}</div>;

    const unreadCount = notifications.filter(n => !n.lu).length;

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    <GradientText from="orange" to="blue">
                        Mes Notifications
                    </GradientText>
                    {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 text-sm bg-orange-500 text-white rounded-full">
                            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                        </span>
                    )}
                </h2>
                {unreadCount > 0 && (
                    <Button variant="blue" onClick={markAllAsRead}>
                        <Check className="w-4 h-4 mr-2" />
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {/* Liste des notifications */}
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <Card
                            key={notification.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${!notification.lu ? 'border-l-4 border-l-orange-500' : ''
                                }`}
                            onClick={() => !notification.lu && markAsRead(notification.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                                        {getTypeIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">{notification.titre}</h3>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                                                    {notification.type}
                                                </span>
                                                {!notification.lu && (
                                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mt-2">{notification.message}</p>
                                        <p className="text-sm text-gray-500 mt-3">
                                            {new Date(notification.created_at).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
                            <p className="text-gray-600">
                                Vous n'avez aucune notification pour le moment.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Paramètres de notification */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <GradientText from="green" to="blue">
                            Paramètres de notification
                        </GradientText>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm">Recevoir les notifications par email</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm">Notifications pour les nouveaux devoirs</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm">Notifications pour les nouvelles notes</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm">Notifications pour les messages</span>
                        </label>
                    </div>
                    <Button variant="green" className="w-full">
                        Sauvegarder les préférences
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
