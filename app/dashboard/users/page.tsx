'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Edit, Trash2, Search, Filter, MoreVertical } from 'lucide-react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles: { name: string }[];
    created_at: string;
}

function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/v1/users');
                setUsers(response.data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des utilisateurs:', error);
                // Données de démonstration
                setUsers([
                    {
                        id: 1,
                        first_name: 'Admin',
                        last_name: 'User',
                        email: 'admin@example.com',
                        roles: [{ name: 'admin' }],
                        created_at: '2024-01-01T00:00:00Z'
                    },
                    {
                        id: 2,
                        first_name: 'Prof',
                        last_name: 'Alpha',
                        email: 'prof.alpha@example.com',
                        roles: [{ name: 'enseignant' }],
                        created_at: '2024-01-02T00:00:00Z'
                    },
                    {
                        id: 3,
                        first_name: 'Étudiant',
                        last_name: 'Un',
                        email: 'etudiant.un@example.com',
                        roles: [{ name: 'etudiant' }],
                        created_at: '2024-01-03T00:00:00Z'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.roles.some(role => role.name === filterRole);
        return matchesSearch && matchesRole;
    });

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
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez tous les comptes utilisateurs de la plateforme</p>
                </div>
                <button className="btn-gradient-orange flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Ajouter un utilisateur</span>
                </button>
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
                                <option value="admin">Admin</option>
                                <option value="enseignant">Enseignant</option>
                                <option value="etudiant">Étudiant</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total</p>
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
                                    {users.filter(u => u.roles.some(r => r.name === 'admin')).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
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
                                    {users.filter(u => u.roles.some(r => r.name === 'enseignant')).length}
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
                                    {users.filter(u => u.roles.some(r => r.name === 'etudiant')).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Utilisateur</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rôle</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date de création</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {user.first_name[0]}{user.last_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{user.email}</td>
                                        <td className="py-3 px-4">
                                            {user.roles.map((role, index) => (
                                                <span
                                                    key={index}
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-1 ${getRoleBadgeClass(role.name)}`}
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
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
        </div>
    );
}

export default withAuth(UsersPage);
