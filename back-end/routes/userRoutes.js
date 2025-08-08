const express = require('express');
const router = express.Router(); // <-- Esta línea faltaba
const { getProfile, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configuración de multer para avatares
const upload = multer({ 
  dest: 'uploads/avatars/',
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});

// Ruta para obtener perfil
router.get('/me', auth, getProfile);

// Ruta para actualizar perfil
router.put('/me', 
  auth, // 1. Primero autenticación
  upload.single('avatar'), // 2. Luego procesar archivo
  updateProfile // 3. Finalmente controlador
);

module.exports = router;