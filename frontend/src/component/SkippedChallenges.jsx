import React from "react";

const SkippedChallenges = ({ skippedCount }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-white/80 mb-6">Skipped Challenges</h2>
      <div className="p-6 bg-white/80 rounded-xl shadow-md border border-gray-100">
        <p className="text-gray-700 text-lg">
          Total Skipped: <span className="font-bold text-indigo-600">{skippedCount}</span>
        </p>
      </div>
    </section>
  );
};

export default SkippedChallenges;