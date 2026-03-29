import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-2xl p-5 border border-white/50 animate-pulse flex flex-col gap-4 mb-6 break-inside-avoid">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-3 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
      <div className="h-20 bg-gray-200 rounded-xl w-full" />
      <div className="h-48 bg-gray-200 rounded-xl w-full" />
      <div className="flex gap-4 border-t border-gray-200 pt-3">
        <div className="h-4 bg-gray-300 rounded w-16" />
        <div className="h-4 bg-gray-300 rounded w-16" />
      </div>
    </div>
  );
};

export default SkeletonCard;
