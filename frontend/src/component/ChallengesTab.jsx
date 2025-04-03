import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ChallengesTab = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/v1/challenges/generate-challenges", {
          credentials: "include",
        });
        const data = await response.json();
        setChallenges(data.challenges || []);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to load challenges!");
      }
    };
    fetchChallenges();
  }, []);

  const handleAcceptChallenge = async (challenge) => {
    try {
      const response = await fetch("http://localhost:5005/api/v1/challenges/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challenge: challenge.text }),
      });
      if (response.ok) toast.success("Challenge accepted!");
      else toast.error("Failed to accept challenge!");
    } catch (error) {
      console.error("Error accepting challenge:", error);
      toast.error("An error occurred!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generated Challenges</h2>
      <ul className="space-y-4">
        {challenges.map((challenge) => (
          <li
            key={challenge.text}
            className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm"
          >
            <p className="text-lg font-bold text-gray-900">{challenge.text}</p>
            <p className="text-gray-600">
              <strong>Objective:</strong> {challenge.objective}
            </p>
            <p className="text-gray-600">
              <strong>Motivation:</strong> {challenge.motivation}
            </p>
            <p className="text-gray-600">
              <strong>Benefits:</strong> {challenge.benefits.join(", ")}
            </p>
            <button
              onClick={() => handleAcceptChallenge(challenge)}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Accept Challenge
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengesTab;