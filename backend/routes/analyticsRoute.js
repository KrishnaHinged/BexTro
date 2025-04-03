// Backend (e.g., server.js or routes/analytics.js)
const express = require('express');
const router = express.Router();

// Sample analytics data (replace with real data from your database)
const getAnalyticsData = (range) => {
  return {
    users: {
      total: 5241,
      active: 4123,
      new: 245,
      growth: 12.5
    },
    activity: {
      daily: 3876,
      weekly: 24567,
      monthly: 98765,
      avgSession: '12m 34s'
    }
  };
};

// Define the analytics endpoint
router.get('/api/v1/analytics', (req, res) => {
  const { range } = req.query; // Get the 'range' query parameter (e.g., 'week')
  console.log(`Fetching analytics for range: ${range}`);

  try {
    const data = getAnalyticsData(range);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router;