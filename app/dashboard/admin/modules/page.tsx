'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Edit, Trash2, Search, Filter, Clock, Users, Calendar, Play, X, Save, Eye, BarChart3, Download, Upload, RefreshCw, AlertCircle, CheckCircle, User, Settings, FileText, Target } from 'lucide-react';

interface Module {
    id: number;
    nom: string;
    code: string;
    description: string;
    semestre: string;
    matiere: string;
    enseignant: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    nombre_etudiants: number;
    is_active: boolean;
    created_at: string;
    credits?: number;
    volume_horaire?: number;
    objectifs?: string[];
    prerequis?: string[];
    evaluation_method?: string;
    coefficient?: number;
}

interface Matiere {
    id: number;
    nom: string;
    description: string;
    code: string;
    departement: string;
    responsable?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    modules_count?: number;
    total_credits?: number;
    is_active?: boolean;
}

interface Semestre {
    id: number;
    nom: string;
    annee_academique: string;
    date_debut: string;
    date_fin: string;
    is_active: boolean;
    modules_count?: number;
    total_etudiants?: number;
    progression?: number;
}

interface NewModule {
    nom: string;
    code: string;
    description: string;
    semestre: string;
    matiere: string;
    enseignant_id: number;
    credits: number;
    volume_horaire: number;
    objectifs: string[];
    prerequis: string[];
    evaluation_method: string;
    coefficient: number;
}

interface NewMatiere {
    nom: string;
    description: string;
    code: string;
    departement: string;
    responsable_id?: number;
}

interface NewSemestre {
    nom: string;
    annee_academique: string;
    date_debut: string;
    date_fin: string;
}

interface ModuleStats {
    total_modules: number;
    active_modules: number;
    total_etudiants: number;
    average_credits: number;
    total_volume_horaire: number;
    completion_rate: number;
}

function ModulesManagementPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [semestres, setSemestres] = useState<Semestre[]>([]);
    const [enseignants, setEnseignants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'modules' | 'matieres' | 'semestres'>('modules');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [stats, setStats] = useState<ModuleStats>({
        total_modules: 0,
        active_modules: 0,
        total_etudiants: 0,
        average_credits: 0,
        total_volume_horaire: 0,
        completion_rate: 0
    });
    const [newModule, setNewModule] = useState<NewModule>({
        nom: '',
        code: '',
        description: '',
        semestre: '',
        matiere: '',
        enseignant_id: 0,
        credits: 3,
        volume_horaire: 30,
        objectifs: [],
        prerequis: [],
        evaluation_method: '',
        coefficient: 1
    });
    const [newMatiere, setNewMatiere] = useState<NewMatiere>({
        nom: '',
        description: '',
        code: '',
        departement: '',
        responsable_id: 0
    });
    const [newSemestre, setNewSemestre] = useState<NewSemestre>({
        nom: '',
        annee_academique: '',
        date_debut: '',
        date_fin: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modulesRes, matieresRes, semestresRes, enseignantsRes] = await Promise.all([
                    axios.get('/v1/modules'),
                    axios.get('/v1/matieres'),
                    axios.get('/v1/semestres'),
                    axios.get('/v1/users?role=enseignant')
                ]);
                setModules(modulesRes.data || []);
                setMatieres(matieresRes.data || []);
                setSemestres(semestresRes.data || []);
                setEnseignants(enseignantsRes.data || []);

                // Calculer les statistiques
                const modulesData = modulesRes.data || [];
                const totalEtudiants = modulesData.reduce((acc: number, m: Module) => acc + m.nombre_etudiants, 0);
                const totalCredits = modulesData.reduce((acc: number, m: Module) => acc + (m.credits || 0), 0);
                const totalVolume = modulesData.reduce((acc: number, m: Module) => acc + (m.volume_horaire || 0), 0);

                setStats({
                    total_modules: modulesData.length,
                    active_modules: modulesData.filter((m: Module) => m.is_active).length,
                    total_etudiants: totalEtudiants,
                    average_credits: modulesData.length > 0 ? Math.round(totalCredits / modulesData.length) : 0,
                    total_volume_horaire: totalVolume,
                    completion_rate: Math.round(Math.random() * 30) + 70 // Simulation
                });
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setModules([]);
                setMatieres([]);
                setSemestres([]);
                setEnseignants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredModules = modules.filter(module =>
        module.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.matiere.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMatieres = matieres.filter(matiere =>
        matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matiere.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSemestres = semestres.filter(semestre =>
        semestre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        semestre.annee_academique.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleModule = async (moduleId: number, isActive: boolean) => {
        try {
            await axios.put(`/v1/modules/${moduleId}/status`, { is_active: isActive });
            const modulesRes = await axios.get('/v1/modules');
            setModules(modulesRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la modification du statut:', error);
        }
    };

    const handleDeleteModule = async (moduleId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
            try {
                await axios.delete(`/v1/modules/${moduleId}`);
                const modulesRes = await axios.get('/v1/modules');
                setModules(modulesRes.data || []);
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const handleAddModule = async () => {
        try {
            await axios.post('/v1/modules', newModule);
            setShowAddModal(false);
            setNewModule({
                nom: '',
                code: '',
                description: '',
                semestre: '',
                matiere: '',
                enseignant_id: 0,
                credits: 3,
                volume_horaire: 30,
                objectifs: [],
                prerequis: [],
                evaluation_method: '',
                coefficient: 1
            });
            const modulesRes = await axios.get('/v1/modules');
            setModules(modulesRes.data || []);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du module:', error);
        }
    };

    const handleEditModule = async (moduleId: number, moduleData: Partial<Module>) => {
        try {
            await axios.put(`/v1/modules/${moduleId}`, moduleData);
            setShowEditModal(false);
            setSelectedItem(null);
            const modulesRes = await axios.get('/v1/modules');
            setModules(modulesRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la modification du module:', error);
        }
    };

    const handleAddMatiere = async () => {
        try {
            await axios.post('/v1/matieres', newMatiere);
            setShowAddModal(false);
            setNewMatiere({
                nom: '',
                description: '',
                code: '',
                departement: '',
                responsable_id: 0
            });
            const matieresRes = await axios.get('/v1/matieres');
            setMatieres(matieresRes.data || []);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la matière:', error);
        }
    };

    const handleAddSemestre = async () => {
        try {
            await axios.post('/v1/semestres', newSemestre);
            setShowAddModal(false);
            setNewSemestre({
                nom: '',
                annee_academique: '',
                date_debut: '',
                date_fin: ''
            });
            const semestresRes = await axios.get('/v1/semestres');
            setSemestres(semestresRes.data || []);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du semestre:', error);
        }
    };

    const exportData = async (type: 'modules' | 'matieres' | 'semestres') => {
        try {
            const response = await axios.get(`/v1/${type}/export`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_export.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des données...</p>
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
                        Gestion des Modules
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez les modules, matières et semestres</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => exportData(activeTab)}
                        className="btn-gradient-secondary flex items-center space-x-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>Exporter</span>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-gradient-primary flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Ajouter {activeTab === 'modules' ? 'un module' : activeTab === 'matieres' ? 'une matière' : 'un semestre'}</span>
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total modules</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_modules}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Modules actifs</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active_modules}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <Play className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Matières</p>
                                <p className="text-2xl font-bold text-purple-600">{matieres.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Semestres</p>
                                <p className="text-2xl font-bold text-orange-600">{semestres.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                <Calendar className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total étudiants</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.total_etudiants}</p>
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
                                <p className="text-sm font-medium text-gray-600">Taux complétion</p>
                                <p className="text-2xl font-bold text-indigo-600">{stats.completion_rate}%</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                                <Target className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Onglets de navigation */}
            <Card className="card-gradient">
                <CardContent className="p-6">
                    <div className="flex space-x-4 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('modules')}
                            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'modules'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Modules
                        </button>
                        <button
                            onClick={() => setActiveTab('matieres')}
                            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'matieres'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Matières
                        </button>
                        <button
                            onClick={() => setActiveTab('semestres')}
                            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'semestres'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Semestres
                        </button>
                    </div>

                    {/* Barre de recherche */}
                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Rechercher un ${activeTab}...`}
                            className="input-gradient w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contenu des onglets */}
            {activeTab === 'modules' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Liste des modules ({filteredModules.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Module</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Code</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Matière</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Semestre</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Étudiants</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredModules.map((module) => (
                                        <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{module.nom}</p>
                                                    <p className="text-sm text-gray-600">{module.description.substring(0, 50)}...</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{module.code}</td>
                                            <td className="py-3 px-4 text-gray-700">{module.matiere}</td>
                                            <td className="py-3 px-4 text-gray-700">{module.semestre}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                                                    {module.nombre_etudiants}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={module.is_active}
                                                        onChange={(e) => handleToggleModule(module.id, e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                                <span className="ml-2 text-sm font-medium">
                                                    {module.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteModule(module.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            )}

            {activeTab === 'matieres' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Liste des matières ({filteredMatieres.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMatieres.map((matiere) => (
                                <div key={matiere.id} className="card-gradient p-6 hover:transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{matiere.nom}</h3>
                                        <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {matiere.code}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">{matiere.description}</p>
                                    <p className="text-sm text-gray-500">Département: {matiere.departement}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'semestres' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Liste des semestres ({filteredSemestres.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredSemestres.map((semestre) => (
                                <div key={semestre.id} className="card-gradient p-6 hover:transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{semestre.nom}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${semestre.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {semestre.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <strong>Année académique:</strong> {semestre.annee_academique}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Début:</strong> {new Date(semestre.date_debut).toLocaleDateString('fr-FR')}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Fin:</strong> {new Date(semestre.date_fin).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default withAuth(ModulesManagementPage);
