'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    // Don't render navbar if no user is logged in (optional depending on requirement, but safe for hydration)
    // if (!user) return null;

    const isActive = (path: string) => pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800 tracking-tight">CampusShare</span>
                        </Link>
                        {user && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/"
                                    className={clsx(
                                        isActive('/')
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
                                    )}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className={clsx(
                                        isActive('/dashboard')
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
                                    )}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/add-resource"
                                    className={clsx(
                                        isActive('/dashboard/add-resource')
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
                                    )}
                                >
                                    Add Resource
                                </Link>
                                <Link
                                    href="/dashboard/my-requests"
                                    className={clsx(
                                        isActive('/dashboard/my-requests')
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
                                    )}
                                >
                                    My Requests
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <FiUser className="w-4 h-4" />
                                    <span>{user.name}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                                    title="Logout"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-500 hover:text-gray-900 font-medium transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <FiX className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <FiMenu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                {user ? (
                    <>
                        <div className="pt-2 pb-3 space-y-1">
                            <Link
                                href="/"
                                className={clsx(
                                    isActive('/')
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                                )}
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className={clsx(
                                    isActive('/dashboard')
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                                )}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/add-resource"
                                className={clsx(
                                    isActive('/dashboard/add-resource')
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                                )}
                            >
                                Add Resource
                            </Link>
                            <Link
                                href="/dashboard/my-requests"
                                className={clsx(
                                    isActive('/dashboard/my-requests')
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                                )}
                            >
                                My Requests
                            </Link>
                        </div>
                        <div className="pt-4 pb-4 border-t border-gray-200">
                            <Link href="/dashboard/profile" className="flex items-center px-4 hover:bg-gray-50 py-2 transition-colors">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                                        {user.profileImage ? (
                                            <img src={`http://localhost:5000${user.profileImage}`} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        <div className="space-y-1 px-2">
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
