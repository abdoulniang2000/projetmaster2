'use client';

import withAuth from '@/app/components/withAuth';
import MessageList from '../components/MessageList';

function MessageriePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Messagerie</h1>
            <MessageList />
        </div>
    );
}

export default withAuth(MessageriePage);
