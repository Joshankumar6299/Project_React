const express = require('express');
const router = express.Router();
const { donateFood } = require('../controllers/donateController.js');


router.post('/foodDonate', donateFood);

module.exports = router;