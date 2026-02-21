'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import toast from 'react-hot-toast';

const UsersManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // @ts-ignore
                const { adminFetchUsers } = await import('@/lib/api');
                const data = await adminFetchUsers();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
                toast.error('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAction = async (userId: string, action: string) => {
        if (!confirm(`Are you sure you want to ${action.toLowerCase()} this user?`)) return;

        const toastId = toast.loading(`${action}ing user...`);
        try {
            if (action === 'Deleted') {
                // @ts-ignore
                const { adminDeleteUser } = await import('@/lib/api');
                await adminDeleteUser(userId);
                setUsers(prev => prev.filter(u => u._id !== userId));
            } else if (action === 'Blocked') {
                // @ts-ignore
                const { adminBlockUser } = await import('@/lib/api');
                await adminBlockUser(userId);
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: 'blocked' } : u));
            } else if (action === 'Unblocked') {
                // @ts-ignore
                const { adminUnblockUser } = await import('@/lib/api');
                await adminUnblockUser(userId);
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: 'active' } : u));
            }
            toast.success(`User ${action.toLowerCase()} successfully`, { id: toastId });
        } catch (error: any) {
            console.error(`Failed to ${action} user`, error);
            const message = error.response?.data?.message || `Failed to ${action} user`;
            toast.error(message, { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Users Management</h1>

            <Card noPadding>
                {users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.department || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'Faculty' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.status === 'active' || !user.status ? (
                                                <button
                                                    onClick={() => handleAction(user._id, 'Blocked')}
                                                    className="text-amber-600 hover:text-amber-900 mr-4"
                                                >
                                                    Block
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(user._id, 'Unblocked')}
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                >
                                                    Unblock
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleAction(user._id, 'Deleted')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No users found.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default UsersManagement;
