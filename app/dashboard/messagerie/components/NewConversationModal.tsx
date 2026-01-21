'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientText } from '@/components/theme/ThemeComponents';
import {
    Users,
    BookOpen,
    MessageSquare,
    X,
    Search,
    Plus,
    User,
    Check
} from 'lucide-react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
    roles: any[];
}

interface Cours {
    id: number;
    titre: string;
    description: string;
}

interface NewConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConversationCreated: (conversation: any) => void;
}

export default function NewConversationModal({ isOpen, onClose, onConversationCreated }: NewConversationModalProps) {
    const [type, setType] = useState<'prive' | 'groupe' | 'matiere'>('prive');
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCours, setSelectedCours] = useState<number | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [cours, setCours] = useState<Cours[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            fetchCours();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const fetchCours = async () => {
        try {
            const response = await axios.get('/api/cours');
            setCours(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des cours:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUserSelection = (userId: number) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                titre,
                description,
                type,
                participants: selectedUsers
            };

            if (type === 'matiere' && selectedCours) {
                payload.cours_id = selectedCours;
            }

            const response = await axios.post('/api/conversations', payload);
            onConversationCreated(response.data);
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la création de la conversation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitre('');
        setDescription('');
        setSelectedCours(null);
        setSelectedUsers([]);
        setSearchTerm('');
        setType('prive');
        setStep(1);
        onClose();
    };

    const canProceed = () => {
        if (step === 1) return titre.trim() !== '';
        if (step === 2) return selectedUsers.length > 0;
        return true;
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'prive': return <Users className="w-5 h-5" />;
            case 'groupe': return <Users className="w-5 h-5" />;
            case 'matiere': return <BookOpen className="w-5 h-5" />;
            default: return <MessageSquare className="w-5 h-5" />;
        }
    };

    const getTypeDescription = (type: string) => {
        switch (type) {
            case 'prive': return 'Conversation privée entre deux personnes';
            case 'groupe': return 'Groupe de discussion avec plusieurs participants';
            case 'matiere': return 'Conversation liée à une matière spécifique';
            default: return '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scaleIn">
                {/* En-tête */}
                <div className="border-b border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            <GradientText from="orange" to="blue">
                                Nouvelle Conversation
                            </GradientText>
                        </h2>
                        <Button variant="outline" size="sm" onClick={handleClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Indicateur d'étapes */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                1
                            </div>
                            <span className="text-sm font-medium">Informations</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 mx-4">
                            <div className={`h-full bg-blue-500 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                2
                            </div>
                            <span className="text-sm font-medium">Participants</span>
                        </div>
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Type de conversation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Type de conversation
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {(['prive', 'groupe', 'matiere'] as const).map((typeOption) => (
                                        <button
                                            key={typeOption}
                                            type="button"
                                            onClick={() => setType(typeOption)}
                                            className={`p-4 rounded-lg border-2 transition-all ${type === typeOption
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center space-y-2">
                                                {getTypeIcon(typeOption)}
                                                <span className="font-medium capitalize">{typeOption}</span>
                                                <span className="text-xs text-gray-500 text-center">
                                                    {getTypeDescription(typeOption)}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre de la conversation *
                                </label>
                                <input
                                    type="text"
                                    value={titre}
                                    onChange={(e) => setTitre(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Entrez un titre..."
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Entrez une description (optionnel)..."
                                />
                            </div>

                            {/* Sélection du cours (si type = matière) */}
                            {type === 'matiere' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Matière *
                                    </label>
                                    <select
                                        value={selectedCours || ''}
                                        onChange={(e) => setSelectedCours(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionnez une matière</option>
                                        {cours.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.titre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Recherche d'utilisateurs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ajouter des participants
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Rechercher des utilisateurs..."
                                    />
                                </div>
                            </div>

                            {/* Liste des utilisateurs */}
                            <div className="max-h-64 overflow-y-auto">
                                <div className="space-y-2">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            onClick={() => toggleUserSelection(user.id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedUsers.includes(user.id)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                                {selectedUsers.includes(user.id) && (
                                                    <Check className="w-5 h-5 text-blue-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Participants sélectionnés */}
                            {selectedUsers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Participants sélectionnés ({selectedUsers.length})
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((userId) => {
                                            const user = users.find(u => u.id === userId);
                                            return user ? (
                                                <span
                                                    key={userId}
                                                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                                                >
                                                    {user.name}
                                                    <button
                                                        onClick={() => toggleUserSelection(userId)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pied de page */}
                <div className="border-t border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            {step === 2 && (
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Retour
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" onClick={handleClose}>
                                Annuler
                            </Button>
                            {step === 1 ? (
                                <Button
                                    variant="blue"
                                    onClick={() => setStep(2)}
                                    disabled={!canProceed()}
                                >
                                    Suivant
                                </Button>
                            ) : (
                                <Button
                                    variant="green"
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || loading}
                                >
                                    {loading ? 'Création...' : 'Créer la conversation'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
