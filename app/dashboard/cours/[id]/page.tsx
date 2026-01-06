'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import withAuth from '@/app/components/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Enseignant {
    first_name: string;
    last_name: string;
}

interface Module {
    id: number;
    titre: string;
    contenu: string;
}

interface Devoir {
    id: number;
    titre: string;
    date_limite: string;
}

interface CoursDetail {
    id: number;
    nom: string;
    description: string;
    enseignant: Enseignant;
    modules: Module[];
    devoirs: Devoir[];
}

function CoursDetailPage() {
    const params = useParams();
    const { id } = params;
    const [cours, setCours] = useState<CoursDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`/cours/${id}`)
                .then(response => {
                    setCours(response.data);
                })
                .catch(() => {
                    setError('Impossible de charger les détails du cours.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!cours) return <div>Cours non trouvé.</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold">{cours.nom}</h1>
                <p className="text-lg text-muted-foreground">par {cours.enseignant.first_name} {cours.enseignant.last_name}</p>
                <p className="mt-4 text-lg">{cours.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Modules du cours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {cours.modules.map(module => (
                                <li key={module.id} className="p-4 border rounded-md">
                                    <h3 className="font-semibold">{module.titre}</h3>
                                    <p className="text-sm text-muted-foreground">{module.contenu}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Devoirs à rendre</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {cours.devoirs.map(devoir => (
                                <li key={devoir.id} className="p-4 border rounded-md">
                                    <h3 className="font-semibold">{devoir.titre}</h3>
                                    <p className="text-sm text-muted-foreground">Date limite : {new Date(devoir.date_limite).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default withAuth(CoursDetailPage);
