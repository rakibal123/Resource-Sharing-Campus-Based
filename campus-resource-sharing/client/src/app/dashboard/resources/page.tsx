'use client';

import { useAuth } from '@/context/AuthContext';

import { useState, useMemo, useEffect } from 'react';
import ResourceCard from '@/components/ResourceCard';
import { FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [resources, setResources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const categories = ['All', 'Books', 'Electronics', 'Clothing', 'Notes', 'Other'];

    const { user } = useAuth();

    useEffect(() => {
        const fetchResourceData = async () => {
            try {
                // @ts-ignore
                const { fetchResources } = await import('@/lib/api');
                const data = await fetchResources();
                setResources(data);

                if (user) {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Failed to fetch resources', error);
                toast.error('Failed to load resources');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResourceData();
    }, [user]);

    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, resources]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Available Resources</h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiFilter className="text-gray-400" />
                        </div>
                        <select
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResources.map((resource) => (
                        <div key={resource._id} className="h-full">
                            <ResourceCard resource={resource} currentUser={currentUser} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No resources found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All') }}
                        className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
