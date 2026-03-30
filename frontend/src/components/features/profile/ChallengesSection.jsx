import { useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiGlobe } from "react-icons/fi";
const ChallengesSection = ({
  acceptedChallenges,
  completedPosts,
  onRequestProof,
  onDrop,
  onToggleVisibility,
  actionLoading,
}) => {
  const [subTab, setSubTab] = useState("ongoing");
  const ongoingChallenges = acceptedChallenges.filter((c) => c.status === "active");

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-4 border-b border-white/20 pb-4">
        <button
          className={`pb-2 font-bold px-2 ${
            subTab === "ongoing" ? "text-indigo-800 border-b-2 border-indigo-400" : "text-white/60"
          }`}
          onClick={() => setSubTab("ongoing")}
        >
          Ongoing ({ongoingChallenges.length})
        </button>
        <button
          className={`pb-2 font-bold px-2 ${
            subTab === "completed" ? "text-indigo-800 border-b-2 border-indigo-400" : "text-white/60"
          }`}
          onClick={() => setSubTab("completed")}
        >
          Completed ({completedPosts.length})
        </button>
      </div>

      {subTab === "ongoing" ? (
        <div className="grid gap-4">
          {ongoingChallenges.map((challenge, index) => {
            const elapsed = Math.floor(
              (Date.now() - new Date(challenge.acceptedAt)) / (1000 * 60 * 60 * 24)
            );
            const daysLeft = Math.max(0, challenge.timelineDays - elapsed);
            const progress = Math.min(
              100,
              (elapsed / challenge.timelineDays) * 100
            );

            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white/90 mb-2">{challenge.challengeText}</h3>
                    <p className="text-white/60 text-sm">
                      Started {new Date(challenge.acceptedAt).toLocaleDateString()}
                    </p>
                    <p className="text-indigo-400 text-sm font-semibold mt-1">
                      Timeline: {challenge.timelineDays} days
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-400">{daysLeft} days left</div>
                  </div>
                </div>

                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
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
            );
          })}

          {ongoingChallenges.length === 0 && (
            <div className="text-center text-white/60 py-12">No ongoing challenges. Start a new one!</div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {completedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white/90">{post.challengeText}</h3>
                   <button
  onClick={() => onToggleVisibility(post._id, post.visibility)}
  className="relative w-[110px] h-[30px] rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center px-1 transition-all duration-300 active:scale-95"
>
  {/* Background */}
  <div
    className={`absolute inset-0 rounded-full transition-all duration-500 ${
      post.visibility !== "private"
        ? "bg-indigo-500/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.6)]"
        : "bg-slate-800/40"
    }`}
  />

  {/* Sliding Knob */}
  <motion.div
    layout
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className={`relative z-10 w-1/2 h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold uppercase tracking-wider ${
      post.visibility !== "private"
        ? "ml-auto bg-indigo-500 text-white"
        : "bg-slate-900 text-slate-300"
    }`}
  >
    {post.visibility !== "private" ? "Public" : "Only Me"}
  </motion.div>

  {/* Background Labels */}
  <div className="absolute inset-0 flex justify-between items-center px-3 text-[8px] font-semibold uppercase tracking-wider text-white/30">
    <span>Private</span>
    <span>Public</span>
  </div>
</button>
                  </div>

                  <p className="text-white/60 text-sm mb-3">
                    Completed on {new Date(post.createdAt).toLocaleDateString()}
                  </p>

                  {post.description && (
                    <p className="text-white/80 text-sm italic bg-white/5 p-3 rounded-xl mb-4 border border-white/5">
                      "{post.description}"
                    </p>
                  )}

                  {post.proofType === "image" && (
                    <img
                      src={`http://localhost:5005${post.proofUrl}`}
                      alt="Proof"
                      className="w-full max-w-md h-48 object-cover rounded-xl border border-white/20"
                    />
                  )}
                  {post.proofType === "video" && (
                    <video
                      controls
                      src={`http://localhost:5005${post.proofUrl}`}
                      className="w-full max-w-md h-48 rounded-xl border border-white/20"
                    />
                  )}
                  {post.proofType === "link" && (
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
            <div className="text-center text-white/60 py-12">No completed challenges yet. Keep pushing!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengesSection;