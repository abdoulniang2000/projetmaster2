'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Message {
    id: number;
    sujet: string;
    contenu: string;
    expediteur: {
        id: number;
        first_name: string;
        last_name: string;
    };
    destinataire: {
        id: number;
        first_name: string;
        last_name: string;
    };
    created_at: string;
    lu: boolean;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export default function MessageList() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [messagesRes, usersRes] = await Promise.all([
                    axios.get('/v1/messages'),
                    axios.get('/v1/users')
                ]);

                setMessages(messagesRes.data || []);
                setUsers(usersRes.data || []);
            } catch (error) {
                setError('La messagerie sera bientôt disponible.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Chargement des messages...</div>;
    if (error) return <div className="text-yellow-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Messages récents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {messages.length > 0 ? (
                                <div className="space-y-4">
                                    {messages.slice(0, 10).map(message => (
                                        <div
                                            key={message.id}
                                            className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${!message.lu ? 'bg-blue-50 border-blue-200' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{message.sujet}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        De: {message.expediteur.first_name} {message.expediteur.last_name}
                                                    </p>
                                                    <p className="text-sm mt-2 line-clamp-2">{message.contenu}</p>
                                                </div>
                                                <div className="text-xs text-muted-foreground ml-4">
                                                    {new Date(message.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {!message.lu && (
                                                <div className="mt-2">
                                                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                        Non lu
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {messages.length > 10 && (
                                        <div className="text-center">
                                            <button className="text-blue-600 hover:underline">
                                                Voir tous les messages ({messages.length - 10} autres)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Aucun message pour le moment.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Nouveau message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Destinataire</label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="">Choisir un destinataire...</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Sujet</label>
                                <input
                                    type="text"
                                    placeholder="Sujet du message..."
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    placeholder="Votre message..."
                                    rows={4}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                                Envoyer le message
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Statistiques</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm">Total messages:</span>
                                <span className="font-medium">{messages.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Non lus:</span>
                                <span className="font-medium text-blue-600">
                                    {messages.filter(m => !m.lu).length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Utilisateurs:</span>
                                <span className="font-medium">{users.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
