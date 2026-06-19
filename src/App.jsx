import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReferralDetail from './pages/ReferralDetail';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('jwt_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PublicRoute = ({ children }) => {
    const token = Cookies.get('jwt_token');
    if (token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/referral/:id"
                    element={
                        <ProtectedRoute>
                            <ReferralDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/referrals"
                    element={<Navigate to="/" replace />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;