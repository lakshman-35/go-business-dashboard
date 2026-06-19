import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null);


    const [metrics, setMetrics] = useState([]);
    const [serviceSummary, setServiceSummary] = useState(null);
    const [referralShare, setReferralShare] = useState({ link: '', code: '' });
    const [referralsList, setReferralsList] = useState([]);


    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;


    const [copyLinkText, setCopyLinkText] = useState('Copy');
    const [copyCodeText, setCopyCodeText] = useState('Copy');


    const isInitialLoad = useRef(true);

    const fetchData = async () => {
        if (isInitialLoad.current) {
            setLoading(true);
        } else {
            setTableLoading(true);
        }
        setError(null);
        const token = Cookies.get('jwt_token');

        try {
            const queryParams = new URLSearchParams();
            if (search) queryParams.append('search', search);
            if (sortOrder) queryParams.append('sort', sortOrder);

            const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?${queryParams.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: Failed to fetch layout configurations.`);
            }

            const resJson = await response.json();

            if (resJson.success && resJson.data) {
                const d = resJson.data;
                if (d.metrics) setMetrics(d.metrics);
                if (d.serviceSummary) setServiceSummary(d.serviceSummary);
                if (d.referral) setReferralShare(d.referral);
                if (d.referrals) setReferralsList(d.referrals);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while loading dashboard metrics.');
        } finally {
            setLoading(false);
            setTableLoading(false);
            isInitialLoad.current = false;
        }
    };

    useEffect(() => {
        fetchData();
        setCurrentPage(1);
    }, [search, sortOrder]);

    const toggleDateSort = () => {
        setSortOrder(prevOrder => (prevOrder === 'desc' ? 'asc' : 'desc'));
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'link') {
            setCopyLinkText('Copied!');
            setTimeout(() => setCopyLinkText('Copy'), 2000);
        } else {
            setCopyCodeText('Copied!');
            setTimeout(() => setCopyCodeText('Copy'), 2000);
        }
    };

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


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = referralsList.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(referralsList.length / rowsPerPage);

    return (
        <div class="min-h-screen bg-gray-50 flex flex-col justify-between">
            <div>
                <Navbar />
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">


                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Referral Dashboard</h1>
                        <p class="mt-1 text-sm text-gray-500">Track your referrals, earnings, and partner activity in one place.</p>
                    </div>

                    {error && (
                        <div role="alert" class="bg-red-50 p-4 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div class="text-center py-12 text-sm text-gray-500">Loading configurations...</div>
                    ) : (
                        <>

                            <section role="region" aria-label="Overview metrics" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {metrics.map((item) => (
                                    <div key={item.id} class="bg-white overflow-hidden shadow border border-gray-200 rounded-lg p-5">
                                        <dt class="text-sm font-medium text-gray-500 truncate">{item.label}</dt>
                                        <dd class="mt-1 text-3xl font-semibold text-indigo-600">{item.value}</dd>
                                    </div>
                                ))}
                            </section>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                <section aria-label="Service summary" class="bg-white shadow border border-gray-200 rounded-lg p-6 lg:col-span-1">
                                    <h2 class="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Service summary</h2>
                                    {serviceSummary && (
                                        <div class="space-y-4">
                                            <div>
                                                <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</span>
                                                <span class="text-sm font-medium text-gray-900">{serviceSummary.service}</span>
                                            </div>
                                            <div>
                                                <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Referrals</span>
                                                <span class="text-sm font-medium text-gray-900">{serviceSummary.yourReferrals}</span>
                                            </div>
                                            <div>
                                                <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Referrals</span>
                                                <span class="text-sm font-medium text-gray-900">{serviceSummary.activeReferrals}</span>
                                            </div>
                                            <div>
                                                <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Ref. Earnings</span>
                                                <span class="text-sm font-medium text-gray-900">{serviceSummary.totalRefEarnings}</span>
                                            </div>
                                        </div>
                                    )}
                                </section>


                                <section aria-label="Share referral" class="bg-white shadow border border-gray-200 rounded-lg p-6 lg:col-span-2 space-y-6">
                                    <h2 class="text-lg font-bold text-gray-900 border-b pb-3">Refer friends and earn more</h2>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Your Referral Link</label>
                                        <div class="flex rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                readOnly
                                                value={referralShare.link}
                                                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm focus:outline-none"
                                            />
                                            <button
                                                onClick={() => handleCopy(referralShare.link, 'link')}
                                                class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                            >
                                                {copyLinkText}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Your Referral Code</label>
                                        <div class="flex rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                readOnly
                                                value={referralShare.code}
                                                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm focus:outline-none"
                                            />
                                            <button
                                                onClick={() => handleCopy(referralShare.code, 'code')}
                                                class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                            >
                                                {copyCodeText}
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>


                            <section class="bg-white shadow border border-gray-200 rounded-lg overflow-hidden relative">
                                <div class="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h2 class="text-lg font-bold text-gray-900">All referrals</h2>
                                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <input
                                            type="text"
                                            aria-label="Search referrals"
                                            placeholder="Name or service…"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            class="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <label class="flex items-center space-x-2 text-sm text-gray-700 font-medium whitespace-nowrap">
                                            <span>Sort by date</span>
                                            <select
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value)}
                                                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="desc">Newest first</option>
                                                <option value="asc">Oldest first</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div class="overflow-x-auto relative min-h-[200px]">
                                    {tableLoading && (
                                        <div class="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                                            <span class="text-xs font-medium text-gray-400 tracking-wider uppercase">Updating List...</span>
                                        </div>
                                    )}

                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>

                                                <th
                                                    onClick={toggleDateSort}
                                                    class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 select-none transition-colors"
                                                >
                                                    <div class="flex items-center space-x-1">
                                                        <span>Date</span>
                                                        <span class="text-[10px] text-gray-400">
                                                            {sortOrder === 'desc' ? '▼ Newest' : '▲ Oldest'}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            {currentRows.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" class="px-6 py-10 text-center text-sm text-gray-500">
                                                        No matching entries
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentRows.map((row) => (
                                                    <tr
                                                        key={row.id}
                                                        onClick={() => navigate(`/referral/${row.id}`)}
                                                        class="hover:bg-gray-50 cursor-pointer transition-colors"
                                                    >
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.serviceName}</td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(row.date)}</td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">{formatCurrency(row.profit)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {referralsList.length > 0 && (
                                    <div class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div class="text-sm text-gray-700">
                                            Showing {indexOfFirstRow + 1}–{Math.min(indexOfLastRow, referralsList.length)} of {referralsList.length} entries
                                        </div>
                                        <div class="inline-flex space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    class={`px-3 py-2 border text-sm font-medium rounded-md ${currentPage === pageNum ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>

            {/* Footer */}
            <footer class="bg-white border-t border-gray-200 mt-12 py-6">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="text-sm text-gray-500">
                        © 2024 Go Business
                    </div>
                    <nav aria-label="Footer" class="flex space-x-6">
                        <a href="#" class="text-sm text-gray-500 hover:text-gray-900">About</a>
                        <a href="#" class="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;