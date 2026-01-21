'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Edit, Trash2, Upload, Users, Calendar, Clock, Star, MessageSquare, Bell, Search, Filter, FileText, Play, Eye, CheckCircle, AlertCircle, BarChart3, Award, Download } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    module: string;
    semester: string;
    credits: number;
    is_active: boolean;
    created_at: string;
    students_count: number;
    materials_count: number;
    assignments_count: number;
}

interface Material {
    id: number;
    title: string;
    type: 'pdf' | 'video' | 'ppt' | 'document';
    size: number;
    url: string;
    uploaded_at: string;
    course_id: number;
    course_title: string;
}

interface Assignment {
    id: number;
    title: string;
    description: string;
    course_id: number;
    course_title: string;
    due_date: string;
    created_at: string;
    submissions_count: number;
    students_count: number;
    status: 'draft' | 'published' | 'closed';
}

interface Submission {
    id: number;
    assignment_id: number;
    assignment_title: string;
    student: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    submitted_at: string;
    grade?: number;
    feedback?: string;
    status: 'submitted' | 'graded';
    attachments?: {
        id: number;
        filename: string;
        size: number;
        url: string;
    }[];
}

interface Announcement {
    id: number;
    title: string;
    content: string;
    course_id?: number;
    course_title?: string;
    created_at: string;
    is_pinned: boolean;
    views_count: number;
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    student_id?: string;
    department: string;
    enrollment_date: string;
    is_active: boolean;
    validated: boolean;
    courses_count: number;
    average_grade?: number;
    last_login?: string;
}

function TeacherDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'courses' | 'materials' | 'assignments' | 'submissions' | 'announcements' | 'students'>('courses');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, assignmentsRes, submissionsRes, announcementsRes, analyticsRes] = await Promise.all([
                    axios.get('/v1/cours?enseignant_id=' + (typeof window !== 'undefined' ? localStorage.getItem('user_id') : 1)),
                    axios.get('/v1/devoirs'),
                    axios.get('/v1/soumissions'),
                    axios.get('/v1/annonces'),
                    axios.get('/v1/analytics/dashboard')
                ]);

                const coursesData = coursesRes.data.map((course: any) => ({
                    ...course,
                    title: course.nom,
                    module: course.module?.nom || 'Non spécifié',
                    semester: course.semestre?.nom || 'Non spécifié',
                    students_count: course.etudiantsInscrits?.length || 0,
                    materials_count: course.fichiers?.length || 0,
                    assignments_count: course.devoirs?.length || 0
                }));

                const assignmentsData = assignmentsRes.data.map((assignment: any) => ({
                    ...assignment,
                    title: assignment.titre,
                    description: assignment.description,
                    course_title: assignment.cours?.nom,
                    due_date: assignment.date_limite,
                    submissions_count: assignment.soumissions?.length || 0,
                    students_count: assignment.cours?.etudiantsInscrits?.length || 0,
                    status: assignment.is_published ? 'published' : 'draft'
                }));

                const submissionsData = submissionsRes.data.map((submission: any) => ({
                    ...submission,
                    assignment_title: submission.devoir?.titre,
                    student: submission.etudiant,
                    grade: submission.note?.valeur,
                    feedback: submission.note?.commentaire,
                    status: submission.note ? 'graded' : 'submitted'
                }));

                const announcementsData = announcementsRes.data.map((announcement: any) => ({
                    ...announcement,
                    title: announcement.titre,
                    content: announcement.contenu,
                    course_title: announcement.cours?.nom,
                    is_pinned: false,
                    views_count: 0
                }));

                setCourses(coursesData || []);
                setAssignments(assignmentsData || []);
                setSubmissions(submissionsData || []);
                setAnnouncements(announcementsData || []);
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
        course.module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const createCourse = async (courseData: any) => {
        try {
            await axios.post('/v1/teacher/courses', courseData);
            setShowCreateModal(false);
            const coursesRes = await axios.get('/v1/teacher/courses');
            setCourses(coursesRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la création du cours:', error);
        }
    };

    const updateCourse = async (courseId: number, courseData: any) => {
        try {
            await axios.put(`/v1/teacher/courses/${courseId}`, courseData);
            const coursesRes = await axios.get('/v1/teacher/courses');
            setCourses(coursesRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la modification du cours:', error);
        }
    };

    const deleteCourse = async (courseId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
            try {
                await axios.delete(`/v1/teacher/courses/${courseId}`);
                const coursesRes = await axios.get('/v1/teacher/courses');
                setCourses(coursesRes.data || []);
            } catch (error) {
                console.error('Erreur lors de la suppression du cours:', error);
            }
        }
    };

    const gradeSubmission = async (submissionId: number, grade: number, feedback: string) => {
        try {
            await axios.put(`/v1/teacher/submissions/${submissionId}/grade`, { grade, feedback });
            const submissionsRes = await axios.get('/v1/teacher/submissions');
            setSubmissions(submissionsRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la notation:', error);
        }
    };

    const validateStudent = async (studentId: number) => {
        try {
            await axios.put(`/v1/teacher/students/${studentId}/validate`);
            const studentsRes = await axios.get('/v1/teacher/students');
            setStudents(studentsRes.data || []);
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
        }
    };

    const getCourseStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    const getAssignmentStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getGradeColor = (grade: number) => {
        if (grade >= 16) return 'text-green-600';
        if (grade >= 14) return 'text-blue-600';
        if (grade >= 12) return 'text-orange-600';
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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Espace Enseignant
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez vos cours et suivez vos étudiants</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
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
                                <p className="text-sm font-medium text-gray-600">Mes cours</p>
                                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
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
                                <p className="text-sm font-medium text-gray-600">Étudiants totaux</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {courses.reduce((acc, course) => acc + course.students_count, 0)}
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
                                <p className="text-sm font-medium text-gray-600">Devoirs à corriger</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {submissions.filter(s => s.status === 'submitted').length}
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
                                <p className="text-sm font-medium text-gray-600">Taux de remise</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {assignments.length > 0 ?
                                        Math.round((submissions.length / assignments.reduce((acc, a) => acc + a.students_count, 0)) * 100) :
                                        0
                                    }%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Onglets de navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                <button
                    onClick={() => setActiveTab('courses')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'courses'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    <span>Cours</span>
                </button>
                <button
                    onClick={() => setActiveTab('materials')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'materials'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    <span>Supports</span>
                </button>
                <button
                    onClick={() => setActiveTab('assignments')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'assignments'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>Devoirs</span>
                </button>
                <button
                    onClick={() => setActiveTab('submissions')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'submissions'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <CheckCircle className="w-4 h-4" />
                    <span>Corrections</span>
                </button>
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'announcements'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Bell className="w-4 h-4" />
                    <span>Annonces</span>
                </button>
                <button
                    onClick={() => setActiveTab('students')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'students'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    <span>Étudiants</span>
                </button>
            </div>

            {/* Barre de recherche pour les cours */}
            {activeTab === 'courses' && (
                <Card className="card-gradient">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un cours ou un module..."
                                    className="input-gradient w-full pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-gradient-primary flex items-center space-x-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Nouveau cours</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contenu des onglets */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="card-gradient hover:shadow-lg transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>Module: {course.module}</span>
                                            <span>Semestre: {course.semestre}</span>
                                            <span>{course.credits} crédits</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">{course.students_count}</p>
                                        <p className="text-xs text-gray-600">Étudiants</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{course.materials_count}</p>
                                        <p className="text-xs text-gray-600">Supports</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-orange-600">{course.assignments_count}</p>
                                        <p className="text-xs text-gray-600">Devoirs</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCourseStatusColor(course.is_active)}`}>
                                        {course.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === 'materials' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Mes supports pédagogiques ({materials.length})</span>
                            <button className="btn-gradient-primary flex items-center space-x-2">
                                <Upload className="w-5 h-5" />
                                <span>Ajouter un support</span>
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {materials.map((material) => (
                                <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className={`w-10 h-10 rounded flex items-center justify-center ${material.type === 'pdf' ? 'bg-red-100' :
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
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                <span>{material.course_title}</span>
                                                <span>{(material.size / 1024 / 1024).toFixed(2)} MB</span>
                                                <span>{new Date(material.uploaded_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="btn-gradient-secondary text-sm">
                                            <Eye className="w-4 h-4 mr-1" />
                                            Voir
                                        </button>
                                        <button className="btn-gradient-primary text-sm">
                                            <Download className="w-4 h-4 mr-1" />
                                            Télécharger
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'assignments' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Mes devoirs ({assignments.length})</span>
                            <button className="btn-gradient-primary flex items-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Créer un devoir</span>
                            </button>
                        </CardTitle>
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
                                                    {assignment.status === 'published' ? 'Publié' :
                                                        assignment.status === 'draft' ? 'Brouillon' : 'Fermé'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{assignment.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Cours: {assignment.course_title}</span>
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    Date limite: {new Date(assignment.due_date).toLocaleDateString('fr-FR')}
                                                </span>
                                                <span>Créé le: {new Date(assignment.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-blue-800">Soumissions: {assignment.submissions_count}/{assignment.students_count}</span>
                                                    <span className="font-medium text-blue-900">
                                                        {Math.round((assignment.submissions_count / assignment.students_count) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="btn-gradient-secondary text-sm">
                                                <Eye className="w-4 h-4 mr-1" />
                                                Voir
                                            </button>
                                            <button className="btn-gradient-primary text-sm">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Modifier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'submissions' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Devoirs à corriger ({submissions.filter(s => s.status === 'submitted').length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {submissions.filter(s => s.status === 'submitted').map((submission) => (
                                <div key={submission.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{submission.assignment_title}</h3>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    En attente de correction
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                                <span>Étudiant: {submission.student.first_name} {submission.student.last_name}</span>
                                                <span>Email: {submission.student.email}</span>
                                                <span>Soumis le: {new Date(submission.submitted_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            {submission.attachments && submission.attachments.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Pièces jointes:</p>
                                                    <div className="space-y-1">
                                                        {submission.attachments.map((attachment) => (
                                                            <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                                                                <FileText className="w-4 h-4 text-gray-600" />
                                                                <span>{attachment.filename}</span>
                                                                <span className="text-gray-500">({(attachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                                <button className="btn-gradient-secondary text-xs">
                                                                    <Download className="w-3 h-3 mr-1" />
                                                                    Télécharger
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="btn-gradient-primary text-sm">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Noter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'announcements' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Mes annonces ({announcements.length})</span>
                            <button className="btn-gradient-primary flex items-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Nouvelle annonce</span>
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                                                {announcement.is_pinned && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Épinglé
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>{announcement.course_title || 'Tous les cours'}</span>
                                                <span>Publié le: {new Date(announcement.created_at).toLocaleDateString('fr-FR')}</span>
                                                <span>Vues: {announcement.views_count}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="btn-gradient-secondary text-sm">
                                                <Eye className="w-4 h-4 mr-1" />
                                                Voir
                                            </button>
                                            <button className="btn-gradient-primary text-sm">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Modifier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'students' && (
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle>Mes étudiants ({students.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Étudiant</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Département</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Moyenne</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Dernière connexion</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                        {student.first_name[0]}{student.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {student.first_name} {student.last_name}
                                                        </p>
                                                        {student.student_id && (
                                                            <p className="text-xs text-gray-500">ID: {student.student_id}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{student.email}</td>
                                            <td className="py-3 px-4 text-gray-700">{student.department}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.validated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {student.validated ? 'Validé' : 'En attente'}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {student.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {student.average_grade ? (
                                                    <span className={`font-bold ${getGradeColor(student.average_grade)}`}>
                                                        {student.average_grade.toFixed(1)}/20
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">
                                                {student.last_login ? new Date(student.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {!student.validated && (
                                                        <button
                                                            onClick={() => validateStudent(student.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
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

            {/* Modal création de cours */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl animate-scaleIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Nouveau cours</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du cours</label>
                                <input type="text" className="input-gradient w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="input-gradient w-full h-24" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                                    <select className="input-gradient w-full">
                                        <option>Sélectionner un module</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                                    <select className="input-gradient w-full">
                                        <option>Sélectionner un semestre</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Crédits</label>
                                <input type="number" className="input-gradient w-full" min="1" max="10" />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => createCourse({})}
                                className="btn-gradient-primary"
                            >
                                Créer le cours
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(TeacherDashboard);
