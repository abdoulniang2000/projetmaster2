'use client';

import React from 'react';
import withAuth from '@/app/components/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard, ActionCard, ProgressCard, StatusBadge, GradientText } from '@/components/theme/ThemeComponents';
import {
    Users,
    BookOpen,
    TrendingUp,
    Award,
    Calendar,
    Bell,
    Download,
    Upload,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Info
} from 'lucide-react';

function ThemeDemoPage() {
    return (
        <div className="space-y-8 p-6 animate-fadeInUp">
            {/* En-tête avec dégradé */}
            <div className="text-center py-12">
                <h1 className="text-6xl font-bold mb-4">
                    <GradientText from="orange" to="blue">
                        Thème Orange
                    </GradientText>
                    <GradientText from="blue" to="green">
                        Bleu Vert
                    </GradientText>
                </h1>
                <p className="text-xl text-gray-600">
                    Démonstration du nouveau thème de couleurs de l'application
                </p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Utilisateurs"
                    value="1,234"
                    subtitle="Total actifs"
                    icon={Users}
                    color="orange"
                    trend="+12%"
                    positive={true}
                    detail="Étudiants: 987, Enseignants: 247"
                />
                <StatCard
                    title="Cours"
                    value="56"
                    subtitle="Disponibles"
                    icon={BookOpen}
                    color="blue"
                    trend="+8%"
                    positive={true}
                    detail="Actifs: 45, En préparation: 11"
                />
                <StatCard
                    title="Taux de réussite"
                    value="87%"
                    subtitle="Moyenne générale"
                    icon={Award}
                    color="green"
                    trend="+3%"
                    positive={true}
                    detail="Semaine dernière: 84%"
                />
            </div>

            {/* Cartes d'action */}
            <div>
                <h2 className="text-2xl font-bold mb-6">
                    <GradientText from="orange" to="green">
                        Actions Rapides
                    </GradientText>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ActionCard
                        title="Gestion des utilisateurs"
                        description="Ajoutez, modifiez ou supprimez des utilisateurs"
                        icon={Users}
                        color="orange"
                        href="/dashboard/admin/users"
                    />
                    <ActionCard
                        title="Créer un cours"
                        description="Ajoutez un nouveau cours avec du contenu"
                        icon={BookOpen}
                        color="blue"
                        href="/dashboard/admin/cours"
                    />
                    <ActionCard
                        title="Voir les statistiques"
                        description="Analysez les performances de la plateforme"
                        icon={TrendingUp}
                        color="green"
                        href="/dashboard/admin/analytics"
                    />
                </div>
            </div>

            {/* Barres de progression */}
            <div>
                <h2 className="text-2xl font-bold mb-6">
                    <GradientText from="blue" to="orange">
                        Progression
                    </GradientText>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProgressCard
                        title="Completion du profil"
                        current="75"
                        total="100"
                        color="orange"
                    />
                    <ProgressCard
                        title="Cours terminés"
                        current="12"
                        total="15"
                        color="blue"
                    />
                    <ProgressCard
                        title="Objectifs mensuels"
                        current="8"
                        total="10"
                        color="green"
                    />
                </div>
            </div>

            {/* Badges de statut */}
            <div>
                <h2 className="text-2xl font-bold mb-6">
                    <GradientText from="green" to="blue">
                        Badges de Statut
                    </GradientText>
                </h2>
                <div className="flex flex-wrap gap-4">
                    <StatusBadge status="success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Succès
                    </StatusBadge>
                    <StatusBadge status="warning">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Attention
                    </StatusBadge>
                    <StatusBadge status="error">
                        <XCircle className="w-3 h-3 mr-1" />
                        Erreur
                    </StatusBadge>
                    <StatusBadge status="info">
                        <Info className="w-3 h-3 mr-1" />
                        Information
                    </StatusBadge>
                </div>
            </div>

            {/* Boutons */}
            <div>
                <h2 className="text-2xl font-bold mb-6">
                    <GradientText from="orange" to="green">
                        Boutons Thémés
                    </GradientText>
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Button variant="orange">
                        <Upload className="w-4 h-4 mr-2" />
                        Orange
                    </Button>
                    <Button variant="blue">
                        <Download className="w-4 h-4 mr-2" />
                        Bleu
                    </Button>
                    <Button variant="green">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Vert
                    </Button>
                    <Button variant="primary">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Dégradé Complet
                    </Button>
                    <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Outline
                    </Button>
                </div>
            </div>

            {/* Cartes avec différentes couleurs */}
            <div>
                <h2 className="text-2xl font-bold mb-6">
                    <GradientText from="blue" to="green">
                        Cartes Colorées
                    </GradientText>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardHeader>
                            <CardTitle className="text-orange-800">Thème Orange</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-orange-700">
                                Utilisé pour les actions principales, les alertes et les éléments importants.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardHeader>
                            <CardTitle className="text-blue-800">Thème Bleu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-blue-700">
                                Utilisé pour les informations, les liens et les éléments secondaires.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100">
                        <CardHeader>
                            <CardTitle className="text-green-800">Thème Vert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-green-700">
                                Utilisé pour les succès, les validations et les états positifs.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Palette de couleurs */}
            <div>
                <h2 className="text-2xl font-bold mb-6">
                    <GradientText from="orange" to="blue">
                        Palette de Couleurs
                    </GradientText>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-orange-800">Orange</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                <div
                                    key={shade}
                                    className={`h-8 w-8 rounded bg-orange-${shade} border border-gray-200`}
                                    title={`orange-${shade}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-blue-800">Bleu</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                <div
                                    key={shade}
                                    className={`h-8 w-8 rounded bg-blue-${shade} border border-gray-200`}
                                    title={`blue-${shade}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-green-800">Vert</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                <div
                                    key={shade}
                                    className={`h-8 w-8 rounded bg-green-${shade} border border-gray-200`}
                                    title={`green-${shade}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(ThemeDemoPage);
