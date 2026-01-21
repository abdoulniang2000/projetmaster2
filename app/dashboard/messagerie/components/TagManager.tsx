'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientText } from '@/components/theme/ThemeComponents';
import { Hash, Plus, X, Search } from 'lucide-react';
import axios from 'axios';

interface Tag {
    tag: string;
    couleur: string;
}

interface TagManagerProps {
    messageId: number;
    currentTags: any[];
    onTagsUpdated: (tags: any[]) => void;
}

export default function TagManager({ messageId, currentTags, onTagsUpdated }: TagManagerProps) {
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAvailableTags();
    }, []);

    const fetchAvailableTags = async () => {
        try {
            const response = await axios.get('/api/messages/tags');
            setAvailableTags(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des tags:', error);
        }
    };

    const filteredTags = availableTags.filter(tag =>
        tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addTag = async (tag: Tag) => {
        setLoading(true);
        try {
            await axios.post(`/api/messages/${messageId}/tags`, {
                tag: tag.tag,
                couleur: tag.couleur
            });

            // Mettre à jour les tags
            const updatedTags = [...currentTags, tag];
            onTagsUpdated(updatedTags);
            setShowTagSelector(false);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeTag = async (tag: string) => {
        setLoading(true);
        try {
            await axios.delete(`/api/messages/${messageId}/tags`, {
                data: { tag }
            });

            // Mettre à jour les tags
            const updatedTags = currentTags.filter(t => t.tag !== tag);
            onTagsUpdated(updatedTags);
        } catch (error) {
            console.error('Erreur lors de la suppression du tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const predefinedTags = [
        { tag: '#urgent', couleur: '#ef4444' },
        { tag: '#annonce', couleur: '#3b82f6' },
        { tag: '#projet', couleur: '#22c55e' },
        { tag: '#information', couleur: '#6b7280' },
        { tag: '#question', couleur: '#f59e0b' },
        { tag: '#reunion', couleur: '#8b5cf6' },
        { tag: '#devoir', couleur: '#ec4899' },
        { tag: '#examen', couleur: '#14b8a6' },
    ];

    return (
        <div className="relative">
            {/* Tags actuels */}
            <div className="flex flex-wrap gap-2 mb-2">
                {currentTags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: tag.couleur + '20', color: tag.couleur }}
                    >
                        <Hash className="w-3 h-3 mr-1" />
                        {tag.tag}
                        <button
                            onClick={() => removeTag(tag.tag)}
                            className="ml-1 hover:opacity-70"
                            disabled={loading}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTagSelector(!showTagSelector)}
                    disabled={loading}
                >
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter un tag
                </Button>
            </div>

            {/* Sélecteur de tags */}
            {showTagSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">
                                <GradientText from="orange" to="blue">
                                    Ajouter un tag
                                </GradientText>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Recherche */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un tag..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Tags prédéfinis */}
                            <div>
                                <h4 className="text-xs font-medium text-gray-700 mb-2">Tags prédéfinis</h4>
                                <div className="flex flex-wrap gap-2">
                                    {predefinedTags
                                        .filter(tag => !currentTags.some(t => t.tag === tag.tag))
                                        .filter(tag => tag.tag.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((tag, index) => (
                                            <button
                                                key={index}
                                                onClick={() => addTag(tag)}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105"
                                                style={{
                                                    backgroundColor: tag.couleur + '20',
                                                    color: tag.couleur,
                                                    borderColor: tag.couleur
                                                }}
                                                disabled={loading}
                                            >
                                                <Hash className="w-3 h-3 mr-1" />
                                                {tag.tag}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* Tags disponibles */}
                            {filteredTags.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-medium text-gray-700 mb-2">Tags disponibles</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {filteredTags
                                            .filter(tag => !currentTags.some(t => t.tag === tag.tag))
                                            .map((tag, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => addTag(tag)}
                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105"
                                                    style={{
                                                        backgroundColor: tag.couleur + '20',
                                                        color: tag.couleur,
                                                        borderColor: tag.couleur
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <Hash className="w-3 h-3 mr-1" />
                                                    {tag.tag}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Aucun tag trouvé */}
                            {filteredTags.length === 0 &&
                                predefinedTags.filter(tag => !currentTags.some(t => t.tag === tag.tag)).length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                        Aucun tag disponible
                                    </p>
                                )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
