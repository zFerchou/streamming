import React, { useEffect, useState, useRef, useContext } from 'react';
import VideoCard from '../components/VideoCard';
import VideoModal from '../pages/VideoModal';
import HashtagCloud from '../components/HashtagCloud';
import youtube from '../api/youtube';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/authService';
import { Search, RotateCw, Filter } from 'lucide-react';
import '../styles/global.css';

const HomePage = () => {
  const [state, setState] = useState({
    videos: [],
    selectedHashtags: [],
    loading: false,
    error: null,
    searchQuery: '',
    userHashtags: [],
    selectedVideo: null,
    isModalOpen: false
  });
  
  const controllerRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Función para convertir duración ISO 8601 a formato legible
  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    if (!match) return '0:00';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    let totalSeconds = 0;
    if (hours) totalSeconds += parseInt(hours) * 3600;
    if (minutes) totalSeconds += parseInt(minutes) * 60;
    if (seconds) totalSeconds += parseInt(seconds);
    
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Función para formatear números de vistas
  const formatViewCount = (count) => {
    if (!count) return '0 vistas';
    
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M vistas`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K vistas`;
    } else {
      return `${num} vistas`;
    }
  };

  // Cargar hashtags y hacer fetch inicial
  useEffect(() => {
    const loadUserHashtagsAndVideos = async () => {
      if (user) {
        try {
          const userData = await userService.obtenerPerfil();
          const hashtags = userData?.preferences?.hashtags || [];

          setState(prev => ({ ...prev, userHashtags: hashtags }));

          // Construir query con hashtags, por ejemplo: "#tech #gaming"
          const query = hashtags.length > 0 ? hashtags.join(' ') : 'Minecraft';

          // Guardar búsqueda en estado
          setState(prev => ({ ...prev, searchQuery: query }));

          await fetchVideos(query);

        } catch (error) {
          console.error('Error al cargar hashtags o videos iniciales:', error);
          // En caso de error, cargar videos default
          setState(prev => ({ ...prev, userHashtags: [], searchQuery: 'Minecraft' }));
          await fetchVideos('Minecraft');
        }
      } else {
        // Si no hay usuario logueado, cargar videos default
        await fetchVideos('Minecraft');
      }
    };

    loadUserHashtagsAndVideos();
  }, [user]);

  const extractHashtags = (text) => {
    if (!text) return [];
    const hashtagRegex = /#\w+/g;
    const matches = text.match(hashtagRegex);
    return matches ? [...new Set(matches)] : [];
  };

  const fetchVideos = async (query = '') => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, videos: [], loading: false, error: null }));
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    controllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Primera llamada: buscar videos
      const searchResponse = await youtube.get('/search', {
        params: {
          q: query,
          maxResults: 12,
          type: 'video',
          part: 'snippet',
          key: process.env.REACT_APP_YOUTUBE_API_KEY
        },
        signal: controllerRef.current.signal
      });

      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        setState(prev => ({ ...prev, videos: [], loading: false, error: 'No se encontraron videos' }));
        return;
      }

      // Obtener IDs de videos para la segunda llamada
      const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

      // Segunda llamada: obtener detalles completos (duración, estadísticas)
      const videosResponse = await youtube.get('/videos', {
        params: {
          id: videoIds,
          part: 'contentDetails,statistics',
          key: process.env.REACT_APP_YOUTUBE_API_KEY
        },
        signal: controllerRef.current.signal
      });

      // Crear un mapa de detalles de video por ID para acceso rápido
      const videoDetailsMap = {};
      if (videosResponse.data.items) {
        videosResponse.data.items.forEach(video => {
          videoDetailsMap[video.id] = {
            duration: video.contentDetails?.duration || 'PT0S',
            viewCount: video.statistics?.viewCount || '0'
          };
        });
      }

      // Formatear videos combinando información de ambas llamadas
      const formattedVideos = searchResponse.data.items.map(item => {
        const details = videoDetailsMap[item.id.videoId] || { duration: 'PT0S', viewCount: '0' };
        
        return {
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
          duration: parseDuration(details.duration),
          viewCount: formatViewCount(details.viewCount),
          hashtags: [
            ...extractHashtags(item.snippet.title),
            ...extractHashtags(item.snippet.description)
          ],
          isLiked: false,
          source: 'youtube'
        };
      });

      setState(prev => ({
        ...prev,
        videos: formattedVideos,
        loading: false,
        error: null
      }));

    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error('Error fetching videos:', err);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(state.searchQuery);
  };

  const toggleHashtag = (tag) => {
    setState(prev => {
      const alreadySelected = prev.selectedHashtags.includes(tag);
      const newSelected = alreadySelected
        ? prev.selectedHashtags.filter(t => t !== tag)
        : [...prev.selectedHashtags, tag];

      return { ...prev, selectedHashtags: newSelected };
    });
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

  const handleVideoClick = (video) => {
    setState(prev => ({
      ...prev,
      selectedVideo: video,
      isModalOpen: true
    }));
  };

  const closeModal = () => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      selectedVideo: null
    }));
  };

  const { loading, error, videos, selectedHashtags, searchQuery, userHashtags, isModalOpen, selectedVideo } = state;

  // Filtrar videos si hay hashtags seleccionados
  const filteredVideos = selectedHashtags.length > 0
    ? videos.filter(video => video.hashtags.some(tag => selectedHashtags.includes(tag)))
    : videos;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Explorar Videos</h1>
        <p className="home-subtitle">Descubre los mejores contenidos de Fertube</p>
      </div>
      
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Buscar videos o usar hashtags..."
              aria-label="Buscar videos"
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? <RotateCw className="spinning" /> : 'Buscar'}
            </button>
          </div>
        </form>

        <div className="hashtag-section">
          <div className="section-header">
            <Filter className="filter-icon" />
            <h3>Filtrar por hashtags</h3>
          </div>
          <HashtagCloud 
            hashtags={userHashtags}
            selectedHashtags={selectedHashtags}
            onToggle={toggleHashtag}
          />
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando videos...</p>
        </div>
      )}

      {!loading && error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => fetchVideos(searchQuery)}
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filteredVideos.length === 0 && (
        <div className="no-results">
          <p>No se encontraron videos con los filtros seleccionados</p>
          <button 
            onClick={() => setState(prev => ({ ...prev, selectedHashtags: [], searchQuery: '', videos: [] }))}
            className="clear-filters-button"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {!loading && !error && filteredVideos.length > 0 && (
        <div className="video-grid-container">
          <div className="results-info">
            <span>{filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} encontrado{filteredVideos.length !== 1 ? 's' : ''}</span>
            {selectedHashtags.length > 0 && (
              <button 
                onClick={() => setState(prev => ({ ...prev, selectedHashtags: [] }))}
                className="clear-filters-button"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          
          <div className="video-grid">
            {filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onLike={handleLike}
                isAuthenticated={!!user}
                onVideoClick={handleVideoClick}
              />
            ))}
          </div>
        </div>
      )}
      
      <VideoModal 
        video={selectedVideo} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default HomePage;