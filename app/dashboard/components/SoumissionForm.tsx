'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SoumissionFormProps {
    devoirId: number;
    onSoumissionReussie: () => void; // Callback pour rafraîchir les données
}

export default function SoumissionForm({ devoirId, onSoumissionReussie }: SoumissionFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Veuillez sélectionner un fichier.');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('fichier_soumis', file);

        try {
            await axios.post(`/devoirs/${devoirId}/soumissions`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Devoir soumis avec succès !');
            onSoumissionReussie();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la soumission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fichier_soumis">Votre fichier</Label>
                <Input id="fichier_soumis" type="file" onChange={handleFileChange} required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre le devoir'}
            </Button>
        </form>
    );
}
