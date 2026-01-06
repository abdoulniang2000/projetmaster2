'use client';

import withAuth from '@/app/components/withAuth';
import CoursList from '../components/CoursList';

function CoursListPage() {
    return (
        <div className="animate-fadeInUp">
            <CoursList />
        </div>
    );
}

export default withAuth(CoursListPage);
