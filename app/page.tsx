'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers dashboard
    if (user) {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(credentials);
      // La redirection sera gérée par le useEffect ci-dessus
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Si l'utilisateur est connecté, afficher le chargement
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-scaleIn">
          <div className="spinner-gradient mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold text-white mb-2 animate-fadeInUp">Redirection vers le dashboard...</h1>
          <p className="text-white/80 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>Préparation de votre espace personnel</p>
        </div>
      </div>
    );
  }

  // Afficher le formulaire de connexion
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-blue-500/20 to-green-500/20 animate-gradient-shift"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400/30 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-10 w-14 h-14 bg-orange-400/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="card-gradient p-8 animate-scaleIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full mb-4 animate-pulse-slow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fadeInUp">
              Bienvenue !
            </h2>
            <p className="text-gray-600 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Connectez-vous pour accéder à votre tableau de bord
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeInLeft">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-gradient w-full pl-10"
                    placeholder="exemple@email.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="animate-fadeInLeft" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input-gradient w-full pl-10"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-gradient-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner-gradient w-5 h-5 mr-2"></div>
                    Connexion en cours...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Comptes de test
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                <span className="font-medium text-orange-600">Admin:</span>
                <span className="text-gray-600">admin@example.com / password</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                <span className="font-medium text-blue-600">Enseignant:</span>
                <span className="text-gray-600">prof.alpha@example.com / password</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                <span className="font-medium text-green-600">Étudiant:</span>
                <span className="text-gray-600">etudiant.un@example.com / password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
