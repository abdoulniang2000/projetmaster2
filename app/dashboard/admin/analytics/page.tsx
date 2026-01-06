'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, BookOpen, FileText, Target, Activity, Calendar, Award, Clock, BarChart3, Download, Filter, RefreshCw, Eye, Star, AlertCircle } from 'lucide-react';

interface Analytics {
    totalStudents: number;
    activeStudents: number;
    totalCourses: number;
    totalAssignments: number;
    submissionRate: number;
    averageGrade: number;
    performanceBySubject: SubjectPerformance[];
    monthlyActivity: MonthlyActivity[];
    gradeEvolution: GradeEvolution[];
    departmentStats: DepartmentStats[];
    kpis: KPIs;
}

interface KPIs {
    attendanceRate: number;
    dropoutRate: number;
    successRate: number;
    averageResponseTime: number;
    satisfactionScore: number;
    engagementRate: number;
    retentionRate: number;
}

interface GradeEvolution {
    date: string;
    average: number;
    submissions: number;
}

interface DepartmentStats {
    department: string;
    students: number;
    courses: number;
    averageGrade: number;
    engagement: number;
}

interface SubjectPerformance {
    subject: string;
    totalStudents: number;
    averageGrade: number;
    completionRate: number;
    passRate: number;
}

interface MonthlyActivity {
    month: string;
    activeStudents: number;
    submissionsCount: number;
    averageGrade: number;
}

function AdvancedAnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics>({
        totalStudents: 0,
        activeStudents: 0,
        totalCourses: 0,
        totalAssignments: 0,
        submissionRate: 0,
        averageGrade: 0,
        performanceBySubject: [],
        monthlyActivity: [],
        gradeEvolution: [],
        departmentStats: [],
        kpis: {
            attendanceRate: 0,
            dropoutRate: 0,
            successRate: 0,
            averageResponseTime: 0,
            satisfactionScore: 0,
            engagementRate: 0,
            retentionRate: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`/v1/analytics?range=${timeRange}&department=${selectedDepartment}`);
                setAnalytics(response.data || {
                    totalStudents: 0,
                    activeStudents: 0,
                    totalCourses: 0,
                    totalAssignments: 0,
                    submissionRate: 0,
                    averageGrade: 0,
                    performanceBySubject: [],
                    monthlyActivity: [],
                    gradeEvolution: [],
                    departmentStats: [],
                    kpis: {
                        attendanceRate: 0,
                        dropoutRate: 0,
                        successRate: 0,
                        averageResponseTime: 0,
                        satisfactionScore: 0,
                        engagementRate: 0,
                        retentionRate: 0
                    }
                });
            } catch (error) {
                console.error('Erreur lors du chargement des analyses:', error);
                setAnalytics({
                    totalStudents: 0,
                    activeStudents: 0,
                    totalCourses: 0,
                    totalAssignments: 0,
                    submissionRate: 0,
                    averageGrade: 0,
                    performanceBySubject: [],
                    monthlyActivity: [],
                    gradeEvolution: [],
                    departmentStats: [],
                    kpis: {
                        attendanceRate: 0,
                        dropoutRate: 0,
                        successRate: 0,
                        averageResponseTime: 0,
                        satisfactionScore: 0,
                        engagementRate: 0,
                        retentionRate: 0
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange, selectedDepartment]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner-gradient mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    const getGradeColor = (grade: number) => {
        if (grade >= 16) return 'text-green-600';
        if (grade >= 14) return 'text-blue-600';
        if (grade >= 12) return 'text-orange-600';
        return 'text-red-600';
    };

    const getPerformanceColor = (rate: number) => {
        if (rate >= 80) return 'bg-green-500';
        if (rate >= 60) return 'bg-blue-500';
        if (rate >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const exportAnalytics = async () => {
        try {
            const response = await axios.get('/v1/analytics/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'analytics_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    const refreshAnalytics = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/v1/analytics?range=${timeRange}&department=${selectedDepartment}`);
            setAnalytics(response.data || analytics);
        } catch (error) {
            console.error('Erreur lors du rafraîchissement:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                        Tableau de Bord Analytique
                    </h1>
                    <p className="text-gray-600 mt-2">Analysez les performances et les tendances</p>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        className="input-gradient"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="all">Tous les départements</option>
                        <option value="informatique">Informatique</option>
                        <option value="mathematiques">Mathématiques</option>
                        <option value="physique">Physique</option>
                        <option value="chimie">Chimie</option>
                    </select>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['week', 'month', 'quarter', 'year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : range === 'quarter' ? 'Trimestre' : 'Année'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={refreshAnalytics}
                        className="btn-gradient-secondary flex items-center space-x-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>Actualiser</span>
                    </button>
                    <button
                        onClick={exportAnalytics}
                        className="btn-gradient-primary flex items-center space-x-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>Exporter</span>
                    </button>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${analytics.activeStudents > 0 ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {analytics.totalStudents > 0 ?
                                    `+${Math.round((analytics.activeStudents / analytics.totalStudents) * 100)}%`
                                    : '0%'
                                }
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</h3>
                            <p className="text-sm text-gray-600">Total étudiants</p>
                        </div>
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">Actifs: {analytics.activeStudents}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${analytics.submissionRate > 70 ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {analytics.submissionRate > 0 ? `+${analytics.submissionRate}%` : '0%'}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{analytics.totalCourses}</h3>
                            <p className="text-sm text-gray-600">Cours actifs</p>
                        </div>
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">Taux de remise: {analytics.submissionRate}%</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center text-sm font-medium ${getGradeColor(analytics.averageGrade)}`}>
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {analytics.averageGrade > 0 ? '+' + analytics.averageGrade.toFixed(1) : '0'}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{analytics.totalAssignments}</h3>
                            <p className="text-sm text-gray-600">Devoirs créés</p>
                        </div>
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">Note moyenne: {analytics.averageGrade.toFixed(1)}/20</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-gradient">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="flex items-center text-sm font-medium text-green-600">
                                <Target className="w-4 h-4 mr-1" />
                                Objectif atteint
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                            <p className="text-sm text-gray-600">Taux de réussite</p>
                        </div>
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">Objectif: 80%</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance par matière */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <span>Performance par matière</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Matière</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Étudiants</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Note moyenne</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Taux de complétion</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Taux de réussite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.performanceBySubject.map((subject, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{subject.subject}</td>
                                        <td className="py-3 px-4 text-gray-700">{subject.totalStudents}</td>
                                        <td className={`py-3 px-4 font-bold ${getGradeColor(subject.averageGrade)}`}>
                                            {subject.averageGrade.toFixed(1)}/20
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getPerformanceColor(subject.completionRate)}`}
                                                        style={{ width: `${subject.completionRate}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium">{subject.completionRate}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getPerformanceColor(subject.passRate)}`}
                                                        style={{ width: `${subject.passRate}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium">{subject.passRate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Activité mensuelle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-green-500" />
                            <span>Activité mensuelle</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.monthlyActivity.map((month, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{month.month}</p>
                                        <p className="text-sm text-gray-600">
                                            {month.activeStudents} étudiants actifs
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            {month.submissionsCount} soumissions
                                        </p>
                                        <p className={`font-bold ${getGradeColor(month.averageGrade)}`}>
                                            {month.averageGrade.toFixed(1)}/20
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <span>Tendances récentes</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Temps moyen d'étude</span>
                                <span className="font-bold text-gray-900">2h 45min/jour</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pic d'activité</span>
                                <span className="font-bold text-gray-900">Mer 14h-16h</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Meilleure performance</span>
                                <span className="font-bold text-green-600">Mathématiques</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sujet le plus populaire</span>
                                <span className="font-bold text-blue-600">Développement Web</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default withAuth(AdvancedAnalyticsPage);
