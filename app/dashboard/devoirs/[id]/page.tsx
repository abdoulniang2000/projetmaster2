'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import withAuth from '@/app/components/withAuth';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import SoumissionForm from '../../components/SoumissionForm';
import SoumissionList from '../../components/SoumissionList';

interface DevoirDetail {
    id: number;
    titre: string;
    description: string;
    date_limite: string;
    fichier_joint: string | null;
    cours: {
        id: number;
        nom: string;
    };
}

function DevoirDetailPage() {
    const params = useParams();
    const { id } = params;
    const { user } = useAuth();
    const [devoir, setDevoir] = useState<DevoirDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (id) {
            axios.get(`/devoirs/${id}`)
                .then(response => {
                    setDevoir(response.data);
                })
                .catch(() => {
                    setError('Impossible de charger les détails du devoir.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id, refreshKey]);

    const isEnseignant = user?.roles.some(role => role.name === 'enseignant' || role.name === 'admin');

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!devoir) return <div>Devoir non trouvé.</div>;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold">{devoir.titre}</CardTitle>
                    <CardDescription>
                        Pour le cours: <Link href={`/dashboard/cours/${devoir.cours.id}`} className="text-blue-500 hover:underline">{devoir.cours.nom}</Link>
                        <br />
                        Date limite : {new Date(devoir.date_limite).toLocaleString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mt-4 text-lg">{devoir.description}</p>
                    {devoir.fichier_joint && (
                        <div className="mt-6">
                            <h3 className="font-semibold">Pièce jointe :</h3>
                            <a href={`http://localhost:8000/storage/${devoir.fichier_joint}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Télécharger le fichier
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{isEnseignant ? 'Soumissions des étudiants' : 'Ma soumission'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isEnseignant ? (
                        <SoumissionList devoirId={devoir.id} />
                    ) : (
                        <SoumissionForm devoirId={devoir.id} onSoumissionReussie={() => setRefreshKey(oldKey => oldKey + 1)} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(DevoirDetailPage);
