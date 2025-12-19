'use client';

import withAuth from '../components/withAuth';

function DashboardPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Dashboard</h1>
                <p className="text-center text-gray-600">Welcome to your dashboard!</p>
            </div>
        </div>
    );
}

export default withAuth(DashboardPage);
