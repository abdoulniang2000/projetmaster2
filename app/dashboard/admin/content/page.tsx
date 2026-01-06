'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Trash2, Search, Filter, AlertTriangle, CheckCircle, MessageSquare, Flag, Clock, X, Save, Download, RefreshCw, BarChart3, FileText, Image, Video, File, Ban, Shield, User, Calendar, TrendingUp, Zap } from 'lucide-react';

interface ContentItem {
    id: number;
    type: 'cours' | 'devoir' | 'message' | 'commentaire' | 'fichier' | 'video' | 'image';
    titre: string;
    contenu: string;
    auteur: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    };
    statut: 'approuve' | 'en_attente' | 'rejete' | 'signale' | 'archive';
    created_at: string;
    updated_at?: string;
    signalements?: number;
    motif_signalement?: string[];
    priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
    categorie?: string;
    tags?: string[];
    piece_jointe?: {
        nom: string;
        type: string;
        taille: number;
        url: string;
    };
    vue_par?: number;
    moderation_notes?: string;
    moderated_by?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    moderated_at?: string;
}

interface ModerationStats {
    total_contents: number;
    pending_review: number;
    reported_contents: number;
    approved_today: number;
    rejected_today: number;
    average_response_time: number;
    hot_topics: string[];
    trend_data: {
        date: string;
        approved: number;
        rejected: number;
        reported: number;
    }[];
}

interface ModerationRule {
    id: number;
    name: string;
    description: string;
    keywords: string[];
    action: 'flag' | 'auto_reject' | 'auto_approve';
    is_active: boolean;
    created_at: string;
}

