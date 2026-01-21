'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Edit, Trash2, Search, Filter, Shield, Mail, Calendar, MoreVertical, Eye, Ban, CheckCircle, AlertCircle, UserCheck, Key, Clock, Download, Upload, RefreshCw, X, Save, Settings } from 'lucide-react';
import Toast from '@/components/ui/toast';
import { useToast } from '@/hooks/useToast';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    about?: string;
    avatar?: string;
    status: boolean;
    last_login_at?: string;
    last_login_ip?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    role: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    permissions?: string[];
}

interface NewUser {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
}

interface UserActivity {
    id: number;
    user_id: number;
    action: string;
    description: string;
    ip_address: string;
    created_at: string;
}

function UsersManagementPage() {
    const { toasts, success, error, warning, removeToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [newUser, setNewUser] = useState<NewUser>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        role: 'etudiant',
        phone: '',
        address: '',
        city: '',
        country: '',
        postal_code: ''
    });
    const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
    const [isAddingUser, setIsAddingUser] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    axios.get('/v1/users'),
                    axios.get('/v1/roles')
                ]);
                setUsers(usersRes.data || []);
                setRoles(rolesRes.data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setUsers([]);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await axios.put(`/v1/users/${userId}/role`, { role: newRole });
            // Rafraîchir la liste des utilisateurs
            const usersRes = await axios.get('/v1/users');
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la modification du rôle:', error);
        }
    };

    const handleToggleActive = async (userId: number, isActive: boolean) => {
        try {
            await axios.put(`/v1/users/${userId}/status`, { is_active: isActive });
            // Rafraîchir la liste des utilisateurs
            const usersRes = await axios.get('/v1/users');
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la modification du statut:', error);
        }
    };

    const handleAddUser = async () => {
        try {
            // Validation basique
            if (!newUser.first_name || !newUser.last_name || !newUser.username || !newUser.email || !newUser.password || !newUser.role) {
                warning('Veuillez remplir tous les champs obligatoires');
                return;
            }

            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newUser.email)) {
                warning('Veuillez entrer une adresse email valide');
                return;
            }

            if (newUser.password.length < 6) {
                warning('Le mot de passe doit contenir au moins 6 caractères');
                return;
            }

            setIsAddingUser(true);

            const response = await axios.post('/v1/users', newUser);

            // Succès
            success('Utilisateur ajouté avec succès!');
            setShowAddModal(false);

            // Réinitialiser le formulaire
            setNewUser({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                role: 'etudiant',
                phone: '',
                address: '',
                city: '',
                country: '',
                postal_code: ''
            });

            // Rafraîchir la liste
            const usersRes = await axios.get('/v1/users');
            setUsers(usersRes.data || []);

        } catch (err: any) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);

            // Afficher les détails de l'erreur pour le debugging
            if (err.code === 'ERR_NETWORK') {
                error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
            } else if (err.code === 'ECONNREFUSED') {
                error('Connexion refusée. Le serveur backend est probablement arrêté.');
            } else if (err.response?.status === 422) {
                // Erreur de validation
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat().join(', ');
                error('Erreur de validation: ' + errorMessage);
            } else if (err.response?.status === 409) {
                // Email déjà existant
                error('Cet email est déjà utilisé par un autre utilisateur');
            } else if (err.response?.status === 403) {
                // Permission refusée
                error('Vous n\'avez pas les permissions pour ajouter un utilisateur');
            } else if (err.response?.status === 500) {
                // Erreur serveur
                error('Erreur serveur interne. Vérifiez les logs Laravel.');
            } else {
                // Erreur générique avec plus de détails
                const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
                error('Une erreur est survenue: ' + errorMessage);
            }
        } finally {
            setIsAddingUser(false);
        }
    };

    const handleEditUser = async (userData: Partial<User>) => {
        if (!selectedUser) return;
        try {
            await axios.put(`/v1/users/${selectedUser.id}`, userData);
            setShowEditModal(false);
            setSelectedUser(null);
            // Rafraîchir la liste
            const usersRes = await axios.get('/v1/users');
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la modification de l\'utilisateur:', error);
        }
    };

    const handleResetPassword = async (userId: number) => {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?')) {
            try {
                await axios.post(`/v1/users/${userId}/reset-password`);
                alert('Un email de réinitialisation a été envoyé à l\'utilisateur');
            } catch (error) {
                console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            }
        }
    };

    const handleValidateUser = async (userId: number) => {
        try {
            await axios.put(`/v1/users/${userId}/validate`);
            // Rafraîchir la liste
            const usersRes = await axios.get('/v1/users');
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
        }
    };

    const handleLockUnlock = async (userId: number, lock: boolean) => {
        try {
            await axios.put(`/v1/users/${userId}/lock`, { locked: lock });
            // Rafraîchir la liste
            const usersRes = await axios.get('/v1/users');
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Erreur lors du verrouillage/déverrouillage:', error);
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedUsers.length === 0) return;

        try {
            await axios.post('/v1/users/bulk', { action, user_ids: selectedUsers });
            setSelectedUsers([]);
            setShowBulkActions(false);
            // Rafraîchir la liste
            const usersRes = await axios.get('/v1/users');
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Erreur lors de l\'action groupée:', error);
        }
    };

    const exportUsers = async () => {
        try {
            const response = await axios.get('/v1/users/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    const fetchUserActivity = async (userId: number) => {
        try {
            const response = await axios.get(`/v1/users/${userId}/activity`);
            setUserActivity(response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement de l\'activité:', error);
        }
    };

    const handleSelectUser = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    const getRoleBadgeClass = (roleName: string) => {
        switch (roleName) {
            case 'admin':
                return 'bg-orange-100 text-orange-800';
            case 'enseignant':
                return 'bg-blue-100 text-blue-800';
            case 'etudiant':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des utilisateurs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez les comptes utilisateurs et leurs rôles</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={exportUsers}
                        className="btn-gradient-secondary flex items-center space-x-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>Exporter</span>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-gradient-primary flex items-center space-x-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>Ajouter un utilisateur</span>
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total utilisateurs</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Admins</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                <Shield className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Enseignants</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {users.filter(u => u.role === 'enseignant').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Étudiants</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {users.filter(u => u.role === 'etudiant').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En attente</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {users.filter(u => !u.email_verified_at).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <Card className="card-gradient">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur..."
                                className="input-gradient w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="input-gradient pl-10 appearance-none"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">Tous les rôles</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        {selectedUsers.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                    {selectedUsers.length} sélectionné(s)
                                </span>
                                <button
                                    onClick={() => setShowBulkActions(!showBulkActions)}
                                    className="btn-gradient-secondary flex items-center space-x-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Actions groupées</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {showBulkActions && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleBulkAction('activate')}
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                    Activer
                                </button>
                                <button
                                    onClick={() => handleBulkAction('deactivate')}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    Désactiver
                                </button>
                                <button
                                    onClick={() => handleBulkAction('validate')}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    Valider
                                </button>
                                <button
                                    onClick={() => handleBulkAction('delete')}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tableau des utilisateurs */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === filteredUsers.length}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Utilisateur</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rôle</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Validation</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Dernière connexion</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {user.first_name[0]}{user.last_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ID: {user.id} | @{user.username}
                                                    </p>
                                                    {user.city && (
                                                        <p className="text-xs text-gray-400">{user.city}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={user.status}
                                                        onChange={(e) => handleToggleActive(user.id, e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                                <span className="text-sm font-medium">
                                                    {user.status ? 'Actif' : 'Inactif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.email_verified_at ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Vérifié
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    Non vérifié
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('fr-FR') : 'Jamais'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowViewModal(true);
                                                        fetchUserActivity(user.id);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Voir les détails"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(user.id)}
                                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    title="Réinitialiser le mot de passe"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                                                            axios.delete(`/v1/users/${user.id}`).then(async () => {
                                                                const usersRes = await axios.get('/v1/users');
                                                                setUsers(usersRes.data || []);
                                                            });
                                                        }
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal Ajout Utilisateur */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Ajouter un utilisateur</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddUser();
                        }} className="space-y-6">
                            {/* Informations de base */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prénom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-gradient w-full px-4 py-3"
                                        placeholder="Entrez le prénom"
                                        value={newUser.first_name}
                                        onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-gradient w-full px-4 py-3"
                                        placeholder="Entrez le nom"
                                        value={newUser.last_name}
                                        onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom d'utilisateur <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    placeholder="Entrez le nom d'utilisateur"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    placeholder="exemple@email.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mot de passe <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="input-gradient w-full px-4 py-3"
                                    placeholder="Minimum 6 caractères"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rôle <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="">Sélectionner un rôle</option>
                                    <option value="etudiant">Étudiant</option>
                                    <option value="enseignant">Enseignant</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Champs optionnels */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        className="input-gradient w-full px-4 py-3"
                                        placeholder="+221 77 123 45 67"
                                        value={newUser.phone}
                                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        className="input-gradient w-full px-4 py-3"
                                        placeholder="Dakar, Thiès..."
                                        value={newUser.city}
                                        onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Champ Adresse - conditionnel */}
                            {newUser.role === 'etudiant' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        className="input-gradient w-full px-4 py-3"
                                        placeholder="Rue, quartier..."
                                        value={newUser.address}
                                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                    />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAddingUser}
                                    className="btn-gradient-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAddingUser ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Ajout en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            <span>Ajouter l'utilisateur</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails Utilisateur */}
            {showViewModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-scaleIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Détails de l'utilisateur</h3>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedUser.first_name[0]}{selectedUser.last_name[0]}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {selectedUser.first_name} {selectedUser.last_name}
                                    </h4>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(selectedUser.role)}`}
                                        >
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ID Utilisateur</p>
                                    <p className="text-gray-900">{selectedUser.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Nom d'utilisateur</p>
                                    <p className="text-gray-900">@{selectedUser.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                                    <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Ville</p>
                                    <p className="text-gray-900">{selectedUser.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Statut</p>
                                    <p className="text-gray-900">
                                        {selectedUser.status ? 'Actif' : 'Inactif'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email vérifié</p>
                                    <p className="text-gray-900">
                                        {selectedUser.email_verified_at ? 'Oui' : 'Non'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date de création</p>
                                    <p className="text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Dernière connexion</p>
                                    <p className="text-gray-900">
                                        {selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleDateString('fr-FR') : 'Jamais'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Adresse IP</p>
                                    <p className="text-gray-900">{selectedUser.last_login_ip || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Activité récente */}
                            <div>
                                <h5 className="font-medium text-gray-900 mb-3">Activité récente</h5>
                                <div className="space-y-2">
                                    {userActivity.length > 0 ? (
                                        userActivity.slice(0, 10).map((activity) => (
                                            <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                                        <p className="text-xs text-gray-600">{activity.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(activity.created_at).toLocaleDateString('fr-FR')}
                                                        </p>
                                                        <p className="text-xs text-gray-400">{activity.ip_address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="btn-gradient-secondary"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Édition Utilisateur */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md animate-scaleIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Modifier l'utilisateur</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                <input
                                    type="text"
                                    className="input-gradient w-full"
                                    defaultValue={selectedUser.first_name}
                                    id="edit-first-name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    className="input-gradient w-full"
                                    defaultValue={selectedUser.last_name}
                                    id="edit-last-name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="input-gradient w-full"
                                    defaultValue={selectedUser.email}
                                    id="edit-email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    className="input-gradient w-full"
                                    defaultValue={selectedUser.phone || ''}
                                    id="edit-phone"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                <input
                                    type="text"
                                    className="input-gradient w-full"
                                    defaultValue={selectedUser.city || ''}
                                    id="edit-city"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    const firstName = (document.getElementById('edit-first-name') as HTMLInputElement)?.value;
                                    const lastName = (document.getElementById('edit-last-name') as HTMLInputElement)?.value;
                                    const email = (document.getElementById('edit-email') as HTMLInputElement)?.value;
                                    const phone = (document.getElementById('edit-phone') as HTMLInputElement)?.value;
                                    const city = (document.getElementById('edit-city') as HTMLInputElement)?.value;

                                    handleEditUser({
                                        first_name: firstName,
                                        last_name: lastName,
                                        email: email,
                                        phone: phone || undefined,
                                        city: city || undefined
                                    });
                                }}
                                className="btn-gradient-primary"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

export default withAuth(UsersManagementPage);
