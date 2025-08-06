// src/components/VideoList.jsx
import React from 'react';
import VideoCard from './VideoCard';

const VideoList = ({ videos, onVideoSelect }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoCard key={video.id.videoId} video={video} onVideoSelect={onVideoSelect} />
      ))}
    </div>
  );
};

export default VideoList;
