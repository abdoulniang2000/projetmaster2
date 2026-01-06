'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Soumission {
    id: number;
    etudiant: {
        first_name: string;
        last_name: string;
    };
    date_soumission: string;
    fichier_soumis: string;
    note: {
        note: number;
    } | null;
}

interface SoumissionListProps {
    devoirId: number;
}

export default function SoumissionList({ devoirId }: SoumissionListProps) {
    const [soumissions, setSoumissions] = useState<Soumission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`/devoirs/${devoirId}/soumissions`)
            .then(response => {
                setSoumissions(response.data);
            })
            .catch(() => {
                setError('Impossible de charger les soumissions.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [devoirId]);

    if (loading) return <div>Chargement des soumissions...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Date de soumission</TableHead>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Note</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {soumissions.map(s => (
                    <TableRow key={s.id}>
                        <TableCell>{s.etudiant.first_name} {s.etudiant.last_name}</TableCell>
                        <TableCell>{new Date(s.date_soumission).toLocaleString()}</TableCell>
                        <TableCell>
                            <a href={`http://localhost:8000/storage/${s.fichier_soumis}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Voir la soumission
                            </a>
                        </TableCell>
                        <TableCell>{s.note ? s.note.note : 'Non noté'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
