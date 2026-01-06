'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    telephone?: string;
    adresse?: string;
    date_naissance?: string;
    roles: Array<{
        name: string;
    }>;
    created_at?: string;
}

export default function ProfileForm() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        telephone: '',
        adresse: '',
        date_naissance: ''
    });

    useEffect(() => {
        if (user) {
            setProfile({
                ...user,
                telephone: '',
                adresse: '',
                date_naissance: ''
            });
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                telephone: '',
                adresse: '',
                date_naissance: ''
            });
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await axios.put(`/v1/users/${profile?.id}`, formData);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Chargement du profil...</div>;

    return (
        <div className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Prénom</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Nom</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Adresse</label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        value={formData.adresse}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Date de naissance</label>
                                    <input
                                        type="date"
                                        name="date_naissance"
                                        value={formData.date_naissance}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? 'Enregistrement...' : 'Mettre à jour le profil'}
                                </button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rôle(s)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {profile?.roles.map((role, index) => (
                                    <span
                                        key={index}
                                        className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statut du compte</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm">Membre depuis:</span>
                                <span className="text-sm font-medium">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Statut:</span>
                                <span className="text-sm font-medium text-green-600">Actif</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">ID Utilisateur:</span>
                                <span className="text-sm font-medium">#{profile?.id}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sécurité</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <button className="w-full p-2 border rounded-md hover:bg-gray-50 text-left">
                                Changer le mot de passe
                            </button>
                            <button className="w-full p-2 border rounded-md hover:bg-gray-50 text-left">
                                Activer l'authentification à deux facteurs
                            </button>
                            <button className="w-full p-2 border rounded-md hover:bg-gray-50 text-left text-red-600">
                                Supprimer le compte
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
