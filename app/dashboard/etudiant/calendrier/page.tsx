'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Bell, BookOpen, AlertCircle, CheckCircle, Plus, Filter, Search, User, MapPin, Video } from 'lucide-react';

interface Evenement {
    id: number;
    titre: string;
    description: string;
    type: 'cours' | 'devoir' | 'examen' | 'reunion' | 'webinaire';
    date: string;
    heure_debut: string;
    heure_fin: string;
    lieu?: string;
    lien?: string;
    cours_nom?: string;
    instructeur?: string;
    statut: 'a_venir' | 'en_cours' | 'termine' | 'annule';
    rappel: boolean;
    priorite: 'basse' | 'moyenne' | 'haute';
}

function CalendrierPage() {
    const [evenements, setEvenements] = useState<Evenement[]>([]);
    const [filteredEvenements, setFilteredEvenements] = useState<Evenement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('tous');
    const [selectedStatus, setSelectedStatus] = useState('tous');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState<'mois' | 'semaine' | 'jour'>('mois');
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);

    useEffect(() => {
        const fetchEvenements = async () => {
            try {
                const response = await axios.get('/v1/evenements');
                const evenementsData = response.data.map((e: any, index: number) => {
                    const types: ('cours' | 'devoir' | 'examen' | 'reunion' | 'webinaire')[] = ['cours', 'devoir', 'examen', 'reunion', 'webinaire'];
                    const statuts: ('a_venir' | 'en_cours' | 'termine' | 'annule')[] = ['a_venir', 'en_cours', 'termine', 'annule'];
                    const priorites: ('basse' | 'moyenne' | 'haute')[] = ['basse', 'moyenne', 'haute'];

                    const eventDate = new Date();
                    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 60) - 30);

                    return {
                        ...e,
                        type: types[index % types.length],
                        statut: statuts[Math.floor(Math.random() * statuts.length)],
                        priorite: priorites[Math.floor(Math.random() * priorites.length)],
                        date: eventDate.toISOString(),
                        heure_debut: `${Math.floor(Math.random() * 4) + 8}:${Math.random() > 0.5 ? '00' : '30'}`,
                        heure_fin: `${Math.floor(Math.random() * 4) + 13}:${Math.random() > 0.5 ? '00' : '30'}`,
                        lieu: Math.random() > 0.5 ? `Salle ${Math.floor(Math.random() * 20) + 101}` : undefined,
                        lien: Math.random() > 0.5 ? `https://meet.example.com/room-${Math.floor(Math.random() * 1000)}` : undefined,
                        cours_nom: `Cours ${index + 1}`,
                        instructeur: `Prof. ${['Martin', 'Dubois', 'Bernard', 'Petit', 'Durand'][index % 5]}`,
                        rappel: Math.random() > 0.3
                    };
                });
                setEvenements(evenementsData);
                setFilteredEvenements(evenementsData);
            } catch (error) {
                console.error('Erreur lors du chargement des événements:', error);
                setEvenements([]);
                setFilteredEvenements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvenements();
    }, []);

    useEffect(() => {
        let filtered = evenements;

        // Filtrage par recherche
        if (searchTerm) {
            filtered = filtered.filter(e =>
                e.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (e.cours_nom && e.cours_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (e.instructeur && e.instructeur.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filtrage par type
        if (selectedType !== 'tous') {
            filtered = filtered.filter(e => e.type === selectedType);
        }

        // Filtrage par statut
        if (selectedStatus !== 'tous') {
            filtered = filtered.filter(e => e.statut === selectedStatus);
        }

        setFilteredEvenements(filtered);
    }, [searchTerm, selectedType, selectedStatus, evenements]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du calendrier...</p>
                </div>
            </div>
        );
    }

    const types = ['tous', 'cours', 'devoir', 'examen', 'reunion', 'webinaire'];
    const statuts = ['tous', 'a_venir', 'en_cours', 'termine', 'annule'];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'cours': return 'text-blue-600 bg-blue-50';
            case 'devoir': return 'text-green-600 bg-green-50';
            case 'examen': return 'text-red-600 bg-red-50';
            case 'reunion': return 'text-purple-600 bg-purple-50';
            case 'webinaire': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'a_venir': return 'text-blue-600 bg-blue-50';
            case 'en_cours': return 'text-green-600 bg-green-50';
            case 'termine': return 'text-gray-600 bg-gray-50';
            case 'annule': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getPriorityColor = (priorite: string) => {
        switch (priorite) {
            case 'haute': return 'text-red-600 bg-red-50';
            case 'moyenne': return 'text-yellow-600 bg-yellow-50';
            case 'basse': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'cours': return <BookOpen className="w-4 h-4" />;
            case 'devoir': return <AlertCircle className="w-4 h-4" />;
            case 'examen': return <CheckCircle className="w-4 h-4" />;
            case 'reunion': return <User className="w-4 h-4" />;
            case 'webinaire': return <Video className="w-4 h-4" />;
            default: return <Calendar className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (time: string) => {
        return time;
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const getEventsForDay = (day: number) => {
        if (!day) return [];

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return filteredEvenements.filter(e => {
            const eventDate = new Date(e.date);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentMonth.getMonth() &&
                eventDate.getFullYear() === currentMonth.getFullYear();
        });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    const monthDays = getDaysInMonth(currentMonth);
    const today = new Date();
    const isToday = (day: number) => {
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear();
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Calendrier Académique
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez votre emploi du temps et ne manquez aucun événement</p>
                </div>
                <button
                    onClick={() => setShowEventModal(true)}
                    className="btn-gradient-blue px-4 py-2 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un événement
                </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Cette semaine</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {filteredEvenements.filter(e => {
                                    const eventDate = new Date(e.date);
                                    const now = new Date();
                                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                                    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                                    return eventDate >= weekStart && eventDate <= weekEnd;
                                }).length}
                            </p>
                        </div>
                        <Calendar className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rappels actifs</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {filteredEvenements.filter(e => e.rappel).length}
                            </p>
                        </div>
                        <Bell className="w-8 h-8 text-yellow-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Priorité haute</p>
                            <p className="text-2xl font-bold text-red-600">
                                {filteredEvenements.filter(e => e.priorite === 'haute').length}
                            </p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </Card>
                <Card className="card-gradient p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En ligne</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {filteredEvenements.filter(e => e.lien).length}
                            </p>
                        </div>
                        <Video className="w-8 h-8 text-purple-500" />
                    </div>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <Card className="card-gradient">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Barre de recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un événement..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtre par type */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>
                                    {type === 'tous' ? 'Tous les types' :
                                        type === 'cours' ? 'Cours' :
                                            type === 'devoir' ? 'Devoirs' :
                                                type === 'examen' ? 'Examens' :
                                                    type === 'reunion' ? 'Réunions' : 'Webinaires'}
                                </option>
                            ))}
                        </select>

                        {/* Filtre par statut */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statuts.map(statut => (
                                <option key={statut} value={statut}>
                                    {statut === 'tous' ? 'Tous les statuts' :
                                        statut === 'a_venir' ? 'À venir' :
                                            statut === 'en_cours' ? 'En cours' :
                                                statut === 'termine' ? 'Terminés' : 'Annulés'}
                                </option>
                            ))}
                        </select>

                        {/* Sélecteur de vue */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {(['mois', 'semaine', 'jour'] as const).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === mode
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {mode === 'mois' ? 'Mois' : mode === 'semaine' ? 'Semaine' : 'Jour'}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendrier */}
            {viewMode === 'mois' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigateMonth('prev')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    ←
                                </button>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </h2>
                                <button
                                    onClick={() => navigateMonth('next')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    →
                                </button>
                            </div>
                            <button
                                onClick={() => setCurrentMonth(new Date())}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Aujourd'hui
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Jours de la semaine */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Jours du mois */}
                        <div className="grid grid-cols-7 gap-2">
                            {monthDays.map((day, index) => {
                                const dayEvents = getEventsForDay(day);
                                const isCurrentDay = isToday(day);

                                return (
                                    <div
                                        key={index}
                                        className={`min-h-24 border rounded-lg p-2 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                                            } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        {day && (
                                            <>
                                                <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                                                    }`}>
                                                    {day}
                                                </div>
                                                <div className="space-y-1">
                                                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                                        <div
                                                            key={eventIndex}
                                                            className={`text-xs p-1 rounded truncate cursor-pointer ${getTypeColor(event.type)}`}
                                                            onClick={() => setSelectedEvent(event)}
                                                        >
                                                            {event.heure_debut} {event.titre}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 3 && (
                                                        <div className="text-xs text-gray-500 text-center">
                                                            +{dayEvents.length - 3} plus
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Liste des événements */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span>Événements à venir</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredEvenements
                            .filter(e => e.statut === 'a_venir' || e.statut === 'en_cours')
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .slice(0, 10)
                            .map((event) => (
                                <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(event.type)}`}>
                                        {getTypeIcon(event.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h4 className="font-semibold text-gray-900">{event.titre}</h4>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.statut)}`}>
                                                {event.statut === 'a_venir' ? 'À venir' : 'En cours'}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(event.priorite)}`}>
                                                {event.priorite === 'haute' ? 'Haute' :
                                                    event.priorite === 'moyenne' ? 'Moyenne' : 'Basse'}
                                            </span>
                                            {event.rappel && (
                                                <Bell className="w-4 h-4 text-yellow-500" title="Rappel activé" />
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                <span>{formatDate(event.date)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{formatTime(event.heure_debut)} - {formatTime(event.heure_fin)}</span>
                                            </div>
                                            {event.lieu && (
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span>{event.lieu}</span>
                                                </div>
                                            )}
                                            {event.lien && (
                                                <div className="flex items-center">
                                                    <Video className="w-4 h-4 mr-1" />
                                                    <span className="text-blue-600 hover:underline cursor-pointer">
                                                        Rejoindre la réunion
                                                    </span>
                                                </div>
                                            )}
                                            {event.cours_nom && (
                                                <div className="flex items-center">
                                                    <BookOpen className="w-4 h-4 mr-1" />
                                                    <span>{event.cours_nom}</span>
                                                </div>
                                            )}
                                            {event.instructeur && (
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 mr-1" />
                                                    <span>{event.instructeur}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Modal détails événement */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{selectedEvent.titre}</h3>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Type</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedEvent.type)}`}>
                                    {getTypeIcon(selectedEvent.type)}
                                    <span className="ml-2">{selectedEvent.type}</span>
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-1">Description</p>
                                <p className="text-gray-900">{selectedEvent.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="text-gray-900">{formatDate(selectedEvent.date)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Heure</p>
                                    <p className="text-gray-900">{formatTime(selectedEvent.heure_debut)} - {formatTime(selectedEvent.heure_fin)}</p>
                                </div>
                            </div>

                            {selectedEvent.lieu && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Lieu</p>
                                    <p className="text-gray-900">{selectedEvent.lieu}</p>
                                </div>
                            )}

                            {selectedEvent.lien && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Lien de réunion</p>
                                    <a href={selectedEvent.lien} className="text-blue-600 hover:underline">
                                        Rejoindre la réunion
                                    </a>
                                </div>
                            )}

                            {selectedEvent.cours_nom && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Cours</p>
                                    <p className="text-gray-900">{selectedEvent.cours_nom}</p>
                                </div>
                            )}

                            {selectedEvent.instructeur && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Instructeur</p>
                                    <p className="text-gray-900">{selectedEvent.instructeur}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="btn-gradient-blue px-4 py-2"
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

export default withAuth(CalendrierPage);
