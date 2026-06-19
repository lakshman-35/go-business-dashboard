import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('jwt_token');
        navigate('/login');
    };

    return (
        <nav class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center space-x-8">
                        <Link
                            to="/"
                            aria-label="Go to dashboard home"
                            class="text-xl font-bold text-indigo-600 tracking-tight"
                        >
                            Go Business
                        </Link>
                        <div aria-label="Primary" class="hidden sm:flex space-x-4">
                            <Link to="/" class="text-gray-900 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-indigo-500">
                                Home
                            </Link>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <button
                            onClick={handleLogout}
                            class="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;