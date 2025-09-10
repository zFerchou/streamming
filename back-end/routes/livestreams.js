// routes/livestreams.js
const express = require('express');
const router = express.Router();
const livestreamController = require('../controllers/livestreamController');

router.post('/start', livestreamController.startStream);
router.post('/stop', livestreamController.stopStream);
router.get('/active', livestreamController.getActiveStreams);

module.exports = router;
