'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { FiClock, FiTag, FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { BASE_URL } from '@/lib/api';

interface Resource {
    _id: string;
    title: string;
    category: string;
    description: string;
    status: string;
    imageUrl: string;
    ownerId: {
        _id: string;
        name: string;
        email: string;
    } | string; // Handle populated or ID string
}

interface User {
    _id: string;
    name: string;
    email: string;
}

const ResourceCard = ({ resource, currentUser }: { resource: Resource; currentUser: User | null }) => {

    const [isLoading, setIsLoading] = React.useState(false);

    const handleRequest = async () => {
        setIsLoading(true);
        try {
            // @ts-ignore
            const { requestResource } = await import('@/lib/api');
            await requestResource(resource._id);
            toast.success(`Request sent for ${resource.title}!`);
        } catch (error: any) {
            console.error('Request failed:', error);
            const message = error.response?.data?.message || 'Failed to send request';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'borrowed':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available':
                return <FiCheckCircle className="w-3 h-3 mr-1" />;
            case 'borrowed':
                return <FiXCircle className="w-3 h-3 mr-1" />;
            default:
                return null;
        }
    }

    // Safely access owner name
    const ownerName = typeof resource.ownerId === 'object' ? resource.ownerId.name : 'Unknown';
    const ownerId = typeof resource.ownerId === 'object' ? resource.ownerId._id : resource.ownerId;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full group">
            <div className="relative h-64 overflow-hidden bg-gray-100">
                {resource.imageUrl ? (
                    <>
                        {/* Blurred background for "fit" effect */}
                        <img
                            src={resource.imageUrl.startsWith('/uploads') ? `${BASE_URL}${resource.imageUrl}` : resource.imageUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110"
                        />
                        <img
                            src={resource.imageUrl.startsWith('/uploads') ? `${BASE_URL}${resource.imageUrl}` : resource.imageUrl}
                            alt={resource.title}
                            className="relative z-10 w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 right-3 z-20">
                    <span className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(resource.status)} shadow-sm`}>
                        {getStatusIcon(resource.status)}
                        {resource.status}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="flex items-center text-xs font-medium text-blue-600 mb-1">
                        <FiTag className="w-3 h-3 mr-1" />
                        {resource.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                    </h3>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {resource.description}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center text-xs text-gray-500">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-600">
                            <FiUser className="w-3 h-3" />
                        </div>
                        <span className="truncate max-w-[100px]">{ownerName}</span>
                    </div>

                    {resource.status === 'available' && currentUser && currentUser._id !== ownerId ? (
                        <button
                            onClick={handleRequest}
                            disabled={isLoading}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 flex items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Request'
                            )}
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400 italic font-medium px-2">
                            {currentUser && currentUser._id === ownerId ? 'Your Item' : 'Unavailable'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
