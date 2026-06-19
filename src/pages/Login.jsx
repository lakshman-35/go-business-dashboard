import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const responseJson = await response.json();

            if (response.ok) {
                const token = responseJson.data?.token;
                if (token) {
                    Cookies.set('jwt_token', token);
                    navigate('/');
                }
            } else {
                setError(responseJson.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div class="sm:mx-auto w-full max-w-md">
                <h1 class="text-center text-4xl font-extrabold text-indigo-600 tracking-tight">
                    Go Business
                </h1>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Sign in to open your referral dashboard.
                </p>
            </div>

            <div class="mt-8 sm:mx-auto w-full max-w-md">
                <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <form class="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" class="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div class="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" class="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div class="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div role="alert" class="text-sm text-red-600 font-medium bg-red-50 p-2.5 rounded border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;