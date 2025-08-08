const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      username: req.body.username,
      description: req.body.description,
      country: req.body.country,
      preferences: JSON.parse(req.body.preferences) // Parsea el JSON
    };

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error al actualizar',
      error: error.message 
    });
  }
};
