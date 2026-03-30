import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setAuthUser } from "../redux/userSlice";

import MainSlideBar from "../components/layout/MainSlideBar.jsx";
import PageLoader from "../components/common/loaders/pagesLoader.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary";
import RewardPopup from "../components/features/posts/RewardPopup.jsx";

// Profile-specific components
import GamificationUI from "../components/features/profile/GamificationUI.jsx";
import ChallengesSection from "../components/features/profile/ChallengesSection.jsx";
import RequestsSection from "../components/features/profile/RequestsSection.jsx";
import ConnectionsSection from "../components/features/profile/ConnectionsSection.jsx";
import ProofModal from "../components/features/profile/ProofModal.jsx";
import Header from "../components/features/profile/Header.jsx";

const TABS = ["challenges", "requests", "connections"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("challenges");
  const [connectionRequests, setConnectionRequests] = useState({ received: [], sent: [] });
  const [connections, setConnections] = useState([]);
  const [completedPosts, setCompletedPosts] = useState([]);
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const dispatch = useDispatch();
  const { authUser, isAuthenticated } = useSelector((state) => state.user);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  const acceptedChallenges = authUser?.acceptedChallenges || [];

  // ─── Data Fetching ────────────────────────────────────────────────────────────

  const fetchProfileData = async () => {
    if (!authUser?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [profileRes, requestsRes, connectionsRes, postsRes] = await Promise.all([
        axios.get("http://localhost:5005/api/v1/user/profile", { withCredentials: true }),
        axios.get("http://localhost:5005/api/v1/user/connections/requests", { withCredentials: true }),
        axios.get("http://localhost:5005/api/v1/user/connections", { withCredentials: true }),
        axios.get(`http://localhost:5005/api/v1/posts/user/${authUser._id}`, { withCredentials: true }),
      ]);

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
    if (isAuthenticated && authUser) fetchProfileData();
  }, [authUser?._id, isAuthenticated]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleProofSuccess = (responseData) => {
    if (responseData.post) {
      setCompletedPosts((prev) => [responseData.post, ...prev]);
    }
    if (responseData.rewards) {
      setRewardData(responseData.rewards);
    }
    fetchProfileData();
    window.dispatchEvent(new Event("bextroFeedRefresh"));
  };

  const handleDropChallenge = async (challengeText) => {
    try {
      setActionLoading(true);
      await axios.post(
        "http://localhost:5005/api/v1/challenges/abandon",
        { challengeText },
        { withCredentials: true }
      );
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
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await axios.post(`http://localhost:5005/api/v1/user/${userId}/reject`, {}, { withCredentials: true });
      toast.success("Connection request rejected!");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to reject request!");
    }
  };

  const handleToggleVisibility = async (postId, currentVisibility) => {
    try {
      const newVisibility = currentVisibility === "public" ? "private" : "public";
      await axios.put(
        `http://localhost:5005/api/v1/posts/${postId}/visibility`,
        { visibility: newVisibility },
        { withCredentials: true }
      );
      toast.success(`Post is now ${newVisibility === "private" ? "Private" : "Public"}`);
      setCompletedPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, visibility: newVisibility } : post))
      );
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  // ─── Guards ───────────────────────────────────────────────────────────────────

  if (!isRehydrated) return <PageLoader message="Loading profile..." />;

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
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

  if (loading) return <PageLoader message="Preparing your profile..." />;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen  ">

        {/* SIDEBAR */}
        <MainSlideBar />

        <div className="flex-1 overflow-auto">

          {/* TOP BAR */}
          <div className="px-8 pt-6 grid grid-cols-3 gap-6">
            <div className="col-span-1 ">
              <Header user={authUser} connections={connections} />
            </div>
            <div className="col-span-2">
              <GamificationUI user={authUser} score={authUser.score || 0} />
            </div>

          </div>

          {/* MAIN TABS */}
          <div className="px-8 mt-6 flex gap-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`px-5 py-2 rounded-full font-semibold capitalize transition ${activeTab === tab
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="px-8 mt-8">

            {activeTab === "challenges" && (
              <div className="space-y-6">
                <ChallengesSection
                  acceptedChallenges={acceptedChallenges}
                  completedPosts={completedPosts}
                  actionLoading={actionLoading}
                  onRequestProof={setSelectedChallenge}
                  onDrop={handleDropChallenge}
                  onToggleVisibility={handleToggleVisibility}
                />
              </div>
            )}

            {activeTab === "requests" && (
              <div className="max-w-3xl">
                <RequestsSection
                  requests={connectionRequests}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              </div>
            )}

            {activeTab === "connections" && (
              <div className="max-w-4xl">
                <ConnectionsSection connections={connections} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Proof Submission Modal */}
      {selectedChallenge && (
        <ProofModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onSuccess={handleProofSuccess}
        />
      )}

      {/* Reward Popup */}
      {rewardData && (
        <RewardPopup
          rewards={rewardData}
          onClose={() => {
            setRewardData(null);
            fetchProfileData();
          }}
        />
      )}
    </ErrorBoundary>
  );
};

export default Profile;