import React from 'react';
import PropTypes from 'prop-types';

const VideoCard = ({ video, onLike }) => {
  // Validación de URLs
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Props con valores por defecto
  const {
    id,
    source = 'local',
    title = 'Sin título',
    url = null,
    hashtags = [],
    thumbnail = null,
    duration = '00:00',
    channelTitle = ''
  } = video;

  const renderVideoPlayer = () => {
    switch (source) {
      case 'youtube':
        return (
          <div className="video-embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`YouTube: ${title}`}
              loading="lazy"
            />
          </div>
        );
      
      case 'vimeo':
        return (
          <div className="video-embed">
            <iframe
              src={`https://player.vimeo.com/video/${id}`}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={`Vimeo: ${title}`}
              loading="lazy"
            />
          </div>
        );
      
      default:
        return (
          <div className="video-container">
            {thumbnail && isValidUrl(thumbnail) ? (
              <img 
                src={thumbnail} 
                alt={`Miniatura de ${title}`} 
                className="video-thumbnail"
                loading="lazy"
              />
            ) : (
              <div className="video-thumbnail-placeholder">
                <span>Miniatura no disponible</span>
              </div>
            )}
            
            {url && isValidUrl(url) ? (
              <video 
                src={url}
                controls
                poster={isValidUrl(thumbnail) ? thumbnail : undefined}
              >
                Tu navegador no soporta el elemento <code>video</code>.
              </video>
            ) : (
              <div className="video-unavailable">
                <p>Video no disponible</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="video-card">
      <div className="video-player">
        {renderVideoPlayer()}
        {duration && <span className="video-duration">{duration}</span>}
      </div>

      <div className="video-info">
        <h3 className="video-title">{title}</h3>
        {channelTitle && <p className="video-channel">{channelTitle}</p>}
        
        {hashtags.length > 0 && (
          <div className="video-tags">
            {hashtags.map(tag => (
              <span key={tag} className="video-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="video-actions">
          <button 
            className="like-button"
            onClick={() => onLike && onLike(id)}
            aria-label="Me gusta este video"
            disabled={!onLike}
          >
            <span role="img" aria-hidden="true">👍</span>
          </button>
        </div>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    source: PropTypes.oneOf(['youtube', 'vimeo', 'local']),
    title: PropTypes.string,
    url: PropTypes.string,
    hashtags: PropTypes.arrayOf(PropTypes.string),
    thumbnail: PropTypes.string,
    duration: PropTypes.string,
    channelTitle: PropTypes.string
  }).isRequired,
  onLike: PropTypes.func
};

VideoCard.defaultProps = {
  onLike: null
};

export default VideoCard;