import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTrash, FaExclamationTriangle, FaUser, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get("http://localhost:5005/api/v1/report", { withCredentials: true });
            setReports(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch reports error:", error);
            setLoading(false);
        }
    };

    const handleAction = async (reportId, status) => {
        try {
            await axios.patch(`http://localhost:5005/api/v1/report/${reportId}`, { status }, { withCredentials: true });
            toast.success(`Report ${status} successfully.`);
            fetchReports();
        } catch (error) {
            toast.error("Action failed.");
        }
    };

    if (loading) return <div className="p-10 text-white text-center">Loading reports...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">User Reports</h2>
            <div className="space-y-4">
                {reports.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center text-white/60">
                        No pending reports. The community is behaving well! 🎉
                    </div>
                ) : null}
                {reports.map((report) => (
                    <motion.div
                        key={report._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${report.targetType === 'Post' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                {report.targetType === 'Post' ? <FaFileAlt /> : <FaUser />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">{report.targetType} Report</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {report.status}
                                    </span>
                                </div>
                                <p className="text-white font-bold text-sm">{report.reason}</p>
                                <p className="text-white/60 text-xs italic mt-1">"{report.description}"</p>
                                <p className="text-white/40 text-[10px] mt-2">
                                    Reported by <span className="text-indigo-400">@{report.reporter?.username}</span> • {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {report.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => handleAction(report._id, 'resolved')}
                                        className="p-3 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                                        title="Mark as Resolved"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(report._id, 'dismissed')}
                                        className="p-3 bg-white/10 text-white/60 hover:bg-white/20 hover:text-white rounded-xl transition-all"
                                        title="Dismiss Report"
                                    >
                                        <FaTrash />
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ReportManagement;
