const Video = require('../models/Video');

exports.uploadVideo = async (req, res) => {
  const { title, description, tags } = req.body;
  const file = req.files?.video;
  const thumbnail = req.files?.thumbnail;

  if (!file) return res.status(400).json({ message: 'No video uploaded' });

  const videoPath = `uploads/videos/${Date.now()}_${file.name}`;
  await file.mv(videoPath);

  let thumbnailPath;
  if (thumbnail) {
    thumbnailPath = `uploads/thumbnails/${Date.now()}_${thumbnail.name}`;
    await thumbnail.mv(thumbnailPath);
  }

  const video = await Video.create({
    title,
    description,
    url: '/' + videoPath,
    thumbnail: thumbnailPath ? '/' + thumbnailPath : null,
    tags: tags?.split(','),
    owner: req.user.id,
  });

  res.status(201).json(video);
};

exports.getAllVideos = async (req, res) => {
  const videos = await Video.find().populate('owner', 'username avatar');
  res.json(videos);
};

exports.getVideoById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de video no válido' });
    }
    
    const video = await Video.findById(req.params.id).populate('owner', 'username');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveMoment = async (req, res) => {
  const { second } = req.body;
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $push: { moments: second } },
    { new: true }
  );
  res.json(video);
};

exports.getRecommendedVideos = async (req, res) => {
  try {
    // Lógica para obtener videos recomendados
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('owner', 'username');
    
    res.json({ recommendations: videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const mongoose = require('mongoose');

exports.getVideoById = async (req, res) => {
  // Validar que el ID sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID de video no válido' });
  }
  
  try {
    const video = await Video.findById(req.params.id).populate('owner', 'username');
    if (!video) return res.status(404).json({ message: 'Video no encontrado' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
