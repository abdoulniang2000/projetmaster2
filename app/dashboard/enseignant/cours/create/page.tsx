'use client';

import { useState } from 'react';
import withAuth from '@/app/components/withAuth';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';

function CreateCoursPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        description: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom du cours est requis';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise';
        } else if (formData.description.length < 10) {
            newErrors.description = 'La description doit contenir au moins 10 caractères';
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
            await axios.post('/v1/cours', formData);
            router.push('/dashboard/enseignant/cours');
        } catch (error: any) {
            console.error('Erreur lors de la création du cours:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ submit: 'Une erreur est survenue lors de la création du cours' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/enseignant/cours"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau cours</h1>
                        <p className="text-gray-600 mt-2">Remplissez les informations pour créer votre cours</p>
                    </div>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
            </div>

            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Nom du cours */}
                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du cours <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.nom ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Ex: Mathématiques, Physique, Histoire..."
                            disabled={loading}
                        />
                        {errors.nom && (
                            <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Décrivez le contenu du cours, les objectifs, les prérequis..."
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.description.length}/500 caractères
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <Link
                            href="/dashboard/enseignant/cours"
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
                            <span>{loading ? 'Création en cours...' : 'Créer le cours'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Informations importantes
                </h3>
                <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Le nom du cours sera visible par tous les étudiants inscrits</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Vous pourrez modifier ces informations plus tard si nécessaire</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Après création, vous pourrez ajouter des supports pédagogiques et des devoirs</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default withAuth(CreateCoursPage);
