import React, { useState, useEffect } from 'react';
import { authService, userService } from '../services/authService'; // Importar ambos servicios

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    description: '',
    country: '',
    avatar: null,
    preferences: {
      hashtags: [],
      contentTypes: {
        youtube: true,
        localVideos: true,
        liveStreams: false
      }
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const availableHashtags = [
    '#tech', '#gaming', '#music', 
    '#cooking', '#travel', '#education'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.obtenerUsuarioActual();
        if (userData) {
          setUser(userData);
          setForm({
            username: userData.username || '',
            description: userData.description || '',
            country: userData.country || '',
            avatar: null,
            preferences: {
              hashtags: userData.preferences?.hashtags || [],
              contentTypes: {
                youtube: userData.preferences?.contentTypes?.youtube ?? true,
                localVideos: userData.preferences?.contentTypes?.localVideos ?? true,
                liveStreams: userData.preferences?.contentTypes?.liveStreams ?? false
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        setError('Error al cargar los datos del perfil');
      }
    };
    fetchUserData();
  }, []);

  const handlePreferenceChange = (type, value) => {
    setForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value
      }
    }));
  };

  const toggleHashtag = (tag) => {
    setForm(prev => {
      const currentTags = prev.preferences?.hashtags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          hashtags: newTags
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('description', form.description);
    formData.append('country', form.country);
    formData.append('preferences', JSON.stringify(form.preferences));
    
    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    try {
      const updatedUser = await userService.actualizarPerfil(formData);
      setUser(updatedUser);
      alert('¡Perfil actualizado correctamente!');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="profile-page loading">Cargando información del perfil...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Personaliza tu experiencia</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="preferences-section">
        <h3>Selecciona tus intereses</h3>
        <div className="hashtags-container">
          {availableHashtags.map(tag => (
            <button
              key={tag}
              type="button"
              className={`hashtag ${form.preferences.hashtags?.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleHashtag(tag)}
              disabled={isSubmitting}
            >
              {tag}
            </button>
          ))}
        </div>

        <h3>Tipo de contenido</h3>
        <div className="content-types">
          {Object.entries(form.preferences.contentTypes || {}).map(([type, value]) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handlePreferenceChange(
                  'contentTypes', 
                  { ...form.preferences.contentTypes, [type]: e.target.checked }
                )}
                disabled={isSubmitting}
              />
              {type === 'youtube' && 'Videos de YouTube'}
              {type === 'localVideos' && 'Videos locales'}
              {type === 'liveStreams' && 'Transmisiones en vivo'}
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Nombre de usuario:</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>País:</label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => setForm({...form, country: e.target.value})}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Avatar:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({...form, avatar: e.target.files[0]})}
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="save-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};


export default ProfilePage;