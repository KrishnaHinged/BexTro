// analytics.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiBarChart, FiUsers, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { FaChartLine, FaChartPie } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const analytics = ({ darkMode }) => {
    const dispatch = useDispatch();
    const { authUser, role, onlineUsers, OtherUsers } = useSelector((state) => state.user);
    const [timeRange, setTimeRange] = useState('week');
    const [analyticsData, setAnalyticsData] = useState(null);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Fetch analytics data (simulated API call)
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch(`http://localhost:5005/api/v1/analytics?range=${timeRange}`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setAnalyticsData(data);
                } else {
                    // toast.error('Failed to fetch analytics data');
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast.error('Error loading analytics');
            }
        };

        if (role === 'admin') {
            fetchAnalytics();
        }
    }, [timeRange, role]);

    // Sample data structure (replace with real API data)
    const stats = analyticsData || {
        users: {
            total: OtherUsers?.length || 0,
            active: onlineUsers?.length || 0,
            new: 245,
            growth: 12.5
        },
        activity: {
            daily: 3876,
            weekly: 24567,
            monthly: 98765,
            avgSession: '12m 34s'
        }
    };

    if (role !== 'admin') {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Access restricted to administrators only
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 h-full overflow-y-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-8"
            >
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Analytics Dashboard
                </h2>
                <div className={`flex gap-2 p-1 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
        
          

                {/* Online Status */}
                <motion.div
                    variants={itemVariants}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} shadow-lg`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FaChartLine className={`text-2xl ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Online Status
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Online Now: <span className="font-bold">{onlineUsers?.length || 0}</span>
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Peak Today: <span className="font-bold">{Math.max(stats.users.active, onlineUsers?.length || 0)}</span>
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Admin Online: <span className="font-bold">{authUser ? 1 : 0}</span>
                        </p>
                    </div>
                </motion.div>

                {/* System Performance */}
                <motion.div
                    variants={itemVariants}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} shadow-lg`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FiTrendingUp className={`text-2xl ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            System Performance
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Uptime: <span className="font-bold text-green-400">99.9%</span>
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Response: <span className="font-bold">245ms</span>
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Load: <span className="font-bold">Low</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`mt-6 p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} shadow-lg`}
            >
                <div className="flex items-center gap-3 mb-4">
                    <FaChartPie className={`text-2xl ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        System Summary
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Current Admin: <span className="font-bold">{authUser?.username || 'N/A'}</span>
                    </p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Total Users: <span className="font-bold">{stats.users.total.toLocaleString()}</span>
                    </p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Last Updated: <span className="font-bold">
                            {new Date().toLocaleTimeString()}
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default analytics;