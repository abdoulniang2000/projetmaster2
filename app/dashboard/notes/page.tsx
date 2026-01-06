'use client';

import withAuth from '@/app/components/withAuth';
import NotesList from '../components/NotesList';

function NotesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Mes Notes</h1>
            <NotesList />
        </div>
    );
}

export default withAuth(NotesPage);
