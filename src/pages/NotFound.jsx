import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 text-center space-y-4">
            <h1 class="text-5xl font-extrabold text-indigo-600">404</h1>
            <p class="text-xl font-medium text-gray-700">Page not found</p>
            <p class="text-sm text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
            <Link
                to="/"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Back to dashboard
            </Link>
        </div>
    );
};

export default NotFound;