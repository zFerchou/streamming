import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { getVideoById, saveMoment } from '../services/videoService';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    getVideoById(id).then(setVideo);
  }, [id]);

  const handleMomentSave = (second) => {
    saveMoment(id, second).then(() => {
      alert('Momento guardado!');
    });
  };

  if (!video) return <p>Cargando video...</p>;

  return (
    <div className="video-page">
      <h2>{video.title}</h2>
      <VideoPlayer url={video.url} onMomentSave={handleMomentSave} />
      <p>{video.description}</p>
      {/* Aquí puedes agregar momentos guardados, comentarios, etc */}
    </div>
  );
};

export default VideoPage;
