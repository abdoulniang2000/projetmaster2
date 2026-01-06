'use client';

import withAuth from '@/app/components/withAuth';
import DevoirList from '../components/DevoirList';

function DevoirsListPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tous les Devoirs</h1>
            <DevoirList />
        </div>
    );
}

export default withAuth(DevoirsListPage);
