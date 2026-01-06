'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Note {
    id: number;
    valeur: number;
    commentaire?: string;
    devoir: {
        titre: string;
        cours: {
            nom: string;
        };
    };
    created_at: string;
}

export default function NotesList() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Note: L'API pour les notes d'un étudiant spécifique n'existe pas encore
        // On simule avec les données de soumissions pour l'instant
        const fetchNotes = async () => {
            try {
                // Cette endpoint devra être créé dans le backend
                const response = await axios.get('/v1/notes');
                setNotes(response.data);
            } catch (error) {
                // En attendant l'API, on affiche un message
                setError('Les notes seront bientôt disponibles.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    if (loading) return <div>Chargement des notes...</div>;
    if (error) return <div className="text-yellow-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.length > 0 ? notes.map(note => (
                    <Card key={note.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{note.devoir.titre}</span>
                                <span className={`text-2xl font-bold ${note.valeur >= 10 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {note.valeur}/20
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                                Cours: {note.devoir.cours.nom}
                            </p>
                            {note.commentaire && (
                                <p className="text-sm mb-2">
                                    <strong>Commentaire:</strong> {note.commentaire}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Noté le: {new Date(note.created_at).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>
                )) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">Aucune note disponible pour le moment.</p>
                    </div>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Résumé des notes</CardTitle>
                </CardHeader>
                <CardContent>
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {(notes.reduce((sum, note) => sum + note.valeur, 0) / notes.length).toFixed(2)}
                                </div>
                                <p className="text-sm text-muted-foreground">Moyenne générale</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {Math.max(...notes.map(n => n.valeur))}
                                </div>
                                <p className="text-sm text-muted-foreground">Meilleure note</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {Math.min(...notes.map(n => n.valeur))}
                                </div>
                                <p className="text-sm text-muted-foreground">Note la plus basse</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">
                            Les statistiques seront disponibles dès que vous aurez des notes.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
