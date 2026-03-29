import React, { useState } from 'react';
import axios from 'axios';

const ProofUploadModal = ({ challengeText, onClose, onSuccess }) => {
    const [proofType, setProofType] = useState('image');
    const [file, setFile] = useState(null);
    const [proofUrl, setProofUrl] = useState('');
    const [timelineTaken, setTimelineTaken] = useState(1);
    const [loading, setLoading] = useState(false);
    const [visibility, setVisibility] = useState('public');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('challengeText', challengeText);
            formData.append('proofType', proofType);
            formData.append('timelineTaken', timelineTaken);
            formData.append('visibility', visibility);
            
            if (proofType === 'image' || proofType === 'video') {
                if (!file) {
                    setError('Please select a file to upload or switch to link mode.');
                    setLoading(false);
                    return;
                }
                formData.append('proofFile', file);
            } else {
                if (!proofUrl) {
                    setError('Please enter a valid URL.');
                    setLoading(false);
                    return;
                }
                formData.append('proofUrl', proofUrl);
            }

            const res = await axios.post('http://localhost:5005/api/v1/posts/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            onSuccess(res.data.post);
        } catch (err) {
            console.error("Upload error", err);
            setError(err.response?.data?.message || 'Failed to upload proof');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white/95 border border-white/40 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <h3 className="text-3xl font-extrabold text-indigo-600 mb-2 tracking-tight">Complete Challenge 🏆</h3>
                <p className="text-gray-600 font-medium italic mb-6">"{challengeText}"</p>
                
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-semibold border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-gray-700 font-semibold text-sm mb-2 block pl-1">Proof Type</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm font-medium"
                            value={proofType}
                            onChange={(e) => setProofType(e.target.value)}
                        >
                            <option value="image">Image Upload</option>
                            <option value="video">Video Upload</option>
                            <option value="link">GitHub / Project Link</option>
                            <option value="blog">Blog / Article</option>
                        </select>
                    </div>

                    {(proofType === 'image' || proofType === 'video') ? (
                        <div>
                            <label className="text-gray-700 font-semibold text-sm mb-2 block pl-1">Upload File</label>
                            <input 
                                type="file" 
                                accept={proofType === 'image' ? 'image/*' : 'video/*'}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 file:btn file:btn-sm file:btn-indigo file:mr-4 file:text-indigo-700 file:bg-indigo-100 file:border-none hover:file:bg-indigo-200 transition-all font-medium shadow-sm"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="text-gray-700 font-semibold text-sm mb-2 block pl-1">Paste Link</label>
                            <input 
                                type="url" 
                                placeholder="https://..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm font-medium"
                                value={proofUrl}
                                onChange={(e) => setProofUrl(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-gray-700 font-semibold text-sm mb-2 block pl-1">Timeline Taken (Days)</label>
                        <input 
                            type="number" 
                            min="1"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm font-extrabold"
                            value={timelineTaken}
                           onChange={(e) => setTimelineTaken(Number(e.target.value))}
                        />
                    </div>

                    <div className="bg-indigo-50/30 p-5 rounded-3xl border border-indigo-100/50 shadow-sm">
                        <label className="text-indigo-900 font-bold text-sm mb-4 block pl-1 flex items-center gap-2">
                           Post Visibility <span className="text-base">🔐</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setVisibility('public')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${visibility === 'public' ? 'border-indigo-500 bg-white shadow-md ring-4 ring-indigo-50 scale-[1.02]' : 'border-transparent bg-white/40 text-gray-400 hover:bg-white/60 hover:scale-[1.01]'}`}
                            >
                                <span className={`text-2xl transition-transform duration-300 ${visibility === 'public' ? 'scale-110' : ''}`}>🌐</span>
                                <div className="text-center">
                                    <span className={`block text-xs font-black uppercase tracking-tight ${visibility === 'public' ? 'text-indigo-600' : 'text-gray-400'}`}>Public Feed</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Everyone can see</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibility('private')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${visibility === 'private' ? 'border-indigo-500 bg-white shadow-md ring-4 ring-indigo-50 scale-[1.02]' : 'border-transparent bg-white/40 text-gray-400 hover:bg-white/60 hover:scale-[1.01]'}`}
                            >
                                <span className={`text-2xl transition-transform duration-300 ${visibility === 'private' ? 'scale-110' : ''}`}>🔒</span>
                                <div className="text-center">
                                    <span className={`block text-xs font-black uppercase tracking-tight ${visibility === 'private' ? 'text-indigo-600' : 'text-gray-400'}`}>Only Me</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Private archive</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-white hover:bg-gray-50 text-gray-600 font-bold px-6 py-3 rounded-xl border border-gray-200 shadow-sm transition-all flex-1"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md flex-1 flex justify-center items-center gap-2 ${loading && 'opacity-70 cursor-not-allowed transform-none'}`}
                        >
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Submit Proof'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProofUploadModal;
