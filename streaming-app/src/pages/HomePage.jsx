import React, { useEffect, useState, useRef, useContext } from 'react';
import VideoCard from '../components/VideoCard';
import youtube from '../api/youtube';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const [state, setState] = useState({
    videos: [],
    selectedHashtags: [],
    loading: true,
    error: null,
    searchQuery: ''
  });
  const controllerRef = useRef(null);
  const { user } = useContext(AuthContext);

  const fetchVideos = async (query = '') => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    controllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await youtube.get('/search', {
        params: {
          q: query || 'react tutorial',
          maxResults: 12,
          type: 'video',
          key: process.env.REACT_APP_YOUTUBE_API_KEY
        },
        signal: controllerRef.current.signal
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('No se encontraron videos');
      }

      const formattedVideos = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        hashtags: ['#youtube', '#tutorial'],
        isLiked: false
      }));

      setState(prev => ({
        ...prev,
        videos: formattedVideos,
        loading: false
      }));
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setState(prev => ({
          ...prev,
          error: err.response?.status === 403 
            ? 'Error de autenticación con YouTube API. Verifica tu clave.' 
            : err.message || 'Error al cargar videos',
          loading: false
        }));
      }
    }
  };

  // Función handleSearch definida correctamente
  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(state.searchQuery);
  };

  // Función toggleHashtag definida correctamente
  const toggleHashtag = (tag) => {
    setState(prev => ({
      ...prev,
      selectedHashtags: prev.selectedHashtags.includes(tag) 
        ? prev.selectedHashtags.filter(t => t !== tag) 
        : [...prev.selectedHashtags, tag]
    }));
  };

  const handleLike = (videoId) => {
    if (!user) {
      alert('Por favor inicia sesión para dar like');
      return;
    }

    setState(prev => ({
      ...prev,
      videos: prev.videos.map(video => 
        video.id === videoId 
          ? { ...video, isLiked: !video.isLiked } 
          : video
      )
    }));
  };

  useEffect(() => {
    fetchVideos();
    return () => controllerRef.current?.abort();
  }, []);

  const { loading, error, videos, selectedHashtags, searchQuery } = state;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => fetchVideos()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const filteredVideos = selectedHashtags.length > 0
    ? videos.filter(video => 
        video.hashtags.some(tag => selectedHashtags.includes(tag)))
    : videos;

  return (
    <div className="home-page">
      <h1 className="page-title">Videos de YouTube</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
          placeholder="Buscar videos..."
          aria-label="Buscar videos"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>

      <div className="hashtag-filter">
        {['#youtube', '#tutorial', '#react', '#javascript', '#programacion'].map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleHashtag(tag)}
            className={`hashtag ${selectedHashtags.includes(tag) ? 'active' : ''}`}
            aria-label={`Filtrar por ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredVideos.length === 0 ? (
        <div className="no-results">
          <p>No hay videos con los filtros seleccionados</p>
          <button 
            onClick={() => setState(prev => ({ ...prev, selectedHashtags: [] }))}
            className="clear-filters"
            aria-label="Limpiar todos los filtros"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="video-grid">
          {filteredVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onLike={handleLike}
              isAuthenticated={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;