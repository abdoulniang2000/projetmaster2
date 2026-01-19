import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles: { name: string }[];
    // Ajoutez d'autres champs utilisateur si nécessaire
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Ajouter le token aux en-têtes par défaut d'Axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Synchroniser le token avec les cookies pour le middleware
            document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

            axios.get('/v1/user').then(response => {
                setUser(response.data);
            }).catch(() => {
                localStorage.removeItem('auth_token');
                delete axios.defaults.headers.common['Authorization'];
                // Supprimer aussi le cookie
                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setIsLoading(false);
        }
    }, []);

    const login = async (credentials: any) => {
        console.log('=== FRONTEND LOGIN START ===');
        console.log('Credentials:', {
            email: credentials.email,
            hasPassword: !!credentials.password,
            baseURL: axios.defaults.baseURL
        });

        try {
            console.log('Sending request to:', '/v1/login');
            console.log('Full URL:', axios.defaults.baseURL + '/v1/login');

            const response = await axios.post('/v1/login', credentials);
            console.log('✅ Response received:', response);
            console.log('Response data:', response.data);
            console.log('Response status:', response.status);

            if (!response.data.access_token) {
                console.error('❌ No token in response');
                throw new Error('Aucun token reçu dans la réponse');
            }

            const { access_token, user } = response.data;
            console.log('✅ Token received:', access_token.substring(0, 20) + '...');

            localStorage.setItem('auth_token', access_token);

            // Ajouter le token aux en-têtes par défaut d'Axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            // Synchroniser le token avec les cookies pour le middleware
            document.cookie = `auth_token=${access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

            // Vérifier les données utilisateur
            if (!user || !user.id) {
                console.warn('⚠️ Données utilisateur manquantes dans la réponse :', user);
                // Essayer de récupérer l'utilisateur via une requête séparée
                const userResponse = await axios.get('/v1/user');
                setUser(userResponse.data);
            } else {
                setUser(user);
            }

            console.log('✅ Utilisateur connecté avec succès :', user);
            // Redirection vers /dashboard qui gérera la redirection selon le rôle
            router.push('/dashboard');
            return; // Retourner void au lieu de response.data
        } catch (error: any) {
            console.error('❌ ERREUR CONNEXION DÉTAILLÉE:');
            console.error('Error object:', error);
            console.error('Error message:', error.message);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error config:', {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL,
                headers: error.config?.headers
            });

            // Propager l'erreur pour une gestion plus poussée dans le composant
            throw error;
        }
    };

    const register = async (data: any) => {
        await axios.post('/v1/register', data).then(() => {
            router.push('/');
        });
    };

    const logout = async () => {
        try {
            await axios.post('/v1/logout');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
            // Supprimer aussi le cookie
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            // Redirection vers la page d'accueil (page de connexion)
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
