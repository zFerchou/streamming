import React, { useRef, useState, useEffect } from 'react';

const VideoPlayer = ({ url, onMomentSave }) => {
  const videoRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setIsMiniPlayer(true);
      else setIsMiniPlayer(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveMoment = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      onMomentSave(currentTime);
      alert(`Momento guardado en ${Math.floor(currentTime)} segundos`);
    }
  };

  return (
    <div className={`video-player ${isMiniPlayer ? 'mini' : ''}`}>
      <video
        ref={videoRef}
        src={url}
        controls
        playbackRate={speed}
        autoPlay
        onEnded={() => {
          // podrías agregar autoplay del siguiente video aquí
        }}
      />
      <div className="controls">
        <label>
          Velocidad:
          <select value={speed} onChange={e => setSpeed(parseFloat(e.target.value))}>
            {[0.5, 1, 1.5, 2].map(s => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>
        </label>
        <button onClick={saveMoment}>Guardar Momento</button>
      </div>
    </div>
  );
};

export default VideoPlayer;