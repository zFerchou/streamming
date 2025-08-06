const router = require('express').Router();
const { uploadVideo, getAllVideos, getVideoById, saveMoment } = require('../controllers/videoController');
const auth = require('../middleware/auth');

router.post('/upload', auth, uploadVideo);
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.post('/:id/moment', auth, saveMoment);

module.exports = router;
