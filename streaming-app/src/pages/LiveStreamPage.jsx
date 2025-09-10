import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { livestreamService } from '../services/livestreamService';

const LiveStreamPage = () => {
  const { user } = useContext(AuthContext);
  const [localStream, setLocalStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [originalStream, setOriginalStream] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const pcRef = useRef(null);
  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    startCamera();

    return () => {
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (isBroadcasting) stopBroadcast();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setOriginalStream(stream);
      setCameraEnabled(true);
      setMicEnabled(true);
      createPeerConnection(stream);
    } catch (err) {
      console.error('Error al obtener cámara:', err);
    }
  };

  const createPeerConnection = (stream) => {
    pcRef.current = new RTCPeerConnection(configuration);
    stream.getTracks().forEach(track => {
      pcRef.current.addTrack(track, stream);
    });
    // Aquí deberías implementar la señalización para WebRTC (fuera del scope actual)
  };

  const shareScreen = async () => {
    if (isScreenSharing) {
      stopScreenShare();
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = pcRef.current.getSenders().find(s => s.track.kind === 'video');
      if (sender) sender.replaceTrack(videoTrack);
      setLocalStream(screenStream);
      setIsScreenSharing(true);
      screenStream.getVideoTracks()[0].onended = () => stopScreenShare();
    } catch (err) {
      console.error('Error al compartir pantalla:', err);
    }
  };

  const stopScreenShare = () => {
    if (!isScreenSharing) return;
    const videoTrack = originalStream.getVideoTracks()[0];
    const sender = pcRef.current.getSenders().find(s => s.track.kind === 'video');
    if (sender) sender.replaceTrack(videoTrack);
    setLocalStream(originalStream);
    setIsScreenSharing(false);
  };

  const toggleCamera = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setCameraEnabled(videoTrack.enabled);
  };

  const toggleMic = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setMicEnabled(audioTrack.enabled);
  };

  // Función para iniciar transmisión usando livestreamService
  const startBroadcast = async () => {
    if (!user) {
      alert('Debes iniciar sesión para transmitir');
      return;
    }
    try {
      await livestreamService.start({ userId: user.id, username: user.username });
      setIsBroadcasting(true);
    } catch (err) {
      console.error('Error al iniciar transmisión:', err);
    }
  };

  // Función para detener transmisión usando livestreamService
  const stopBroadcast = async () => {
    if (!user) return;
    try {
      await livestreamService.stop(user.id);
      setIsBroadcasting(false);
    } catch (err) {
      console.error('Error al detener transmisión:', err);
    }
  };

  return (
    <div className="live-stream-page">
      <h2>Transmisión en vivo</h2>

      <video
        ref={video => {
          if (video && localStream) {
            video.srcObject = localStream;
            video.play();
          }
        }}
        autoPlay
        muted
        playsInline
        style={{ width: '600px', border: '1px solid #ccc' }}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={shareScreen}>
          {isScreenSharing ? 'Dejar de compartir pantalla' : 'Compartir pantalla'}
        </button>
        <button onClick={toggleCamera} style={{ marginLeft: '10px' }}>
          {cameraEnabled ? 'Apagar cámara' : 'Encender cámara'}
        </button>
        <button onClick={toggleMic} style={{ marginLeft: '10px' }}>
          {micEnabled ? 'Silenciar micrófono' : 'Activar micrófono'}
        </button>
        {!isBroadcasting ? (
          <button onClick={startBroadcast} style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}>
            Iniciar transmisión
          </button>
        ) : (
          <button onClick={stopBroadcast} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
            Detener transmisión
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveStreamPage;
