
import React from 'react';
import { FiGithub, FiTwitter, FiLinkedin, FiHeart } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-lg font-bold text-gray-800">CampusShare</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Facilitating resource sharing for a smarter campus.
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <span className="sr-only">GitHub</span>
                            <FiGithub className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <span className="sr-only">Twitter</span>
                            <FiTwitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <FiLinkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} CampusShare. All rights reserved.</p>
                    <p className="flex items-center mt-2 md:mt-0">
                        Made with <FiHeart className="w-3 h-3 text-red-500 mx-1" /> by Students
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
