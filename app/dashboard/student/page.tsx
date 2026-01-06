'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download, Upload, FileText, Calendar, Clock, Bell, Search, Filter, Star, MessageSquare, Users, Play, Eye, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    instructor: {
        first_name: string;
        last_name: string;
        email: string;
    };
    module: string;
    semester: string;
    credits: number;
    progress: number;
    is_active: boolean;
    created_at: string;
    materials: {
        id: number;
        title: string;
        type: 'pdf' | 'video' | 'ppt' | 'document';
        size: number;
        url: string;
        uploaded_at: string;
    }[];
    assignments: {
        id: number;
        title: string;
        description: string;
        due_date: string;
        submitted_at?: string;
        grade?: number;
        status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
    }[];
}

interface Assignment {
    id: number;
    title: string;
    description: string;
    course: {
        title: string;
        instructor: {
            first_name: string;
            last_name: string;
        };
    };
    due_date: string;
    submitted_at?: string;
    grade?: number;
    feedback?: string;
    status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
    attachments?: {
        id: number;
        filename: string;
        size: number;
        url: string;
    }[];
}

interface Grade {
    id: number;
    assignment: {
        title: string;
        course: string;
    };
    grade: number;
    max_grade: number;
    feedback: string;
    graded_at: string;
    instructor: {
        first_name: string;
        last_name: string;
    };
}

interface Notification {
    id: number;
    type: 'course' | 'assignment' | 'grade' | 'deadline' | 'announcement';
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    action_url?: string;
}

function StudentDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'grades' | 'notifications'>('courses');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, assignmentsRes, gradesRes, notificationsRes] = await Promise.all([
                    axios.get('/v1/student/courses'),
                    axios.get('/v1/student/assignments'),
                    axios.get('/v1/student/grades'),
                    axios.get('/v1/student/notifications')
                ]);
                setCourses(coursesRes.data || []);
                setAssignments(assignmentsRes.data || []);
                setGrades(gradesRes.data || []);
                setNotifications(notificationsRes.data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const markNotificationAsRead = async (notificationId: number) => {
        try {
            await axios.put(`/v1/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    };

    const downloadMaterial = async (material: any) => {
        try {
            const response = await axios.get(material.url, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', material.title);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
        }
    };

    const getAssignmentStatusColor = (status: string) => {
        switch (status) {
            case 'graded': return 'bg-green-100 text-green-800';
            case 'submitted': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAssignmentStatusIcon = (status: string) => {
        switch (status) {
            case 'graded': return <CheckCircle className="w-4 h-4" />;
            case 'submitted': return <Upload className="w-4 h-4" />;
            case 'in_progress': return <Clock className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getGradeColor = (grade: number, maxGrade: number) => {
        const percentage = (grade / maxGrade) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-blue-600';
        if (percentage >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Espace Étudiant
                    </h1>
                    <p className="text-gray-600 mt-2">Bienvenue dans votre espace d'apprentissage</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {notifications.filter(n => !n.read).length}
                            </span>
                        )}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        ES
                    </div>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Cours actifs</p>
                                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
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
                                <p className="text-sm font-medium text-gray-600">Devoirs à rendre</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {assignments.filter(a => a.status !== 'submitted' && a.status !== 'graded').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {grades.length > 0 ?
                                        (grades.reduce((acc, g) => acc + (g.grade / g.max_grade * 20), 0) / grades.length).toFixed(1) :
                                        '0'
                                    }/20
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <Star className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Notifications</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {notifications.filter(n => !n.read).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <Bell className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Onglets de navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('courses')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'courses'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    <span>Mes cours</span>
                </button>
                <button
                    onClick={() => setActiveTab('assignments')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'assignments'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>Devoirs</span>
                </button>
                <button
                    onClick={() => setActiveTab('grades')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'grades'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Star className="w-4 h-4" />
                    <span>Notes</span>
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'notifications'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {notifications.filter(n => !n.read).length}
                        </span>
                    )}
                </button>
            </div>

            {/* Barre de recherche pour les cours */}
            {activeTab === 'courses' && (
                <Card className="card-gradient">
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un cours, un module ou un enseignant..."
                                className="input-gradient w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contenu des onglets */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        {filteredCourses.map((course) => (
                            <Card key={course.id} className="card-gradient hover:shadow-lg transition-all cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span>Module: {course.module}</span>
                                                <span>Semestre: {course.semester}</span>
                                                <span>{course.credits} crédits</span>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-600">Progression</span>
                                            <span className="font-medium">{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <p>Prof: {course.instructor.first_name} {course.instructor.last_name}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCourse(course)}
                                            className="btn-gradient-primary text-sm"
                                        >
                                            Voir les détails
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Détails du cours sélectionné */}
                    {selectedCourse && (
                        <Card className="card-gradient">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{selectedCourse.title}</span>
                                    <button
                                        onClick={() => setSelectedCourse(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Supports de cours</h4>
                                        <div className="space-y-2">
                                            {selectedCourse.materials.map((material) => (
                                                <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-8 h-8 rounded flex items-center justify-center ${material.type === 'pdf' ? 'bg-red-100' :
                                                                material.type === 'video' ? 'bg-blue-100' :
                                                                    material.type === 'ppt' ? 'bg-orange-100' :
                                                                        'bg-gray-100'
                                                            }`}>
                                                            {material.type === 'pdf' ? '📄' :
                                                                material.type === 'video' ? '🎥' :
                                                                    material.type === 'ppt' ? '📊' : '📋'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{material.title}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {(material.size / 1024 / 1024).toFixed(2)} MB • {new Date(material.uploaded_at).toLocaleDateString('fr-FR')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => downloadMaterial(material)}
                                                        className="btn-gradient-secondary text-sm"
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Télécharger
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Devoirs du cours</h4>
                                        <div className="space-y-2">
                                            {selectedCourse.assignments.map((assignment) => (
                                                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{assignment.title}</p>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                            <span className="flex items-center space-x-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(assignment.due_date).toLocaleDateString('fr-FR')}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(assignment.status)}`}>
                                                                {getAssignmentStatusIcon(assignment.status)}
                                                                <span className="ml-1">
                                                                    {assignment.status === 'not_started' ? 'Non commencé' :
                                                                        assignment.status === 'in_progress' ? 'En cours' :
                                                                            assignment.status === 'submitted' ? 'Soumis' : 'Noté'}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="btn-gradient-primary text-sm">
                                                        Voir
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {activeTab === 'assignments' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Mes devoirs ({assignments.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {assignments.map((assignment) => (
                                <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(assignment.status)}`}>
                                                    {getAssignmentStatusIcon(assignment.status)}
                                                    <span className="ml-1">
                                                        {assignment.status === 'not_started' ? 'Non commencé' :
                                                            assignment.status === 'in_progress' ? 'En cours' :
                                                                assignment.status === 'submitted' ? 'Soumis' : 'Noté'}
                                                    </span>
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Cours: {assignment.course.title}</span>
                                                <span>Prof: {assignment.course.instructor.first_name} {assignment.course.instructor.last_name}</span>
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    Date limite: {new Date(assignment.due_date).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                            {assignment.grade && (
                                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-green-800">Note: {assignment.grade}/20</span>
                                                        {assignment.feedback && (
                                                            <span className="text-sm text-green-700">Feedback reçu</span>
                                                        )}
                                                    </div>
                                                    {assignment.feedback && (
                                                        <p className="text-sm text-gray-700 mt-2">{assignment.feedback}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                                                <button className="btn-gradient-primary text-sm">
                                                    <Upload className="w-4 h-4 mr-1" />
                                                    Soumettre
                                                </button>
                                            )}
                                            <button className="btn-gradient-secondary text-sm">
                                                <Eye className="w-4 h-4 mr-1" />
                                                Détails
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'grades' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Mes notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {grades.map((grade) => (
                                <div key={grade.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{grade.assignment.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{grade.assignment.course}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Prof: {grade.instructor.first_name} {grade.instructor.last_name}</span>
                                                <span>Noté le: {new Date(grade.graded_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            {grade.feedback && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm font-medium text-blue-800 mb-1">Feedback:</p>
                                                    <p className="text-sm text-gray-700">{grade.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getGradeColor(grade.grade, grade.max_grade)}`}>
                                                {grade.grade}/{grade.max_grade}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {Math.round((grade.grade / grade.max_grade) * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'notifications' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Notifications ({notifications.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                                        }`}
                                    onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-1">
                                            {notification.type === 'course' && <BookOpen className="w-5 h-5 text-blue-600" />}
                                            {notification.type === 'assignment' && <FileText className="w-5 h-5 text-orange-600" />}
                                            {notification.type === 'grade' && <Star className="w-5 h-5 text-green-600" />}
                                            {notification.type === 'deadline' && <AlertCircle className="w-5 h-5 text-red-600" />}
                                            {notification.type === 'announcement' && <Bell className="w-5 h-5 text-purple-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(notification.created_at).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
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

export default withAuth(StudentDashboard);
