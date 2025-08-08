const router = require('express').Router();
const { 
  uploadVideo, 
  getAllVideos, 
  getVideoById, 
  saveMoment,
  getRecommendedVideos  // Ya estaba importado arriba, lo pongo aquí para claridad
} = require('../controllers/videoController');
const auth = require('../middleware/auth');

// Rutas específicas primero
router.get('/recommendations', auth, getRecommendedVideos);

// Luego rutas dinámicas
router.post('/upload', auth, uploadVideo);
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.post('/:id/moment', auth, saveMoment);

module.exports = router;