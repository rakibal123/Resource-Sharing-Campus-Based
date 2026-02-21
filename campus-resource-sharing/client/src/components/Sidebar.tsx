'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPlusSquare, FiList, FiGrid, FiUsers, FiFileText, FiFlag, FiLogOut } from 'react-icons/fi';
import clsx from 'clsx';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const dashboardLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: FiHome },
        { name: 'Add Resource', href: '/dashboard/add-resource', icon: FiPlusSquare },
        { name: 'View Resources', href: '/dashboard/resources', icon: FiGrid },
        { name: 'My Requests', href: '/dashboard/my-requests', icon: FiList },
    ];

    const adminLinks = [
        { name: 'Dashboard', href: '/admin', icon: FiHome },
        { name: 'Manage Users', href: '/admin/users', icon: FiUsers },
        { name: 'Manage Resources', href: '/admin/resources', icon: FiGrid },
        { name: 'Manage Requests', href: '/admin/requests', icon: FiList },
        { name: 'Reports', href: '/admin/reports', icon: FiFlag },
        { name: 'Audit Logs', href: '/admin/logs', icon: FiFileText },
    ];

    const links = pathname.startsWith('/admin') ? adminLinks : dashboardLinks;

    return (
        <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-gray-900 border-r border-gray-800 pt-16 z-30">
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <div className="flex-1 px-4 py-6 space-y-1">
                    {links.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    isActive
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150'
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-300',
                                        'flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors duration-150'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="px-4 pb-6 border-b border-gray-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-gray-800 transition-colors duration-150 group"
                    >
                        <FiLogOut className="flex-shrink-0 -ml-1 mr-3 h-5 w-5 group-hover:text-red-300" aria-hidden="true" />
                        Logout
                    </button>
                </div>

                {/* User Profile Summary at bottom */}
                <div className="p-4">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold border border-blue-700">
                            {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-200">{user.name}</p>
                            <p className="text-xs text-gray-400">View Profile</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
