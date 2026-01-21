'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Save, X, Upload, Calendar } from 'lucide-react';
import Link from 'next/link';

interface FormData {
    titre: string;
    description: string;
    cours_id: string;
    date_limite: string;
    fichier_joint: File | null;
}

function CreateDevoirPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cours, setCours] = useState<any[]>([]);
    const [formData, setFormData] = useState<FormData>({
        titre: '',
        description: '',
        cours_id: '',
        date_limite: '',
        fichier_joint: null
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchCours();
    }, []);

    const fetchCours = async () => {
        try {
            const response = await axios.get('/v1/cours/enseignant');
            setCours(response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, fichier_joint: file }));
        if (errors.fichier_joint) {
            setErrors(prev => ({ ...prev, fichier_joint: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.titre.trim()) {
            newErrors.titre = 'Le titre du devoir est requis';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise';
        } else if (formData.description.length < 20) {
            newErrors.description = 'La description doit contenir au moins 20 caractères';
        }

        if (!formData.cours_id) {
            newErrors.cours_id = 'Le choix du cours est requis';
        }

        if (!formData.date_limite) {
            newErrors.date_limite = 'La date limite est requise';
        } else {
            const selectedDate = new Date(formData.date_limite);
            const now = new Date();
            if (selectedDate <= now) {
                newErrors.date_limite = 'La date limite doit être dans le futur';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('titre', formData.titre);
            submitData.append('description', formData.description);
            submitData.append('cours_id', formData.cours_id);
            submitData.append('date_limite', formData.date_limite);

            if (formData.fichier_joint) {
                submitData.append('fichier_joint', formData.fichier_joint);
            }

            await axios.post('/v1/devoirs', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            router.push('/dashboard/enseignant/devoirs');
        } catch (error: any) {
            console.error('Erreur lors de la création du devoir:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ submit: 'Une erreur est survenue lors de la création du devoir' });
            }
        } finally {
            setLoading(false);
        }
    };

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/enseignant/devoirs"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau devoir</h1>
                        <p className="text-gray-600 mt-2">Définissez les détails du devoir pour vos étudiants</p>
                    </div>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
            </div>

            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Titre */}
                    <div>
                        <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-2">
                            Titre du devoir <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="titre"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.titre ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Ex: Devoir sur les équations différentielles"
                            disabled={loading}
                        />
                        {errors.titre && (
                            <p className="mt-1 text-sm text-red-600">{errors.titre}</p>
                        )}
                    </div>

                    {/* Cours */}
                    <div>
                        <label htmlFor="cours_id" className="block text-sm font-medium text-gray-700 mb-2">
                            Cours concerné <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="cours_id"
                            name="cours_id"
                            value={formData.cours_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.cours_id ? 'border-red-500' : 'border-gray-200'
                                }`}
                            disabled={loading}
                        >
                            <option value="">Sélectionner un cours</option>
                            {cours.map(c => (
                                <option key={c.id} value={c.id}>{c.nom}</option>
                            ))}
                        </select>
                        {errors.cours_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.cours_id}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description et consignes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={8}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Décrivez en détail ce que les étudiants doivent faire, les objectifs, les critères d'évaluation..."
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.description.length}/1000 caractères
                        </p>
                    </div>

                    {/* Date limite */}
                    <div>
                        <label htmlFor="date_limite" className="block text-sm font-medium text-gray-700 mb-2">
                            Date limite de soumission <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="date_limite"
                                name="date_limite"
                                value={formData.date_limite}
                                onChange={handleChange}
                                min={minDate}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.date_limite ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                disabled={loading}
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                        {errors.date_limite && (
                            <p className="mt-1 text-sm text-red-600">{errors.date_limite}</p>
                        )}
                    </div>

                    {/* Fichier joint */}
                    <div>
                        <label htmlFor="fichier_joint" className="block text-sm font-medium text-gray-700 mb-2">
                            Fichier joint (optionnel)
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                id="fichier_joint"
                                name="fichier_joint"
                                onChange={handleFileChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                disabled={loading}
                                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                            />
                            <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                        {formData.fichier_joint && (
                            <p className="mt-2 text-sm text-green-600">
                                Fichier sélectionné: {formData.fichier_joint.name} ({(formData.fichier_joint.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Formats acceptés: PDF, DOC, DOCX, TXT, ZIP, RAR (max 10MB)
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <Link
                            href="/dashboard/enseignant/devoirs"
                            className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Annuler</span>
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Création en cours...' : 'Créer le devoir'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Conseils pour un bon devoir
                </h3>
                <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Soyez clair et précis dans vos consignes pour éviter toute confusion</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Précisez les critères d'évaluation et les attentes</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Choisissez une date limite raisonnable en fonction de la complexité</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Joignez les documents nécessaires si applicable</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default withAuth(CreateDevoirPage);
