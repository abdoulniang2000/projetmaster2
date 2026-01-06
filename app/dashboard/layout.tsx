import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative">
                    {/* Arrière-plan subtil avec animations */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-blue-50/30 to-green-50/30 dark:from-orange-900/10 dark:via-blue-900/10 dark:to-green-900/10"></div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
