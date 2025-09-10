import React from 'react';
import PropTypes from 'prop-types';
import { Heart, Clock } from 'lucide-react';

const VideoCard = ({ video, onLike, isAuthenticated, onVideoClick }) => {
  const handleClick = () => {
    if (onVideoClick) {
      onVideoClick(video);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onLike) {
      onLike(video.id);
    }
  };

  // Formatear la duración del video (convertir de segundos o formato ISO a MM:SS)
  const formatDuration = (duration) => {
    if (!duration) return '00:00';
    
    // Si ya está en formato MM:SS o HH:MM:SS
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // Si es un número (segundos)
    if (typeof duration === 'number') {
      const mins = Math.floor(duration / 60);
      const secs = Math.floor(duration % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return '00:00';
  };

  // Props con valores por defecto
  const {
    id,
    title = 'Sin título',
    thumbnail = null,
    duration = '00:00',
    channelTitle = '',
    viewCount = '',
    publishedAt = '',
    isLiked = false
  } = video;

  return (
    <div className="video-card" onClick={handleClick}>
      <div className="video-thumbnail-container">
        <img 
          src={thumbnail} 
          alt={title}
          className="video-thumbnail"
          loading="lazy"
        />
        <div className="video-overlay">
          <div className="play-icon">▶</div>
        </div>
        <div className="video-duration">
          <Clock size={12} />
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
      
      <div className="video-info">
        <h3 className="video-title">{title}</h3>
        
        <div className="video-meta">
          <span className="channel-name">{channelTitle}</span>
          {viewCount && <span className="view-count">{viewCount} vistas</span>}
          {publishedAt && <span className="publish-date">{publishedAt}</span>}
        </div>
      </div>
      
      <button 
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={handleLikeClick}
        disabled={!isAuthenticated}
        aria-label="Me gusta"
      >
        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
};

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    channelTitle: PropTypes.string,
    viewCount: PropTypes.string,
    publishedAt: PropTypes.string,
    isLiked: PropTypes.bool
  }).isRequired,
  onLike: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  onVideoClick: PropTypes.func
};

VideoCard.defaultProps = {
  onLike: null,
  isAuthenticated: false,
  onVideoClick: null
};

export default VideoCard;