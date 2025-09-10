const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('BODY RECIBIDO:', req.body);
    console.log('FILE RECIBIDO:', req.file);

    const updates = {};

    if (req.body.username !== undefined) updates.username = req.body.username;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.country !== undefined) updates.country = req.body.country;

    // Solo actualiza preferences si llega y es válido
    if (req.body.preferences) {
      try {
        const parsedPrefs = JSON.parse(req.body.preferences);
        updates.preferences = parsedPrefs;
      } catch (err) {
        console.error('Error parseando preferences:', err);
      }
    }

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ 
      message: 'Error al actualizar',
      error: error.message 
    });
  }
};