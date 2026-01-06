'use client';

import withAuth from '@/app/components/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Bell, Shield, Palette, Globe } from 'lucide-react';

function SettingsPage() {
    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Paramètres
                </h1>
                <p className="text-gray-600 mt-2">Gérez vos préférences et paramètres du compte</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Paramètres du profil */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-orange-500" />
                            <span>Paramètres du profil</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nom complet</label>
                            <input type="text" className="input-gradient w-full" placeholder="Votre nom" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input type="email" className="input-gradient w-full" placeholder="votre@email.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Téléphone</label>
                            <input type="tel" className="input-gradient w-full" placeholder="+221 00 000 00 00" />
                        </div>
                        <button className="btn-gradient-blue w-full">
                            Mettre à jour le profil
                        </button>
                    </CardContent>
                </Card>

                {/* Préférences de notification */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Bell className="w-5 h-5 text-blue-500" />
                            <span>Notifications</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email notifications</p>
                                <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Notifications push</p>
                                <p className="text-sm text-gray-600">Notifications dans le navigateur</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Messages</p>
                                <p className="text-sm text-gray-600">Notifications de nouveaux messages</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Sécurité */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            <span>Sécurité</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mot de passe actuel</label>
                            <input type="password" className="input-gradient w-full" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                            <input type="password" className="input-gradient w-full" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                            <input type="password" className="input-gradient w-full" placeholder="••••••••" />
                        </div>
                        <button className="btn-gradient-green w-full">
                            Mettre à jour le mot de passe
                        </button>
                    </CardContent>
                </Card>

                {/* Apparence */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Palette className="w-5 h-5 text-purple-500" />
                            <span>Apparence</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Thème</label>
                            <select className="input-gradient w-full">
                                <option>Clair</option>
                                <option>Sombre</option>
                                <option>Automatique</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Langue</label>
                            <select className="input-gradient w-full">
                                <option>Français</option>
                                <option>Anglais</option>
                                <option>Wolof</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Fuseau horaire</label>
                            <select className="input-gradient w-full">
                                <option>UTC+0 (GMT)</option>
                                <option>UTC+1 (Paris/Dakar)</option>
                                <option>UTC+2 (Cairo)</option>
                            </select>
                        </div>
                        <button className="btn-gradient-primary w-full">
                            Sauvegarder les préférences
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default withAuth(SettingsPage);
