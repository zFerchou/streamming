// routes/intelligentRoutes.js
const express = require('express');
const router = express.Router();
const { getYoutubeVideos } = require('../services/youtubeService');
const User = require('../models/User');

// Recomendaciones basadas en hashtags
router.get('/recommendations', async (req, res) => {
  try {
    const userId = req.user.id; // Asume autenticación JWT
    const user = await User.findById(userId).populate('preferences.hashtags');
    
    // 1. Obtener hashtags favoritos del usuario
    const userHashtags = user.preferences.hashtags;
    
    // 2. Buscar en YouTube (ejemplo: API v3)
    const youtubeResults = await getYoutubeVideos({
      q: userHashtags.join('|'),
      maxResults: 10
    });

    // 3. Filtrar y mezclar con videos locales
    const recommendations = [...youtubeResults];
    
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ¡Esta exportación es obligatoria!
module.exports = router;