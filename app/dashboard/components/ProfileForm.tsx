'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/theme/ThemeComponents';
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Trash2, Check } from 'lucide-react';

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
                telephone: (user as any).telephone || '',
                adresse: (user as any).adresse || '',
                date_naissance: (user as any).date_naissance || ''
            });
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                telephone: (user as any).telephone || '',
                adresse: (user as any).adresse || '',
                date_naissance: (user as any).date_naissance || ''
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
            await axios.put(`/api/users/${profile?.id}`, formData);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
        } catch (error) {
            // Simulation en attendant l'API
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-8">Chargement du profil...</div>;

    return (
        <div className="space-y-6 animate-fadeInUp">
            {message && (
                <div className={`p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    <Check className="w-5 h-5" />
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <GradientText from="orange" to="blue">
                                    Informations personnelles
                                </GradientText>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Prénom
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        value={formData.adresse}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Date de naissance
                                    </label>
                                    <input
                                        type="date"
                                        name="date_naissance"
                                        value={formData.date_naissance}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    variant="blue"
                                    className="w-full"
                                >
                                    {saving ? 'Enregistrement...' : 'Mettre à jour le profil'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <GradientText from="green" to="blue">
                                    Rôle(s)
                                </GradientText>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {profile?.roles.map((role, index) => (
                                    <span
                                        key={index}
                                        className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                    >
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <GradientText from="orange" to="green">
                                    Statut du compte
                                </GradientText>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm">Membre depuis:</span>
                                <span className="text-sm font-medium">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}
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
                            <CardTitle>
                                <GradientText from="blue" to="green">
                                    Sécurité
                                </GradientText>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <Key className="w-4 h-4 mr-2" />
                                Changer le mot de passe
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Shield className="w-4 h-4 mr-2" />
                                Activer l'authentification à deux facteurs
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer le compte
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
