import React from "react";
import ChallengeCard from "./ChallengeCard.jsx";

const ChallengeList = ({ challenges, onComplete, onAbandon }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-white/80 mt-6 mb-6">Accepted Challenges</h2>
      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={index}
              challenge={challenge}
              index={index}
              onComplete={onComplete}
              onAbandon={onAbandon}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-lg">No challenges accepted yet!</p>
      )}
    </section>
  );
};

export default ChallengeList;