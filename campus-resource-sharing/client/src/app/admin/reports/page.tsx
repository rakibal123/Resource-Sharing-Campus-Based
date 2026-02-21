'use client';

import React from 'react';
import Card from '@/components/Card';
import { FiUsers, FiGrid, FiActivity, FiBarChart2, FiPieChart } from 'react-icons/fi';

const Reports = () => {
    // Dummy Data for cards
    const stats = [
        { name: 'Total Users', value: '1,234', icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Total Resources', value: '856', icon: FiGrid, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Active Borrowings', value: '142', icon: FiActivity, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">System Reports</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {stats.map((item) => (
                    <Card key={item.name} className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${item.bg} ${item.color}`}>
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Section (UI Only) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Borrowing Activity</h3>
                        <FiBarChart2 className="text-gray-400 h-5 w-5" />
                    </div>
                    <div className="h-64 flex items-end justify-between space-x-2 px-2">
                        {/* Fake bars */}
                        {[35, 45, 30, 60, 75, 50, 65, 40, 55, 70, 45, 60].map((height, i) => (
                            <div key={i} className="w-full bg-indigo-100 rounded-t-md relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-md transition-all duration-500 group-hover:bg-indigo-600"
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </Card>

                {/* Categories Chart */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Resource Categories</h3>
                        <FiPieChart className="text-gray-400 h-5 w-5" />
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        <div className="relative h-48 w-48 rounded-full border-8 border-indigo-100 flex items-center justify-center">
                            {/* Simplified visual representation of a pie chart using conics/borders is complex with just tailwind, 
                                 so we'll use a visual approximation with colored segments or just a placeholder 
                             */}
                            <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-500 border-r-indigo-500 rotate-45"></div>
                            <div className="absolute inset-0 rounded-full border-8 border-transparent border-l-purple-500 -rotate-12"></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-800">856</span>
                                <span className="text-xs text-gray-500">Total Items</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></span>
                            <span className="text-sm text-gray-600">Electronics (45%)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-purple-500 mr-2"></span>
                            <span className="text-sm text-gray-600">Books (30%)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-gray-300 mr-2"></span>
                            <span className="text-sm text-gray-600">Other (25%)</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
