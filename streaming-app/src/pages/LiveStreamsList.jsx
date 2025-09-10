import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LiveStreamsList = () => {
  const [streams, setStreams] = useState([]);

  const fetchLiveStreams = async () => {
    try {
      const res = await axios.get('/api/livestreams/active');
      setStreams(res.data.streams || []);
    } catch (err) {
      console.error('Error al cargar transmisiones activas:', err);
    }
  };

  useEffect(() => {
    fetchLiveStreams();

    // Polling simple cada 10 segundos para actualizar lista
    const interval = setInterval(fetchLiveStreams, 10000);
    return () => clearInterval(interval);
  }, []);

  if (streams.length === 0) {
    return <p>No hay transmisiones activas actualmente.</p>;
  }

  return (
    <div className="live-streams-list">
      <h3>Transmisiones activas</h3>
      <ul>
        {streams.map(stream => (
          <li key={stream.userId}>
            <strong>{stream.username}</strong> está transmitiendo
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveStreamsList;
