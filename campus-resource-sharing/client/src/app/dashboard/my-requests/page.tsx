'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import toast from 'react-hot-toast';

import { fetchMyRequests, cancelRequest, updateRequestStatus } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const MyRequests = () => {
    const { user } = useAuth();
    const [myRequests, setMyRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await fetchMyRequests();
                setMyRequests(data);
            } catch (error: any) {
                console.error('Failed to fetch requests', error);
                const message = error.response?.data?.message || error.message || 'Failed to load your requests';
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleStatusUpdate = async (requestId: string, status: string) => {
        const action = status === 'approved' ? 'approving' : 'rejecting';
        const confirmMsg = `Are you sure you want to ${status} this request?`;
        if (!confirm(confirmMsg)) return;

        setUpdatingId(requestId);
        const toastId = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} request...`);
        try {
            await updateRequestStatus(requestId, status);

            setMyRequests(prev => prev.map(req =>
                req._id === requestId ? { ...req, status: status.charAt(0).toUpperCase() + status.slice(1) } : req
            ));
            toast.success(`Request ${status} successfully`, { id: toastId });
        } catch (error: any) {
            console.error(`Failed to ${status} request`, error);
            const message = error.response?.data?.message || `Failed to ${status} request`;
            toast.error(message, { id: toastId });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCancel = async (requestId: string) => {
        if (!confirm('Are you sure you want to cancel this request?')) return;

        setCancellingId(requestId);
        const toastId = toast.loading('Cancelling request...');
        try {
            await cancelRequest(requestId);

            setMyRequests(prev => prev.filter(req => req._id !== requestId));
            toast.success('Request cancelled successfully', { id: toastId });
        } catch (error: any) {
            console.error('Failed to cancel request', error);
            const message = error.response?.data?.message || 'Failed to cancel request';
            toast.error(message, { id: toastId });
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase();
        let colorClass = 'bg-gray-100 text-gray-800';
        if (s === 'approved') colorClass = 'bg-green-100 text-green-800';
        if (s === 'pending') colorClass = 'bg-yellow-100 text-yellow-800';
        if (s === 'rejected') colorClass = 'bg-red-100 text-red-800';

        return (
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${colorClass}`}>
                {status}
            </span>
        );
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h1>

            <Card noPadding>
                {myRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Resource Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Owner
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {myRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {request.resourceId?.imageUrl ? (
                                                        <img className="h-10 w-10 rounded-md object-cover" src={request.resourceId.imageUrl} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Img</div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{request.resourceId?.title || 'Unknown Resource'}</div>
                                                    <div className="text-sm text-gray-500">{request.resourceId?.category || 'Unknown'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{request.ownerId?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{request.ownerId?.email || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(request.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {/* If user is requester, show Cancel */}
                                            {request.requesterId?._id === user?._id && request.status?.toLowerCase() === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(request._id)}
                                                    disabled={cancellingId === request._id}
                                                    className={`text-red-600 hover:text-red-900 font-medium transition-colors flex items-center ${cancellingId === request._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {cancellingId === request._id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            )}

                                            {/* If user is owner, show Approve/Reject */}
                                            {request.ownerId?._id === user?._id && request.status?.toLowerCase() === 'pending' && (
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleStatusUpdate(request._id, 'approved')}
                                                        disabled={updatingId === request._id}
                                                        className="text-green-600 hover:text-green-900 font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                                        disabled={updatingId === request._id}
                                                        className="text-red-600 hover:text-red-900 font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">You haven't made any requests yet.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MyRequests;
