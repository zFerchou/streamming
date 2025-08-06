const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

module.exports = router;
