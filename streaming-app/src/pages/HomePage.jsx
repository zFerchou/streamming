import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { fetchRecommendedVideos, fetchAllVideos } from '../services/videoService';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    fetchRecommendedVideos().then(setVideos);
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, videos]);

  return (
    <div className="homepage">
      <h1>Videos Recomendados</h1>
      <input
        type="text"
        placeholder="Buscar videos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="video-grid">
        {filteredVideos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
