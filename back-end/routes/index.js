// Archivo: backend/routes/index.js

const express = require('express');
const router = express.Router();

// importar rutas específicas
const authRoutes = require('./authRoutes');
const userRoutes = require('./user.routes');
const videoRoutes = require('./video.routes');
const mlRoutes = require('./ml.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/videos', videoRoutes);
router.use('/ml', mlRoutes);

module.exports = router;
