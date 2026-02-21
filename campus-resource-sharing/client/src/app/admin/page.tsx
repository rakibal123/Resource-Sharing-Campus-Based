'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import { FiUsers, FiGrid, FiList, FiAlertCircle, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalResources: 0,
        totalRequests: 0,
        totalReports: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // @ts-ignore
                const { adminFetchStats } = await import('@/lib/api');
                const data = await adminFetchStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
                toast.error('Failed to load dashboard stats');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statItems = [
        { name: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-100', href: '/admin/users' },
        { name: 'Total Resources', value: stats.totalResources, icon: FiGrid, color: 'text-green-600', bg: 'bg-green-100', href: '/admin/resources' },
        { name: 'Total Requests', value: stats.totalRequests, icon: FiList, color: 'text-purple-600', bg: 'bg-purple-100', href: '/admin/requests' },
        { name: 'Reports', value: stats.totalReports, icon: FiAlertCircle, color: 'text-red-600', bg: 'bg-red-100', href: '/admin/reports' },
        { name: 'Audit Logs', value: 'View', icon: FiActivity, color: 'text-indigo-600', bg: 'bg-indigo-100', href: '/admin/logs' },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {statItems.map((item) => (
                    <Link key={item.name} href={item.href}>
                        <Card className="flex items-center hover:shadow-md transition-shadow cursor-pointer h-full border-l-4 border-l-transparent hover:border-l-indigo-500">
                            <div className={`p-3 rounded-full mr-4 ${item.bg} ${item.color}`}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <p className="text-gray-500">No recent activity to show.</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
                    <div className="flex items-center text-green-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        All systems operational
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
