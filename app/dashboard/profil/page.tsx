'use client';

import withAuth from '@/app/components/withAuth';
import ProfileForm from '../components/ProfileForm';

function ProfilPage() {
    return (
        <div className="space-y-6 animate-fadeInUp">
            <ProfileForm />
        </div>
    );
}

export default withAuth(ProfilPage);
