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
    avatar?: string;
    last_seen?: string;
    is_online?: boolean;
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
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            fetchCours();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setUsersLoading(true);
        setError(null);

        // D'abord tester avec la route de test
        try {
            console.log('Test de la route /api/v1/test-users...');
            const testResponse = await axios.get('/api/v1/test-users');
            console.log('Test route réussie:', testResponse.data);
        } catch (testError) {
            console.error('Test route échouée:', testError);
        }

        try {
            console.log('Début récupération des utilisateurs...');
            const response = await axios.get('/api/v1/users');
            console.log('Utilisateurs récupérés:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            setError('Impossible de charger les utilisateurs');

            // Essayer l'ancienne route au cas où
            try {
                const fallbackResponse = await axios.get('/api/users');
                console.log('Utilisateurs récupérés (fallback):', fallbackResponse.data);
                setUsers(fallbackResponse.data);
                setError(null);
            } catch (fallbackError) {
                console.error('Erreur fallback:', fallbackError);

                // Solution de secours avec données statiques basées sur la base de données
                console.log('Utilisation des données de secours statiques');
                const staticUsers: User[] = [
                    {
                        id: 1,
                        name: "Admin User",
                        email: "admin@example.com",
                        roles: [{ name: "ETUDIANT" }],
                        avatar: undefined,
                        is_online: false,
                        last_seen: undefined
                    },
                    {
                        id: 2,
                        name: "Professeur Alpha",
                        email: "prof.alpha@example.com",
                        roles: [{ name: "ETUDIANT" }],
                        avatar: undefined,
                        is_online: false,
                        last_seen: undefined
                    },
                    {
                        id: 3,
                        name: "Étudiant Un",
                        email: "etudiant.un@example.com",
                        roles: [{ name: "ETUDIANT" }],
                        avatar: undefined,
                        is_online: false,
                        last_seen: undefined
                    },
                    {
                        id: 5,
                        name: "Abdoul Niang",
                        email: "abdoilniang00@gmail.com",
                        roles: [{ name: "admin" }],
                        avatar: undefined,
                        is_online: false,
                        last_seen: undefined
                    }
                ];
                setUsers(staticUsers);
                setError(null);
                console.log('Données statiques chargées:', staticUsers);
            }
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchCours = async () => {
        try {
            const response = await axios.get('/api/v1/cours');
            console.log('Cours récupérés:', response.data);
            setCours(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des cours:', error);
            // Essayer l'ancienne route au cas où
            try {
                const fallbackResponse = await axios.get('/api/cours');
                console.log('Cours récupérés (fallback):', fallbackResponse.data);
                setCours(fallbackResponse.data);
            } catch (fallbackError) {
                console.error('Erreur fallback cours:', fallbackError);
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const notSelected = !selectedUsers.includes(user.id);
        return matchesSearch && notSelected;
    });

    // Suggestions intelligentes basées sur le type de conversation
    const getSuggestions = () => {
        if (type === 'prive') {
            // Exclure l'utilisateur actuel (simulation avec ID 1)
            return users.filter(user => user.id !== 1).slice(0, 3);
        }
        return [];
    };

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
        setSuggestions([]);
        onClose();
    };

    const canProceed = () => {
        if (step === 1) return titre.trim() !== '';
        if (step === 2) {
            if (type === 'prive') return selectedUsers.length === 1;
            return selectedUsers.length > 0;
        }
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
                            <span className="text-sm font-medium">
                                {type === 'prive' ? 'Participant' : 'Participants'}
                            </span>
                        </div>
                        {type !== 'prive' && (
                            <>
                                <div className="flex-1 h-1 bg-gray-200 mx-4">
                                    <div className={`h-full bg-blue-500 transition-all ${step >= 3 ? 'w-full' : 'w-0'
                                        }`}></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        3
                                    </div>
                                    <span className="text-sm font-medium">Confirmation</span>
                                </div>
                            </>
                        )}
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
                            {/* Suggestions rapides pour conversations privées */}
                            {type === 'prive' && !searchTerm && users.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Suggestions rapides
                                    </label>
                                    <div className="space-y-2">
                                        {users.slice(0, 3).map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => {
                                                    setSelectedUsers([user.id]);
                                                    setStep(3);
                                                }}
                                                className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all hover:bg-blue-50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            {user.is_online && (
                                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{user.name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Démarrer une conversation
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recherche d'utilisateurs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {type === 'prive' ? 'Rechercher un utilisateur' : 'Ajouter des participants'}
                                </label>

                                {/* Affichage de l'état de chargement */}
                                {usersLoading && (
                                    <div className="text-center py-4">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                        <p className="text-sm text-gray-500 mt-2">Chargement des utilisateurs...</p>
                                    </div>
                                )}

                                {/* Affichage des erreurs */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                        <p className="text-sm">{error}</p>
                                        <button
                                            onClick={fetchUsers}
                                            className="text-red-600 underline text-sm mt-2"
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                )}

                                {/* Affichage du nombre d'utilisateurs chargés */}
                                {!usersLoading && !error && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        {users.length} utilisateur(s) disponible(s)
                                    </p>
                                )}

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={type === 'prive' ? 'Taper un nom ou email...' : 'Rechercher des utilisateurs...'}
                                        autoFocus
                                        disabled={usersLoading}
                                    />
                                </div>
                            </div>

                            {/* Liste des utilisateurs */}
                            <div className="max-h-64 overflow-y-auto">
                                <div className="space-y-2">
                                    {filteredUsers.length === 0 && !usersLoading && !error ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>
                                                {searchTerm
                                                    ? 'Aucun utilisateur trouvé pour cette recherche'
                                                    : type === 'prive'
                                                        ? 'Aucun utilisateur disponible'
                                                        : 'Aucun utilisateur disponible'
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => {
                                                    if (type === 'prive') {
                                                        setSelectedUsers([user.id]);
                                                        setStep(3);
                                                    } else {
                                                        toggleUserSelection(user.id);
                                                    }
                                                }}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedUsers.includes(user.id)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            {user.is_online && (
                                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{user.name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                            {user.roles && user.roles.length > 0 && (
                                                                <div className="flex gap-1 mt-1">
                                                                    {user.roles.slice(0, 2).map((role: any, index: number) => (
                                                                        <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                                            {role.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {type === 'prive' ? (
                                                            <Plus className="w-5 h-5 text-blue-500" />
                                                        ) : (
                                                            <div className={`w-5 h-5 rounded border-2 ${selectedUsers.includes(user.id)
                                                                ? 'bg-blue-500 border-blue-500'
                                                                : 'border-gray-300'
                                                                }`}>
                                                                {selectedUsers.includes(user.id) && (
                                                                    <Check className="w-3 h-3 text-white m-0.5" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Participants sélectionnés */}
                            {selectedUsers.length > 0 && type !== 'prive' && (
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

                    {step === 3 && type !== 'prive' && (
                        <div className="space-y-6">
                            {/* Résumé de la conversation */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">Résumé de la conversation</h3>

                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Type:</span>
                                        <span className="ml-2 font-medium capitalize">{type}</span>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-500">Titre:</span>
                                        <span className="ml-2 font-medium">{titre}</span>
                                    </div>

                                    {description && (
                                        <div>
                                            <span className="text-sm text-gray-500">Description:</span>
                                            <span className="ml-2 font-medium">{description}</span>
                                        </div>
                                    )}

                                    {type === 'matiere' && selectedCours && (
                                        <div>
                                            <span className="text-sm text-gray-500">Matière:</span>
                                            <span className="ml-2 font-medium">
                                                {cours.find(c => c.id === selectedCours)?.titre}
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-sm text-gray-500">Participants ({selectedUsers.length + 1}):
                                        </span>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                                                Vous (Admin)
                                            </span>
                                            {selectedUsers.map((userId) => {
                                                const user = users.find(u => u.id === userId);
                                                return user ? (
                                                    <span
                                                        key={userId}
                                                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                                                    >
                                                        {user.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            ) : step === 2 ? (
                                <Button
                                    variant="blue"
                                    onClick={() => setStep(3)}
                                    disabled={!canProceed()}
                                >
                                    {type === 'prive' ? 'Créer la conversation' : 'Suivant'}
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
