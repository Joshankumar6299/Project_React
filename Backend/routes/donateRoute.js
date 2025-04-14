const express = require('express');
const router = express.Router();
const { donateFood, getAllDonations, getUserDonations, updateDonationStatus } = require('../controllers/donateController.js');
const auth = require('../middlewares/auth.middleware.js');

// Public route - anyone can donate
router.post('/donate', donateFood);

// Protected routes - require authentication
router.get('/all', auth, getAllDonations);
router.get('/user', auth, getUserDonations);
router.patch('/status', auth, updateDonationStatus);

module.exports = router;