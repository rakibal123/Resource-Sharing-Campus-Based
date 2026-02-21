'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import { resources, requests, currentUser } from '@/data/dummy';
import Card from '@/components/Card';
import { BASE_URL, fetchUserStats, fetchResources } from '@/lib/api';
import { FiUsers, FiGrid, FiList, FiClock, FiPlusSquare } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const DashboardOverview = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({
        totalResources: 0,
        borrowedItems: 0,
        myPendingRequests: 0
    });
    const [recentResources, setRecentResources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [stats, resources] = await Promise.all([
                    fetchUserStats(),
                    fetchResources()
                ]);
                setStatsData(stats);
                setRecentResources(resources.slice(0, 4));
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const stats = [
        { name: 'Total Resources', value: statsData.totalResources, icon: FiGrid, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Borrowed Items', value: statsData.borrowedItems, icon: FiUsers, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Pending Requests', value: statsData.myPendingRequests, icon: FiClock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {stats.map((item) => (
                    <Card key={item.name} className="flex items-center">
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full mr-4 ${item.bg} ${item.color}`}>
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Resources */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Recent Resources</h2>
                        <Link href="/dashboard/resources" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            View All
                        </Link>
                    </div>
                    <Card noPadding>
                        <ul className="divide-y divide-gray-200">
                            {recentResources.map((resource) => (
                                <li key={resource._id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden rounded-md bg-gray-100">
                                            <img
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                src={resource.imageUrl?.startsWith('/uploads') ? `${BASE_URL}${resource.imageUrl}` : resource.imageUrl}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{resource.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{resource.category}</p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {resource.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/add-resource">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-indigo-500 h-full flex items-center justify-center p-6 bg-indigo-50/50">
                                <div className="text-center">
                                    <FiPlusSquare className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                                    <span className="font-medium text-gray-900">Add Resource</span>
                                </div>
                            </Card>
                        </Link>
                        <Link href="/dashboard/my-requests">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500 h-full flex items-center justify-center p-6 bg-green-50/50">
                                <div className="text-center">
                                    <FiList className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <span className="font-medium text-gray-900">Check Requests</span>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
