import React from 'react';
import Sidebar from '../../components/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Admin might use the same sidebar, or a specific one. Using the shared one for now which adapts based on URL */}
            <Sidebar />
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <header className="bg-white shadow-sm h-16 flex items-center px-8 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Admin Portal</h2>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
