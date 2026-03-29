import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setAuthUser } from "../../redux/userSlice";
import MainSlideBar from "../component/main_SlideBar.jsx";
import PageLoader from "../component/pagesLoader.jsx";
import ErrorBoundary from "../component/ErrorBoundary";
import { getProfilePhoto } from "../utils/getProfilePhoto";

const Profile = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("challenges");
  const [connectionRequests, setConnectionRequests] = useState({ received: [], sent: [] });
  const [connections, setConnections] = useState([]);
  const [completedPosts, setCompletedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const dispatch = useDispatch();
  const { authUser, isAuthenticated } = useSelector((state) => state.user);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  console.log("Profile: Rendering, authUser =", authUser, "isAuthenticated =", isAuthenticated, "isRehydrated =", isRehydrated);

  const userName = authUser?.fullName || "Anonymous";
  const acceptedChallenges = authUser?.acceptedChallenges || [];
  const stats = authUser?.stats || { totalAccepted: 0, totalSkipped: 0, totalCompleted: 0 };

  const fetchProfileData = async () => {
    if (!authUser?._id) {
      console.log("No user ID available, skipping fetch");
      setLoading(false);
      return;
    }

    console.log("Fetching profile data for user:", authUser._id);
    try {
      setLoading(true);
      const [profileRes, requestsRes, connectionsRes, postsRes] = await Promise.all([
        axios.get("http://localhost:5005/api/v1/user/profile", { withCredentials: true }),
        axios.get("http://localhost:5005/api/v1/user/connections/requests", { withCredentials: true }),
        axios.get("http://localhost:5005/api/v1/user/connections", { withCredentials: true }),
        axios.get(`http://localhost:5005/api/v1/posts/user/${authUser._id}`, { withCredentials: true })
      ]);

      console.log("Profile data fetched successfully");
      dispatch(setAuthUser(profileRes.data));
      setConnectionRequests(requestsRes.data);
      setConnections(connectionsRes.data);
      setCompletedPosts(postsRes.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setStep(2), 3000);

    if (isAuthenticated && authUser) {
      fetchProfileData();
    } else {
      console.log("User not authenticated or authUser not available");
      setLoading(false);
    }

    return () => clearTimeout(timer);
  }, [dispatch, authUser?._id, isAuthenticated]);

  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [proofType, setProofType] = useState("image");
  const [proofFile, setProofFile] = useState(null);
  const [proofText, setProofText] = useState("");
  const [proofURL, setProofURL] = useState("");
  const [proofDescription, setProofDescription] = useState("");
  const [proofPreview, setProofPreview] = useState("");
  const [proofSubmitting, setProofSubmitting] = useState(false);

  const resetProofModal = () => {
    setProofType("image");
    setProofFile(null);
    setProofText("");
    setProofURL("");
    setProofDescription("");
    setProofPreview("");
    setSelectedChallenge(null);
  };

  const openProofModal = (challenge) => {
    setSelectedChallenge(challenge);
    setProofModalOpen(true);
    setProofType("image");
    setProofFile(null);
    setProofText("");
    setProofURL("");
    setProofDescription("");
    setProofPreview("");
  };

  const closeProofModal = () => {
    setProofModalOpen(false);
    resetProofModal();
  };

  const onProofFileChange = (e) => {
    const file = e.target.files[0];
    setProofFile(file);
    if (file) {
      setProofPreview(URL.createObjectURL(file));
    } else {
      setProofPreview("");
    }
  };

  const handleProofSubmit = async () => {
    if (!selectedChallenge) return toast.error("Select a challenge first.");

    const challengeText = selectedChallenge.challengeText || selectedChallenge.text;
    if (!challengeText) return toast.error("Invalid challenge data.");

    if (!proofDescription.trim()) {
      return toast.error("Please include a description of your proof.");
    }

    if (proofType === "image" || proofType === "video") {
      if (!proofFile) {
        return toast.error("Please upload an image or video proof file.");
      }
    } else if (proofType === "blog") {
      if (!proofText.trim()) {
        return toast.error("Blog content is required for blog proof.");
      }
    } else if (proofType === "link") {
      if (!proofURL.trim() || !/^https?:\/\//.test(proofURL.trim())) {
        return toast.error("A valid URL is required for link proof.");
      }
    }

    try {
      setProofSubmitting(true);

      const formData = new FormData();
      formData.append("challengeText", challengeText);
      if (selectedChallenge._id) formData.append("challengeId", selectedChallenge._id);
      formData.append("proofType", proofType);
      formData.append("description", proofDescription.trim());
      formData.append("timelineTaken", selectedChallenge.timelineDays || 0);

      if (proofType === "image" || proofType === "video") {
        formData.append("proofFile", proofFile);
      } else if (proofType === "blog") {
        formData.append("proofUrl", proofText.trim());
      } else if (proofType === "link") {
        formData.append("proofUrl", proofURL.trim());
      }

      const response = await axios.post("http://localhost:5005/api/v1/posts/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Challenge proof submitted and post created!");
        closeProofModal();
        await fetchProfileData();
        window.dispatchEvent(new Event("bextroFeedRefresh"));
      } else {
        toast.error(response.data?.message || "Failed to submit proof");
      }
    } catch (error) {
      console.error("Proof submission error", error);
      toast.error("Failed to submit proof. Please try again.");
    } finally {
      setProofSubmitting(false);
    }
  };

  const handleDropChallenge = async (challengeText) => {
    try {
      setActionLoading(true);
      await axios.post("http://localhost:5005/api/v1/challenges/abandon", { challengeText }, { withCredentials: true });
      toast.success("Challenge dropped successfully");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to abandon challenge");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await axios.post(`http://localhost:5005/api/v1/user/${userId}/accept`, {}, { withCredentials: true });
      toast.success("Connection request accepted!");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to accept request!");
      console.error(error);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await axios.post(`http://localhost:5005/api/v1/user/${userId}/reject`, {}, { withCredentials: true });
      toast.success("Connection request rejected!");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to reject request!");
      console.error(error);
    }
  };

  if (!isRehydrated) {
    return <PageLoader message="Loading profile..." />;
  }

  if (!isAuthenticated || !authUser) {
    console.log("User not authenticated, showing login prompt");
    return (
      <div className="min-h-screen bg-transparent relative flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <a href="/signin" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Sign In
          </a>
        </div>
      </div>
    );
  }
  if (loading || step !== 2) {
    return <PageLoader message="Preparing your profile..." />;
  }
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen text-white">
        <MainSlideBar />

        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white/90 mb-2">
                {userName}'s Profile
              </h1>
              <p className="text-white/60">Track your progress and connections</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">
                  {stats.totalCompleted}
                </div>
                <div className="text-sm text-white/60">Completed</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/60 p-1.5 rounded-full border w-full max-w-md mb-6">
            <button
              className={`flex-1 py-2.5 rounded-full ${activeTab === "challenges" ? "bg-indigo-500 text-white" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("challenges")}
            >
              Challenges
            </button>

            <button
              className={`flex-1 py-2.5 rounded-full ${activeTab === "requests" ? "bg-indigo-500 text-white" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("requests")}
            >
              Requests
            </button>

            <button
              className={`flex-1 py-2.5 rounded-full ${activeTab === "connections" ? "bg-indigo-500 text-white" : "text-gray-500"
                }`}
              onClick={() => setActiveTab("connections")}
            >
              Connections
            </button>
          </div>

          {activeTab === "challenges" && (
            <ChallengesSection
              acceptedChallenges={acceptedChallenges}
              completedPosts={completedPosts}
              actionLoading={actionLoading}
              onRequestProof={openProofModal}
              onDrop={handleDropChallenge}
            />
          )}

          {activeTab === "requests" && (
            <RequestsSection
              requests={connectionRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          )}

          {activeTab === "connections" && (
            <ConnectionsSection connections={connections} />
          )}

          {proofModalOpen && selectedChallenge && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white/90 dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full p-6 relative">
                <button
                  onClick={closeProofModal}
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                  aria-label="Close proof modal"
                >
                  ✕
                </button>
                <h2 className="text-lg font-bold mb-4 text-slate-900">Submit Proof for:&nbsp;
                  <span className="text-indigo-600">{selectedChallenge.challengeText || selectedChallenge.text}</span>
                </h2>

                <div className="flex gap-2 mb-4">
                  {['image', 'video', 'blog', 'link'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setProofType(type); setProofFile(null); setProofText(''); setProofURL(''); setProofPreview(''); }}
                      className={`px-4 py-2 rounded-lg font-semibold ${proofType === type ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  {(proofType === 'image' || proofType === 'video') && (
                    <>
                      <label className="block text-sm font-semibold text-slate-700">Upload {proofType === 'image' ? 'Image' : 'Video'} Proof</label>
                      <input type="file" accept={proofType === 'image' ? 'image/*' : 'video/*'} onChange={onProofFileChange} className="block w-full border border-gray-200 rounded-lg p-2" />
                      {proofPreview && (
                        <div className="mt-2">
                          {proofType === 'image' ? (
                            <img src={proofPreview} alt="preview" className="max-h-52 w-full object-cover rounded-lg" />
                          ) : (
                            <video controls src={proofPreview} className="max-h-52 w-full rounded-lg" />
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {proofType === 'blog' && (
                    <>
                      <label className="block text-sm font-semibold text-slate-700">Blog proof (text)</label>
                      <textarea
                        value={proofText}
                        onChange={(e) => setProofText(e.target.value)}
                        rows={6}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-indigo-300"
                        placeholder="Share what you did and include key insights..."
                      />
                    </>
                  )}

                  {proofType === 'link' && (
                    <>
                      <label className="block text-sm font-semibold text-slate-700">Project link (GitHub / live demo / docs)</label>
                      <input
                        type="url"
                        value={proofURL}
                        onChange={(e) => setProofURL(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-indigo-300"
                      />
                    </>
                  )}

                  <label className="block text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    value={proofDescription}
                    onChange={(e) => setProofDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-indigo-300"
                    placeholder="Explain what you completed and include outcome details."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeProofModal}
                    className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProofSubmit}
                    disabled={proofSubmitting}
                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {proofSubmitting ? 'Submitting...' : 'Submit Proof & Post'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
const ChallengesSection = ({ acceptedChallenges, completedPosts, onRequestProof, onDrop, actionLoading }) => {
  const [subTab, setSubTab] = useState("ongoing");

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-white/20 pb-4">
        <button
          className={`pb-2 font-bold px-2 ${subTab === 'ongoing' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-white/60'}`}
          onClick={() => setSubTab('ongoing')}
        >
          Ongoing ({acceptedChallenges.filter(c => c.status === 'active').length})
        </button>
        <button
          className={`pb-2 font-bold px-2 ${subTab === 'completed' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-white/60'}`}
          onClick={() => setSubTab('completed')}
        >
          Completed ({completedPosts.length})
        </button>
      </div>

      {subTab === "ongoing" ? (
        <div className="grid gap-4">
          {acceptedChallenges.filter(c => c.status === 'active').map((challenge, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white/90 mb-2">{challenge.challengeText}</h3>
                  <p className="text-white/60 text-sm">Started {new Date(challenge.acceptedAt).toLocaleDateString()}</p>
                  <p className="text-indigo-400 text-sm font-semibold mt-1">
                    Timeline: {challenge.timelineDays} days
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-400">
                    {Math.max(0, challenge.timelineDays - Math.floor((Date.now() - new Date(challenge.acceptedAt)) / (1000 * 60 * 60 * 24)))} days left
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((Date.now() - new Date(challenge.acceptedAt)) / (challenge.timelineDays * 24 * 60 * 60 * 1000)) * 100)}%`
                  }}
                ></div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => onRequestProof(challenge)}
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                >
                  Submit Proof
                </button>
                <button
                  onClick={() => onDrop(challenge.challengeText)}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                >
                  Drop
                </button>
              </div>
            </div>
          ))}
          {acceptedChallenges.filter(c => c.status === 'active').length === 0 && (
            <div className="text-center text-white/60 py-12">
              No ongoing challenges. Start a new one!
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {completedPosts.map((post) => (
            <div key={post._id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white/90 mb-2">{post.challengeText}</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Completed on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  {post.proofType === 'image' && (
                    <img
                      src={`http://localhost:5005${post.proofUrl}`}
                      alt="Proof"
                      className="w-full max-w-md h-48 object-cover rounded-xl border border-white/20"
                    />
                  )}
                  {post.proofType === 'video' && (
                    <video controls src={`http://localhost:5005${post.proofUrl}`} className="w-full max-w-md h-48 rounded-xl border border-white/20" />
                  )}
                  {post.proofType === 'link' && (
                    <a
                      href={post.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      View Proof Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {completedPosts.length === 0 && (
            <div className="text-center text-white/60 py-12">
              No completed challenges yet. Keep pushing!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RequestsSection = ({ requests, onAccept, onReject }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white/90 mb-4">Received Requests ({requests.received.length})</h2>
        <div className="space-y-3">
          {requests.received.map((user) => (
            <div key={user._id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={getProfilePhoto(user.profilePhoto, user.username)}
                  alt="avatar"
                  className="w-12 h-12 rounded-full bg-black/20 object-cover"
                />
                <div>
                  <h4 className="text-white/90 font-bold">{user.fullName}</h4>
                  <span className="text-white/60 text-sm">@{user.username}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(user._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(user._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {requests.received.length === 0 && (
            <div className="text-center text-white/60 py-8">
              No pending requests
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white/90 mb-4">Sent Requests ({requests.sent.length})</h2>
        <div className="space-y-3">
          {requests.sent.map((user) => (
            <div key={user._id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center">
              <img
                src={getProfilePhoto(user.profilePhoto, user.username)}
                alt="avatar"
                className="w-12 h-12 rounded-full bg-black/20 mr-3 object-cover"
              />
              <div>
                <h4 className="text-white/90 font-bold">{user.fullName}</h4>
                <span className="text-white/60 text-sm">@{user.username} - Pending</span>
              </div>
            </div>
          ))}
          {requests.sent.length === 0 && (
            <div className="text-center text-white/60 py-8">
              No sent requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConnectionsSection = ({ connections }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white/90 mb-6">
        Your Connections ({connections.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((user) => (
          <div key={user._id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center gap-3">
            <img
              src={getProfilePhoto(user.profilePhoto, user.username)}
              alt="avatar"
              className="w-16 h-16 rounded-full bg-black/20 object-cover"
            />
            <div>
              <h4 className="text-white/90 font-bold">{user.fullName}</h4>
              <span className="text-white/60 text-sm">@{user.username}</span>
            </div>
          </div>
        ))}
        {connections.length === 0 && (
          <div className="col-span-full text-center text-white/60 py-12">
            No connections yet. Start connecting with others!
          </div>
        )}
      </div>
    </div>
  ); // ✅ THIS WAS MISSING
};

export default Profile;