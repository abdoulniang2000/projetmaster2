'use client';

import withAuth from '@/app/components/withAuth';
import NotificationList from '../components/NotificationList';

function NotificationsPage() {
    return (
        <div className="space-y-6 animate-fadeInUp">
            <NotificationList />
        </div>
    );
}

export default withAuth(NotificationsPage);
