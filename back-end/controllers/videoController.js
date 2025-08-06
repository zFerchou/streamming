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
  const video = await Video.findById(req.params.id).populate('owner', 'username');
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json(video);
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
