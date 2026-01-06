'use client';

import withAuth from '@/app/components/withAuth';
import ProfileForm from '../components/ProfileForm';

function ProfilPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
            <ProfileForm />
        </div>
    );
}

export default withAuth(ProfilPage);
