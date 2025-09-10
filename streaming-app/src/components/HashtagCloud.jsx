import React from 'react';

const HashtagCloud = ({ hashtags, selectedHashtags, onToggle }) => {
  // Contar cuántas veces aparece cada hashtag (puede repetirse)
  const hashtagCounts = hashtags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  // Ordenar hashtags por frecuencia, del más frecuente al menos, y tomar máximo 20
  const sortedHashtags = Object.keys(hashtagCounts)
    .sort((a, b) => hashtagCounts[b] - hashtagCounts[a])
    .slice(0, 20);

  // Estilos para el contenedor de hashtags
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    margin: '1rem 0'
  };

  // Estilos para cada hashtag, cambia color si está seleccionado
  const tagStyle = (tag) => ({
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    background: selectedHashtags.includes(tag) ? '#ff0000' : '#f5f5f5',
    color: selectedHashtags.includes(tag) ? 'white' : 'inherit',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: `${Math.min(hashtagCounts[tag] * 0.1 + 0.8, 1.2)}rem`,
    margin: '0.2rem'
  });

  // Estilos para el conteo que aparece junto al hashtag
  const countStyle = {
    fontSize: '0.7em',
    opacity: 0.7,
    marginLeft: '3px'
  };

  return (
    <div style={containerStyle}>
      {sortedHashtags.map(tag => (
        <button
          key={tag}
          type="button"
          onClick={() => onToggle(tag)}
          style={tagStyle(tag)}
        >
          {tag} <span style={countStyle}>({hashtagCounts[tag]})</span>
        </button>
      ))}
    </div>
  );
};

export default HashtagCloud;
