'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Edit, Trash2, Search, Filter, Clock, Users, Calendar, Play, X, Save, Eye, BarChart3, Download, Upload, RefreshCw, AlertCircle, CheckCircle, User, Settings, FileText, Target } from 'lucide-react';

interface Module {
    id: number;
    cours_id: number;
    titre: string;
    contenu: string;
    ordre: number;
    created_at: string;
    updated_at: string;
    cours?: {
        id: number;
        nom: string;
        description: string;
        enseignant_id: number;
    };
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
}

interface NewMatiere {
    nom: string;
    module_id: number | '';
    semestre_id: number | '';
}

interface NewSemestre {
    nom: string;
    date_debut: string;
    date_fin: string;
    is_active: boolean;
}

interface ModuleStats {
    total_modules: number;
    total_cours: number;
    total_modules_by_cours: { [key: number]: number };
    average_order: number;
}

function ModulesManagementPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [semestres, setSemestres] = useState<Semestre[]>([]);
    const [enseignants, setEnseignants] = useState<any[]>([]);
    const [cours, setCours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'modules' | 'matieres' | 'semestres'>('modules');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [stats, setStats] = useState<ModuleStats>({
        total_modules: 0,
        total_cours: 0,
        total_modules_by_cours: {},
        average_order: 0
    });
    const [newModule, setNewModule] = useState<NewModule>({
        nom: ''
    });
    const [newMatiere, setNewMatiere] = useState<NewMatiere>({
        nom: '',
        module_id: '',
        semestre_id: ''
    });
    const [newSemestre, setNewSemestre] = useState<NewSemestre>({
        nom: '',
        date_debut: '',
        date_fin: '',
        is_active: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modulesRes, matieresRes, semestresRes, enseignantsRes, coursRes] = await Promise.all([
                    axios.get('/v1/modules'),
                    axios.get('/v1/matieres'),
                    axios.get('/v1/semestres'),
                    axios.get('/v1/users?role=enseignant'),
                    axios.get('/v1/cours') // Fetch courses
                ]);
                setModules(modulesRes.data || []);
                setMatieres(matieresRes.data || []);
                setSemestres(semestresRes.data || []);
                setEnseignants(enseignantsRes.data || []);
                setCours(coursRes.data || []);

                // Calculer les statistiques
                const modulesData = modulesRes.data || [];
                const uniqueCours = new Set(modulesData.map((m: Module) => m.cours_id)).size;
                const totalOrder = modulesData.reduce((acc: number, m: Module) => acc + m.ordre, 0);
                const modulesByCours = modulesData.reduce((acc: any, m: Module) => {
                    acc[m.cours_id] = (acc[m.cours_id] || 0) + 1;
                    return acc;
                }, {});

                setStats({
                    total_modules: modulesData.length,
                    total_cours: uniqueCours,
                    total_modules_by_cours: modulesByCours,
                    average_order: modulesData.length > 0 ? Math.round(totalOrder / modulesData.length) : 0
                });
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setModules([]);
                setMatieres([]);
                setSemestres([]);
                setEnseignants([]);
                setCours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Ajouter un useEffect pour recharger les modules quand l'onglet actif change
    useEffect(() => {
        if (activeTab === 'modules' && !loading) {
            const refreshModules = async () => {
                try {
                    console.log('Rechargement des modules...');
                    const modulesRes = await axios.get('/v1/modules');
                    console.log('Modules rechargés:', modulesRes.data);
                    setModules(modulesRes.data || []);
                } catch (error) {
                    console.error('Erreur lors du rechargement des modules:', error);
                }
            };
            refreshModules();
        }
    }, [activeTab, loading]);

    // Ajouter un useEffect pour recharger les semestres quand l'onglet semestres devient actif
    useEffect(() => {
        if (activeTab === 'semestres' && !loading) {
            const refreshSemestres = async () => {
                try {
                    console.log('Rechargement des semestres...');
                    const semestresRes = await axios.get('/v1/semestres');
                    console.log('Semestres rechargés:', semestresRes.data);
                    setSemestres(semestresRes.data || []);
                } catch (error) {
                    console.error('Erreur lors du rechargement des semestres:', error);
                }
            };
            refreshSemestres();
        }
    }, [activeTab, loading]);

    const filteredModules = modules.filter(module =>
        module.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.contenu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMatieres = matieres.filter(matiere =>
        matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matiere.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSemestres = semestres.filter(semestre =>
        semestre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        semestre.annee_academique.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        console.log('handleAddModule appelé');
        console.log('newModule:', newModule);

        try {
            if (!newModule.nom) {
                console.error('Validation failed: Missing required fields');
                alert('Veuillez entrer un nom de module');
                return;
            }

            console.log('Envoi à l\'API:', newModule);
            const response = await axios.post('/v1/modules', newModule);
            console.log('Réponse API:', response.data);

            // Fermer le modal et réinitialiser le formulaire
            setShowAddModal(false);
            setNewModule({
                nom: ''
            });

            // Rafraîchir immédiatement la liste des modules
            console.log('Rafraîchissement de la liste des modules...');
            const modulesRes = await axios.get('/v1/modules');
            console.log('Modules après rafraîchissement:', modulesRes.data);
            setModules(modulesRes.data || []);

            alert('Module créé avec succès!');
        } catch (error: any) {
            console.error("Erreur lors de l'ajout du module:", error);
            console.error("Détails de l'erreur:", error.response?.data);
            alert('Erreur lors de la création: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleAddMatiere = async () => {
        try {
            if (!newMatiere.nom || !newMatiere.module_id || !newMatiere.semestre_id) {
                console.error('Validation failed: Missing required fields');
                return;
            }

            await axios.post('/v1/matieres', newMatiere);
            setShowAddModal(false);
            setNewMatiere({
                nom: '',
                module_id: '',
                semestre_id: ''
            });
            const matieresRes = await axios.get('/v1/matieres');
            setMatieres(matieresRes.data || []);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la matière:", error);
        }
    };

    const handleAddSemestre = async () => {
        console.log('handleAddSemestre appelé');
        console.log('newSemestre:', newSemestre);

        try {
            if (!newSemestre.nom) {
                console.error('Validation failed: Missing required fields');
                alert('Veuillez entrer un nom de semestre');
                return;
            }

            console.log('Envoi à l\'API semestres:', newSemestre);
            const response = await axios.post('/v1/semestres', newSemestre);
            console.log('Réponse API semestres:', response.data);

            // Fermer le modal et réinitialiser le formulaire
            setShowAddModal(false);
            setNewSemestre({
                nom: '',
                date_debut: '',
                date_fin: '',
                is_active: true
            });

            // Rafraîchir immédiatement la liste des semestres
            console.log('Rafraîchissement de la liste des semestres...');
            const semestresRes = await axios.get('/v1/semestres');
            console.log('Semestres après rafraîchissement:', semestresRes.data);
            setSemestres(semestresRes.data || []);

            alert('Semestre créé avec succès!');
        } catch (error: any) {
            console.error("Erreur lors de l'ajout du semestre:", error);
            console.error("Détails de l'erreur:", error.response?.data);
            alert('Erreur lors de la création: ' + (error.response?.data?.message || error.message));
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
            console.error("Erreur lors de l'export:", error);
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
                                <p className="text-sm font-medium text-gray-600">Total cours</p>
                                <p className="text-2xl font-bold text-green-600">{stats.total_cours}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <BookOpen className="w-6 h-6" />
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
                                <p className="text-sm font-medium text-gray-600">Ordre moyen</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.average_order}</p>
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
                                <p className="text-sm font-medium text-gray-600">Modules/Cours</p>
                                <p className="text-2xl font-bold text-indigo-600">{stats.total_modules > 0 && stats.total_cours > 0 ? Math.round(stats.total_modules / stats.total_cours) : 0}</p>
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Cours ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Ordre</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredModules.map((module) => (
                                        <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{module.titre}</p>
                                                    <p className="text-sm text-gray-600">{module.contenu.substring(0, 50)}...</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{module.cours_id}</td>
                                            <td className="py-3 px-4 text-gray-700">{module.ordre}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteModule(module.id)}
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

            {/* Modal Ajout Module */}
            {showAddModal && activeTab === 'modules' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Ajouter un module</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            console.log('Form submitted');
                            e.preventDefault();
                            console.log('Calling handleAddModule');
                            handleAddModule();
                        }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du module <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    placeholder="Entrez le nom du module"
                                    value={newModule.nom}
                                    onChange={(e) => setNewModule({ ...newModule, nom: e.target.value })}
                                />
                            </div>

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
                                    className="btn-gradient-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Ajouter le module</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Ajout Matière */}
            {showAddModal && activeTab === 'matieres' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Ajouter une matière</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddMatiere();
                        }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de la matière <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    placeholder="Entrez le nom de la matière"
                                    value={newMatiere.nom}
                                    onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Module <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    value={newMatiere.module_id}
                                    onChange={(e) => setNewMatiere({ ...newMatiere, module_id: parseInt(e.target.value) })}
                                >
                                    <option value="">Sélectionner un module</option>
                                    {modules.map((m: any) => (
                                        <option key={m.id} value={m.id}>{m.nom || m.titre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semestre <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    value={newMatiere.semestre_id}
                                    onChange={(e) => setNewMatiere({ ...newMatiere, semestre_id: parseInt(e.target.value) })}
                                >
                                    <option value="">Sélectionner un semestre</option>
                                    {semestres.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.nom}</option>
                                    ))}
                                </select>
                            </div>

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
                                    className="btn-gradient-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Ajouter la matière</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Ajout Semestre */}
            {showAddModal && activeTab === 'semestres' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Ajouter un semestre</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            console.log('Semestre form submitted');
                            e.preventDefault();
                            console.log('Calling handleAddSemestre');
                            handleAddSemestre();
                        }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du semestre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-gradient w-full px-4 py-3"
                                    placeholder="Entrez le nom du semestre"
                                    value={newSemestre.nom}
                                    onChange={(e) => setNewSemestre({ ...newSemestre, nom: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    className="input-gradient w-full px-4 py-3"
                                    value={newSemestre.date_debut}
                                    onChange={(e) => setNewSemestre({ ...newSemestre, date_debut: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    className="input-gradient w-full px-4 py-3"
                                    value={newSemestre.date_fin}
                                    onChange={(e) => setNewSemestre({ ...newSemestre, date_fin: e.target.value })}
                                    min={newSemestre.date_debut}
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={newSemestre.is_active}
                                        onChange={(e) => setNewSemestre({ ...newSemestre, is_active: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Semestre actif
                                    </span>
                                </label>
                            </div>

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
                                    className="btn-gradient-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Ajouter le semestre</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(ModulesManagementPage);