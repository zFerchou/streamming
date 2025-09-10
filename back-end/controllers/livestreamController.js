

let activeStreams = new Map();

exports.startStream = (req, res) => {
  const { userId, username } = req.body;
  if (!userId || !username) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }
  activeStreams.set(userId, { userId, username, startedAt: new Date() });
  res.json({ message: 'Transmisión iniciada' });
};

exports.stopStream = (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'Falta userId' });
  }
  activeStreams.delete(userId);
  res.json({ message: 'Transmisión detenida' });
};

exports.getActiveStreams = (req, res) => {
  res.json({ streams: Array.from(activeStreams.values()) });
};
