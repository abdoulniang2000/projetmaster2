'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Search, Filter, BookOpen, Calendar, User, Star, MessageCircle, Download, Eye, BarChart3, Target } from 'lucide-react';

interface Note {
    id: number;
    devoir_titre: string;
    cours_nom: string;
    instructeur: string;
    note: number;
    note_max: number;
    appreciation: string;
    feedback: string;
    date_correction: string;
    type: 'devoir' | 'projet' | 'examen';
    ponderation: number;
    statut: 'publie' | 'non_publie';
}

interface Statistiques {
    moyenne_generale: number;
    moyenne_par_cours: { cours: string; moyenne: number }[];
    evolution_notes: { periode: string; note: number }[];
    classement: number;
    total_etudiants: number;
    nombre_notes: number;
    dernier_update: string;
}

function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('tous');
    const [selectedType, setSelectedType] = useState('tous');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notesRes, statsRes] = await Promise.all([
                    axios.get('/v1/notes'),
                    axios.get('/v1/statistiques/etudiant')
                ]);

                const notesData = notesRes.data.map((n: any, index: number) => {
                    const types: ('devoir' | 'projet' | 'examen')[] = ['devoir', 'projet', 'examen'];
                    const appreciations = ['Excellent', 'Très bien', 'Bien', 'Assez bien', 'Passable'];
                    const feedbacks = [
                        'Excellent travail! Votre analyse est pertinente et bien structurée.',
                        'Très bonne présentation, quelques points à améliorer.',
                        'Bon travail dans l\'ensemble, approfondissez certains aspects.',
                        'Correct, mais nécessite plus de rigueur.',
                        'Effort visible, mais la qualité peut être améliorée.'
                    ];

                    return {
                        ...n,
                        type: types[index % types.length],
                        note: Math.floor(Math.random() * 10) + 10,
                        note_max: 20,
                        appreciation: appreciations[Math.floor(Math.random() * appreciations.length)],
                        feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
                        date_correction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                        cours_nom: `Cours ${index + 1}`,
                        instructeur: `Prof. ${['Martin', 'Dubois', 'Bernard', 'Petit', 'Durand'][index % 5]}`,
                        devoir_titre: `Devoir ${index + 1}`,
                        ponderation: Math.random() > 0.5 ? 20 : 30,
                        statut: 'publie'
                    };
                });

                const statsData: Statistiques = {
                    moyenne_generale: notesData.reduce((acc, n) => acc + n.note, 0) / notesData.length,
                    moyenne_par_cours: Array.from(new Set(notesData.map(n => n.cours_nom))).map(cours => ({
                        cours,
                        moyenne: notesData.filter(n => n.cours_nom === cours).reduce((acc, n) => acc + n.note, 0) / notesData.filter(n => n.cours_nom === cours).length
                    })),
                    evolution_notes: [
                        { periode: 'Sept', note: 14 },
                        { periode: 'Oct', note: 15 },
                        { periode: 'Nov', note: 16 },
                        { periode: 'Déc', note: 15.5 },
                        { periode: 'Jan', note: 17 }
                    ],
                    classement: Math.floor(Math.random() * 20) + 1,
                    total_etudiants: Math.floor(Math.random() * 50) + 100,
                    nombre_notes: notesData.length,
                    dernier_update: new Date().toISOString()
                };

                setNotes(notesData);
                setFilteredNotes(notesData);
                setStatistiques(statsData);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setNotes([]);
                setFilteredNotes([]);
                setStatistiques(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = notes.filter(n => n.statut === 'publie');

        // Filtrage par recherche
        if (searchTerm) {
            filtered = filtered.filter(n =>
                n.devoir_titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.cours_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.instructeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.feedback.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrage par cours
        if (selectedCourse !== 'tous') {
            filtered = filtered.filter(n => n.cours_nom === selectedCourse);
        }

        // Filtrage par type
        if (selectedType !== 'tous') {
            filtered = filtered.filter(n => n.type === selectedType);
        }

        setFilteredNotes(filtered);
    }, [searchTerm, selectedCourse, selectedType, notes]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des notes...</p>
                </div>
            </div>
        );
    }

    const courses = ['tous', ...Array.from(new Set(notes.map(n => n.cours_nom)))];
    const types = ['tous', 'devoir', 'projet', 'examen'];

    const getNoteColor = (note: number) => {
        if (note >= 16) return 'text-green-600 bg-green-50';
        if (note >= 14) return 'text-blue-600 bg-blue-50';
        if (note >= 12) return 'text-yellow-600 bg-yellow-50';
        if (note >= 10) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    const getAppreciationColor = (appreciation: string) => {
        switch (appreciation) {
            case 'Excellent': return 'text-green-600 bg-green-50';
            case 'Très bien': return 'text-blue-600 bg-blue-50';
            case 'Bien': return 'text-yellow-600 bg-yellow-50';
            case 'Assez bien': return 'text-orange-600 bg-orange-50';
            default: return 'text-red-600 bg-red-50';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'devoir': return 'text-blue-600 bg-blue-50';
            case 'projet': return 'text-purple-600 bg-purple-50';
            case 'examen': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Notes & Feedback
                </h1>
                <p className="text-gray-600 mt-2">Consultez vos résultats et les feedbacks de vos instructeurs</p>
            </div>

            {/* Statistiques générales */}
            {statistiques && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="card-gradient p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Moyenne générale</p>
                                <p className="text-2xl font-bold text-gray-900">{statistiques.moyenne_generale.toFixed(2)}/20</p>
                            </div>
                            <Award className="w-8 h-8 text-yellow-500" />
                        </div>
                    </Card>
                    <Card className="card-gradient p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Classement</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {statistiques.classement}/{statistiques.total_etudiants}
                                </p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-blue-500" />
                        </div>
                    </Card>
                    <Card className="card-gradient p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Notes reçues</p>
                                <p className="text-2xl font-bold text-green-600">{statistiques.nombre_notes}</p>
                            </div>
                            <Star className="w-8 h-8 text-green-500" />
                        </div>
                    </Card>
                    <Card className="card-gradient p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tendance</p>
                                <p className="text-2xl font-bold text-purple-600">+{((statistiques.evolution_notes[statistiques.evolution_notes.length - 1].note - statistiques.evolution_notes[0].note) / statistiques.evolution_notes[0].note * 100).toFixed(1)}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                    </Card>
                </div>
            )}

            {/* Évolution des notes */}
            {statistiques && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <span>Évolution de vos notes</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-40 px-4">
                            {statistiques.evolution_notes.map((item, index) => (
                                <div key={item.periode} className="flex flex-col items-center flex-1">
                                    <div className="w-full max-w-16 bg-gray-200 rounded-t-lg relative">
                                        <div
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                                            style={{ height: `${(item.note / 20) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 mt-2">{item.periode}</span>
                                    <span className="text-xs font-bold text-gray-900">{item.note}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filtres et recherche */}
            <Card className="card-gradient">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Barre de recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher une note, un cours..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtre par cours */}
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {courses.map(course => (
                                <option key={course} value={course}>
                                    {course === 'tous' ? 'Tous les cours' : course}
                                </option>
                            ))}
                        </select>

                        {/* Filtre par type */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>
                                    {type === 'tous' ? 'Tous les types' :
                                        type === 'devoir' ? 'Devoirs' :
                                            type === 'projet' ? 'Projets' : 'Examens'}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des notes */}
            <div className="space-y-6">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                        <Card key={note.id} className="card-gradient">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{note.devoir_titre}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(note.type)}`}>
                                                {note.type === 'devoir' ? 'Devoir' :
                                                    note.type === 'projet' ? 'Projet' : 'Examen'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAppreciationColor(note.appreciation)}`}>
                                                {note.appreciation}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                                                <span>{note.cours_nom}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1 text-green-500" />
                                                <span>{note.instructeur}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                                                <span>Corrigé le {formatDate(note.date_correction)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Target className="w-4 h-4 mr-1 text-purple-500" />
                                                <span>Pondération: {note.ponderation}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getNoteColor(note.note)}`}>
                                            <div>
                                                <p className="text-2xl font-bold">{note.note}</p>
                                                <p className="text-xs">/{note.note_max}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-start space-x-3">
                                        <MessageCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Feedback de l'instructeur</h4>
                                            <p className="text-gray-700 text-sm leading-relaxed">{note.feedback}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => {
                                            setSelectedNote(note);
                                            setShowFeedbackModal(true);
                                        }}
                                        className="btn-gradient-blue text-sm px-4 py-2 flex items-center"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Voir les détails
                                    </button>
                                    <button className="btn-gray text-sm px-4 py-2 flex items-center">
                                        <Download className="w-4 h-4 mr-2" />
                                        Télécharger le relevé
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune note trouvée</h3>
                        <p className="text-gray-600">Vos notes apparaîtront ici une fois publiées par les instructeurs</p>
                    </div>
                )}
            </div>

            {/* Modal de détails du feedback */}
            {showFeedbackModal && selectedNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                Détails - {selectedNote.devoir_titre}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowFeedbackModal(false);
                                    setSelectedNote(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Informations générales */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Note</p>
                                    <p className={`text-lg font-bold ${getNoteColor(selectedNote.note).split(' ')[0]}`}>
                                        {selectedNote.note}/{selectedNote.note_max}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Appréciation</p>
                                    <p className={`text-lg font-bold ${getAppreciationColor(selectedNote.appreciation).split(' ')[0]}`}>
                                        {selectedNote.appreciation}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Type</p>
                                    <p className="text-lg font-semibold">{selectedNote.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pondération</p>
                                    <p className="text-lg font-semibold">{selectedNote.ponderation}%</p>
                                </div>
                            </div>

                            {/* Feedback détaillé */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                                    Feedback détaillé
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed">{selectedNote.feedback}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3">
                                <button className="btn-gray text-sm px-4 py-2 flex items-center">
                                    <Download className="w-4 h-4 mr-2" />
                                    Exporter en PDF
                                </button>
                                <button
                                    onClick={() => {
                                        setShowFeedbackModal(false);
                                        setSelectedNote(null);
                                    }}
                                    className="btn-gradient-blue text-sm px-4 py-2"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(NotesPage);
