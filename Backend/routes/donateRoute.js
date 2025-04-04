const express = require('express');
const router = express.Router();

router.post('/donate', (req, res) => {
    res.send('donate');
});

module.exports = router;