import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <Link to={`/video/${video._id}`}>
        <img src={video.thumbnail || 'default-thumbnail.jpg'} alt={video.title} />
        <h3>{video.title}</h3>
      </Link>
      <p>{video.owner?.username}</p>
    </div>
  );
};

export default VideoCard;