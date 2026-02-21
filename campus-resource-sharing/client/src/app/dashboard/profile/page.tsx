'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/utils/api';
import { FiUser, FiMail, FiBook, FiUpload } from 'react-icons/fi';

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [uploading, setUploading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            department: user?.department || '',
        }
    });

    if (!user) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    const onSubmit = async (data: any) => {
        try {
            const response = await api.put('/api/users/profile', data);
            login({ ...user, ...response.data });
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const response = await api.post('/api/users/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update user context with new image URL
            // Assuming response.data.profileImage contains the relative path like '/uploads/...'
            const updatedUser = { ...user, profileImage: response.data.profileImage };
            login(updatedUser);

            toast.success('Profile image uploaded');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm">
                                {user.profileImage ? (
                                    <img
                                        src={`http://localhost:5000${user.profileImage}`}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-4xl font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                                <FiUpload className="w-5 h-5 text-gray-600" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                            {uploading && <span className="absolute -bottom-8 left-0 text-xs text-gray-500 w-32 text-center">Uploading...</span>}
                        </div>

                        <div className="text-center sm:text-left pt-2">
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email (Read Only)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    {...register("email")}
                                    readOnly
                                    className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiBook className="text-gray-400" />
                                </div>
                                <select
                                    {...register("department")}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                >
                                    <option value="CSE">CSE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="BBA">BBA</option>
                                    <option value="LAW">LAW</option>
                                    <option value="English">English</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
