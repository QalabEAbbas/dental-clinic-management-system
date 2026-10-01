const express = require('express');

const {
    getStats,
    getUpcoming
} = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', getStats);
router.get('/upcoming', getUpcoming);

module.exports = router;