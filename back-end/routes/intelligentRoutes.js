const router = require('express').Router();
const { getRecommendations } = require('../controllers/intelligentController');
const auth = require('../middleware/auth');

router.get('/recommendations', auth, getRecommendations);

module.exports = router;
