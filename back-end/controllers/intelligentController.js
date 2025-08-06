// Solo ejemplo simulado
exports.getRecommendations = (req, res) => {
  res.json({
    recommendations: [
      { title: 'Video recomendado 1', id: 'abc123' },
      { title: 'Video recomendado 2', id: 'xyz456' }
    ]
  });
};
