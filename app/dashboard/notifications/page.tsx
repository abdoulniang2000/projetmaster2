'use client';

import withAuth from '@/app/components/withAuth';
import NotificationList from '../components/NotificationList';

function NotificationsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Mes Notifications</h1>
            <NotificationList />
        </div>
    );
}

export default withAuth(NotificationsPage);
