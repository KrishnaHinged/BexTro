import React from 'react'

const FeedbackCard = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
  >
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-semibold text-gray-900">{userName}</h4>
        <p className="text-sm text-gray-500">{timestamp}</p>
      </div>
      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
        {challengeName}
      </span>
    </div>
    <p className="text-gray-700">{feedback}</p>
  </motion.div>
  )
}

export default FeedbackCard
