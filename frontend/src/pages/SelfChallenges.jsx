import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setAuthUser, addFeedback } from "../../redux/userSclice"; // Import addFeedback
import MainSlideBar from "../component/main_SlideBar.jsx";
import PageLoader from "../component/pagesLoader.jsx";
import Score from "../component/score.jsx";
import ChallengeList from "../component/ChallengeList.jsx";
import SkippedChallenges from "../component/SkippedChallenges.jsx";
import ShareButton from "../component/ShareButton.jsx";
import FeedbackModal from "../component/FeedbackModal.jsx";

const FeedbackCard = ({ feedback, userName, timestamp, challengeText }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-white/90">{userName}</h4>
          <p className="text-sm text-white/60">{timestamp}</p>
        </div>
        <span className="text-xs bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded-full">
          {challengeText.substring(0, 20)}...
        </span>
      </div>
      <p className="text-white/80">{feedback}</p>
    </div>
  );
};

const SelfChallenges = () => {
  const [step, setStep] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [feedback, setFeedback] = useState("");

  const dispatch = useDispatch();
  const { authUser, isAuthenticated, feedbackList } = useSelector((state) => state.user);

  // Extract user data from authUser
  const userName = authUser?.name || "Anonymous";
  const acceptedChallenges = authUser?.acceptedChallenges || [];
  const stats = authUser?.stats || { totalAccepted: 0, totalSkipped: 0 };
  const skippedCount = stats.totalSkipped;
  const score = stats.totalAccepted * 10;

  useEffect(() => {
    const timer = setTimeout(() => setStep(2), 3000);
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5005/api/v1/user/profile", {
          withCredentials: true,
        });
        dispatch(setAuthUser(res.data)); // Update Redux store with user data
      } catch (error) {
        toast.error("Failed to load profile data!");
        console.error("Error fetching profile:", error);
      }
    };
    fetchData();
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleCompleted = async (challenge, index) => {
    try {
      await axios.post(
        "http://localhost:5005/api/v1/challenges/complete",
        { challengeText: challenge.challengeText },
        { withCredentials: true }
      );
      setCurrentChallenge({ challenge, index });
      setShowFeedback(true);
      toast.success("Challenge completed! Please share your experience.");
    } catch (error) {
      toast.error("Failed to complete challenge!");
      console.error("Error completing challenge:", error);
    }
  };

  const handleAboard = async (challenge, index) => {
    try {
      await axios.post(
        "http://localhost:5005/api/v1/challenges/aboard",
        { challengeText: challenge.challengeText },
        { withCredentials: true }
      );
      const updatedChallenges = acceptedChallenges.filter((_, i) => i !== index);
      dispatch(setAuthUser({
        ...authUser,
        acceptedChallenges: updatedChallenges,
      }));
      toast.success("Challenge abandoned!");
    } catch (error) {
      toast.error("Failed to abandon challenge!");
      console.error("Error abandoning challenge:", error);
    }
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      const feedbackData = {
        feedback: feedback,
        userName: userName,
        timestamp: new Date().toLocaleString(),
        challengeText: currentChallenge.challenge.challengeText,
      };
      dispatch(addFeedback(feedbackData)); // Add feedback to Redux store
      
      const updatedChallenges = acceptedChallenges.filter((_, i) => i !== currentChallenge.index);
      dispatch(setAuthUser({
        ...authUser,
        acceptedChallenges: updatedChallenges,
        stats: {
          ...stats,
          totalAccepted: stats.totalAccepted + 1,
        },
      }));
      
      setShowFeedback(false);
      setFeedback("");
      toast.success("Thanks for your feedback!");
    } else {
      toast.error("Feedback cannot be empty!");
    }
  };

  return (
    <div className="flex min-h-screen ">
      {step === 1 && <PageLoader message="Challenges..." />}
      {step === 2 && isAuthenticated && (
        <>
          <MainSlideBar />
          <div className="flex-1 p-8 overflow-auto">
            <h1 className="text-4xl font-extrabold text-white/80 mb-8 tracking-tight">
              My Challenges
            </h1>

            <Score score={score} />
            <ChallengeList
              challenges={acceptedChallenges}
              onComplete={handleCompleted}
              onAbandon={handleAboard}
            />

            {feedbackList.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white/80 mb-4">Feedback History</h2>
                <div className="space-y-4">
                  {feedbackList.map((item, index) => (
                    <FeedbackCard
                      key={index}
                      feedback={item.feedback}
                      userName={item.userName}
                      timestamp={item.timestamp}
                      challengeText={item.challengeText}
                    />
                  ))}
                </div>
              </div>
            )}

            <SkippedChallenges skippedCount={skippedCount} />
            <ShareButton />

            <FeedbackModal
              show={showFeedback}
              feedback={feedback}
              setFeedback={setFeedback}
              onSubmit={submitFeedback}
              onCancel={() => setShowFeedback(false)}
              challengeName={currentChallenge?.challenge.challengeText || ""}
              userName={userName}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SelfChallenges;