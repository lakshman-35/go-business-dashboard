import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

const ReferralDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setNotFound(false);
            const token = Cookies.get('jwt_token');

            try {
                const response = await fetch(`https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    setNotFound(true);
                    return;
                }

                const resJson = await response.json();

                if (resJson.success && resJson.data) {
                    // Parse both single-object data formats or direct array lookups securely
                    const referralRecord = resJson.data.referrals
                        ? resJson.data.referrals.find(r => r.id.toString() === id.toString())
                        : resJson.data;

                    if (referralRecord) {
                        setData(referralRecord);
                    } else {
                        setNotFound(true);
                    }
                } else {
                    setNotFound(true);
                }
            } catch (err) {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const formatDate = (isoStr) => {
        if (!isoStr) return '';
        return isoStr.replace(/-/g, '/');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div class="min-h-screen bg-gray-50">
                <Navbar />
                <div class="text-center py-20 text-sm text-gray-500">Loading configurations...</div>
            </div>
        );
    }

    if (notFound || !data) {
        return (
            <div class="min-h-screen bg-gray-50">
                <Navbar />
                <main class="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
                    <h1 class="text-3xl font-extrabold text-gray-900">Referral not found</h1>
                    <Link to="/" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        &larr; Back to dashboard
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div class="min-h-screen bg-gray-50">
            <Navbar />
            <main class="max-w-3xl mx-auto px-4 py-12 space-y-6">
                <div>
                    <Link to="/" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4">
                        &larr; Back to dashboard
                    </Link>
                    <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Referral Details</h1>
                    <h2 class="text-xl font-semibold text-gray-700 mt-2">{data.name}</h2>
                </div>

                <div class="bg-white shadow border border-gray-200 rounded-lg p-6">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Referral ID</dt>
                            <dd class="mt-1 text-sm text-gray-900 font-mono">{data.id}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Service Name</dt>
                            <dd class="mt-1 text-sm text-gray-900">{data.serviceName || data.service}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</dt>
                            <dd class="mt-1 text-sm text-gray-900">{formatDate(data.date)}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Profit</dt>
                            <dd class="mt-1 text-sm text-indigo-600 font-bold">{formatCurrency(data.profit)}</dd>
                        </div>
                    </dl>
                </div>
            </main>
        </div>
    );
};

export default ReferralDetail;