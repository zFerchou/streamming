import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import '../styles/global.css';

const VideoModal = ({ video, isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isFullscreen ? 'fullscreen' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{video.title}</h3>
          <div className="modal-controls">
            
            <button 
              className="modal-control-button" 
              onClick={handleClose}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="video-container">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="modal-video-info">
          <p className="channel-title">{video.channelTitle}</p>
          <p className="published-date">{video.publishedAt}</p>
          
          {video.hashtags && video.hashtags.length > 0 && (
            <div className="modal-hashtags">
              {video.hashtags.slice(0, 5).map((tag, index) => (
                <span key={index} className="modal-hashtag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;