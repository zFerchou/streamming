const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { username, description, country } = req.body;
  const avatar = req.files?.avatar;
  let avatarPath;

  if (avatar) {
    const path = `uploads/avatars/${Date.now()}_${avatar.name}`;
    await avatar.mv(path);
    avatarPath = '/' + path;
  }

  const updateData = { username, description, country };
  if (avatarPath) updateData.avatar = avatarPath;

  const updated = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
  res.json(updated);
};
