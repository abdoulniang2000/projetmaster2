'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import withAuth from '@/app/components/withAuth';

function DashboardRedirectPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const isAdmin = user.roles.some(role => role.name === 'admin');
            const isEnseignant = user.roles.some(role => role.name === 'enseignant');

            if (isAdmin) {
                router.replace('/dashboard/admin');
            } else if (isEnseignant) {
                router.replace('/dashboard/enseignant');
            } else {
                router.replace('/dashboard/etudiant');
            }
        }
    }, [user, router]);

    // Affiche un état de chargement pendant la redirection
    return <div>Loading dashboard...</div>;
}

export default withAuth(DashboardRedirectPage);