function ContentModerationPage() {
    const [contents, setContents] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [selectedContents, setSelectedContents] = useState<number[]>([]);
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [moderationNotes, setModerationNotes] = useState('');
    const [stats, setStats] = useState<ModerationStats>({
        total_contents: 0,
        pending_review: 0,
        reported_contents: 0,
        approved_today: 0,
        rejected_today: 0,
        average_response_time: 0,
        hot_topics: [],
        trend_data: []
    });
    const [autoModerationEnabled, setAutoModerationEnabled] = useState(false);
    const [moderationRules, setModerationRules] = useState<ModerationRule[]>([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [contentRes, statsRes] = await Promise.all([
                    axios.get('/v1/content/moderation'),
                    axios.get('/v1/content/moderation/stats')
                ]);
                setContents(contentRes.data || []);
                setStats(statsRes.data || {
                    total_contents: 0,
                    pending_review: 0,
                    reported_contents: 0,
                    approved_today: 0,
                    rejected_today: 0,
                    average_response_time: 0,
                    hot_topics: [],
                    trend_data: []
                });
            } catch (error) {
                console.error('Erreur lors du chargement des contenus:', error);
                setContents([]);
                setStats({
                    total_contents: 0,
                    pending_review: 0,
                    reported_contents: 0,
                    approved_today: 0,
                    rejected_today: 0,
                    average_response_time: 0,
                    hot_topics: [],
                    trend_data: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const filteredContents = contents.filter(content => {
        const matchesSearch = content.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.auteur.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.auteur.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (content.tags && content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesType = filterType === 'all' || content.type === filterType;
        const matchesStatus = filterStatus === 'all' || content.statut === filterStatus;
        const matchesPriority = filterPriority === 'all' || content.priorite === filterPriority;
        return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });

    const handleApproveContent = async (contentId: number, notes?: string) => {
        try {
            await axios.put(`/v1/content/${contentId}/moderate`, {
                statut: 'approuve',
                moderation_notes: notes || moderationNotes
            });
            const [contentRes, statsRes] = await Promise.all([
                axios.get('/v1/content/moderation'),
                axios.get('/v1/content/moderation/stats')
            ]);
            setContents(contentRes.data || []);
            setStats(statsRes.data || stats);
            setModerationNotes('');
            setShowViewModal(false);
        } catch (error) {
            console.error('Erreur lors de l\'approbation:', error);
        }
    };

    const handleRejectContent = async (contentId: number, notes?: string) => {
        try {
            await axios.put(`/v1/content/${contentId}/moderate`, {
                statut: 'rejete',
                moderation_notes: notes || moderationNotes
            });
            const [contentRes, statsRes] = await Promise.all([
                axios.get('/v1/content/moderation'),
                axios.get('/v1/content/moderation/stats')
            ]);
            setContents(contentRes.data || []);
            setStats(statsRes.data || stats);
            setModerationNotes('');
            setShowViewModal(false);
        } catch (error) {
            console.error('Erreur lors du rejet:', error);
        }
    };

    const handleArchiveContent = async (contentId: number) => {
        try {
            await axios.put(`/v1/content/${contentId}/moderate`, { statut: 'archive' });
            const response = await axios.get('/v1/content/moderation');
            setContents(response.data || []);
        } catch (error) {
            console.error('Erreur lors de l\'archivage:', error);
        }
    };

    const handleBulkAction = async (action: 'approve' | 'reject' | 'archive') => {
        if (selectedContents.length === 0) return;

        try {
            await axios.post('/v1/content/bulk-moderate', {
                content_ids: selectedContents,
                action,
                moderation_notes: moderationNotes
            });
            setSelectedContents([]);
            setShowBulkActions(false);
            setModerationNotes('');
            const response = await axios.get('/v1/content/moderation');
            setContents(response.data || []);
        } catch (error) {
            console.error('Erreur lors de l\'action groupée:', error);
        }
    };

    const handleAutoModerationToggle = async () => {
        try {
            await axios.put('/v1/content/auto-moderation', { enabled: !autoModerationEnabled });
            setAutoModerationEnabled(!autoModerationEnabled);
        } catch (error) {
            console.error('Erreur lors de la modification de la modération automatique:', error);
        }
    };

    const exportReport = async () => {
        try {
            const response = await axios.get('/v1/content/export-report', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'moderation_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors de l\'export du rapport:', error);
        }
    };

    const handleSelectContent = (contentId: number) => {
        setSelectedContents(prev =>
            prev.includes(contentId)
                ? prev.filter(id => id !== contentId)
                : [...prev, contentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedContents.length === filteredContents.length) {
            setSelectedContents([]);
        } else {
            setSelectedContents(filteredContents.map(c => c.id));
        }
    };

    const handleDeleteContent = async (contentId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
            try {
                await axios.delete(`/v1/content/${contentId}`);
                const response = await axios.get('/v1/content/moderation');
                setContents(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'approuve':
                return 'bg-green-100 text-green-800';
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejete':
                return 'bg-red-100 text-red-800';
            case 'signale':
                return 'bg-orange-100 text-orange-800';
            case 'archive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityBadgeClass = (priority: string) => {
        switch (priority) {
            case 'urgente':
                return 'bg-red-100 text-red-800';
            case 'haute':
                return 'bg-orange-100 text-orange-800';
            case 'moyenne':
                return 'bg-yellow-100 text-yellow-800';
            case 'basse':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'cours':
                return <FileText className="w-5 h-5 text-blue-600" />;
            case 'devoir':
                return <FileText className="w-5 h-5 text-green-600" />;
            case 'message':
                return <MessageSquare className="w-5 h-5 text-purple-600" />;
            case 'commentaire':
                return <MessageSquare className="w-5 h-5 text-gray-600" />;
            case 'fichier':
                return <File className="w-5 h-5 text-orange-600" />;
            case 'video':
                return <Video className="w-5 h-5 text-red-600" />;
            case 'image':
                return <Image className="w-5 h-5 text-indigo-600" />;
            default:
                return <FileText className="w-5 h-5 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des contenus...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Modération des Contenus
                </h1>
                <p className="text-gray-600 mt-2">Modérez les contenus signalés et en attente de validation</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En attente</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {contents.filter(c => c.statut === 'en_attente').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Signalés</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {contents.filter(c => c.statut === 'signale').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                <Flag className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {contents.filter(c => c.statut === 'approuve').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Rejetés</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {contents.filter(c => c.statut === 'rejete').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-white">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres */}
            <Card className="card-gradient">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un contenu..."
                                className="input-gradient w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="input-gradient pl-10 appearance-none"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">Tous les types</option>
                                <option value="cours">Cours</option>
                                <option value="devoir">Devoirs</option>
                                <option value="message">Messages</option>
                                <option value="commentaire">Commentaires</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="input-gradient pl-10 appearance-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="en_attente">En attente</option>
                                <option value="approuve">Approuvés</option>
                                <option value="rejete">Rejetés</option>
                                <option value="signale">Signalés</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des contenus */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle>Contenus à modérer ({filteredContents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredContents.map((content) => (
                            <div key={content.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getTypeIcon(content.type)}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{content.titre}</h3>
                                            <p className="text-sm text-gray-600">
                                                Par {content.auteur.first_name} {content.auteur.last_name} ({content.auteur.email})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(content.statut)}`}>
                                            {content.statut.replace('_', ' ')}
                                        </span>
                                        {content.signalements && content.signalements > 0 && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {content.signalements} signalements
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm line-clamp-3">{content.contenu}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        <p>Créé le: {new Date(content.created_at).toLocaleDateString('fr-FR')}</p>
                                        {content.updated_at && (
                                            <p>Modifié le: {new Date(content.updated_at).toLocaleDateString('fr-FR')}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {content.statut === 'en_attente' && (
                                            <>
                                                <button
                                                    onClick={() => handleApproveContent(content.id)}
                                                    className="btn-gradient-green text-sm px-3 py-1"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Approuver
                                                </button>
                                                <button
                                                    onClick={() => handleRejectContent(content.id)}
                                                    className="btn-gradient-red text-sm px-3 py-1"
                                                >
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    Rejeter
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDeleteContent(content.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredContents.length === 0 && (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                                    ? 'Aucun contenu trouvé pour ces filtres'
                                    : 'Aucun contenu à modérer'
                                }
                            </h3>
                            <p className="text-gray-600">
                                Tous les contenus sont à jour !
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(ContentModerationPage);
