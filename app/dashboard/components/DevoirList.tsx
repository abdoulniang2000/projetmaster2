'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Devoir {
    id: number;
    titre: string;
    description: string;
    date_limite: string;
    cours: {
        nom: string;
    };
}

export default function DevoirList() {
    const [devoirs, setDevoirs] = useState<Devoir[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/v1/devoirs')
            .then(response => {
                setDevoirs(response.data);
            })
            .catch(() => {
                setError('Impossible de charger les devoirs.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Chargement des devoirs...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devoirs.map(d => (
                <Link href={`/dashboard/devoirs/${d.id}`} key={d.id}>
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{d.titre}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Cours: {d.cours.nom}</p>
                            <p className="text-xs mt-4">Date limite: {new Date(d.date_limite).toLocaleDateString()}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
