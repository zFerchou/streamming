import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/authService';
import { Save, ArrowLeft, Hash, Plus, X } from 'lucide-react';
import '../styles/global.css';

const ProfilePage = () => {
  const { user: currentUser, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
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
  const [success, setSuccess] = useState(null);
  const [customHashtag, setCustomHashtag] = useState('');

  const availableHashtags = [
    '#tech', '#gaming', '#music', 
    '#cooking', '#travel', '#education',
    '#sports', '#art', '#science', '#news'
  ];

  useEffect(() => {
    if (currentUser) {
      setForm({
        username: currentUser.username || '',
        description: currentUser.description || '',
        country: currentUser.country || '',
        avatar: null,
        preferences: {
          hashtags: currentUser.preferences?.hashtags || [],
          contentTypes: {
            youtube: currentUser.preferences?.contentTypes?.youtube ?? true,
            localVideos: currentUser.preferences?.contentTypes?.localVideos ?? true,
            liveStreams: currentUser.preferences?.contentTypes?.liveStreams ?? false
          }
        }
      });
    }
  }, [currentUser]);

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

  const handleAddCustomHashtag = () => {
    if (customHashtag.trim() && !customHashtag.includes(' ')) {
      let formattedHashtag = customHashtag.startsWith('#') 
        ? customHashtag 
        : `#${customHashtag}`;
      formattedHashtag = formattedHashtag.trim();

      if (!form.preferences.hashtags.includes(formattedHashtag)) {
        toggleHashtag(formattedHashtag);
      }
      setCustomHashtag('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomHashtag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Limpiar hashtags antes de enviar
    const cleanHashtags = form.preferences.hashtags
      .map(tag => tag.trim())
      .filter(tag => tag && !tag.includes(' '))
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    const cleanPreferences = {
      ...form.preferences,
      hashtags: cleanHashtags
    };

    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('description', form.description);
    formData.append('country', form.country);
    formData.append('preferences', JSON.stringify(cleanPreferences));
    
    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    try {
      const updatedUser = await userService.actualizarPerfil(formData);
      setUser(updatedUser);
      setSuccess('Perfil actualizado correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Cargando información del perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <ArrowLeft size={18} />
          <span>Volver</span>
        </button>
        <h1>Configuración de Perfil</h1>
        <p>Personaliza tu experiencia según tus preferencias</p>
      </div>

      <div className="profile-content">
        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Información Personal</h2>
            
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
                required
                disabled={isSubmitting}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                disabled={isSubmitting}
                className="form-textarea"
                rows="3"
                placeholder="Cuéntanos algo sobre ti..."
              />
            </div>

            <div className="form-group">
              <label>País</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({...form, country: e.target.value})}
                disabled={isSubmitting}
                className="form-input"
                placeholder="Ej: España, México, Argentina..."
              />
            </div>

            <div className="form-group">
              <label>Avatar</label>
              <div className="file-input-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({...form, avatar: e.target.files[0]})}
                  disabled={isSubmitting}
                  className="file-input"
                />
                <span className="file-input-label">
                  {form.avatar ? form.avatar.name : 'Seleccionar imagen'}
                </span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Preferencias de Contenido</h2>
            
            <div className="preference-group">
              <h3>Intereses</h3>
              <p className="preference-description">
                Selecciona los hashtags que mejor representen tus intereses
              </p>
              
              <div className="custom-hashtag-input">
                <div className="input-with-icon">
                  <Hash className="" />
                  <input
                    type="text"
                    value={customHashtag}
                    onChange={(e) => setCustomHashtag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu hashtag"
                    disabled={isSubmitting}
                    className="hashtag-input"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleAddCustomHashtag}
                  disabled={isSubmitting || !customHashtag.trim()}
                  className="add-hashtag-button"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="hashtags-container">
                {form.preferences.hashtags?.map(tag => (
                  <span
                    key={tag}
                    className="hashtag active"
                    onClick={() => !isSubmitting && toggleHashtag(tag)}
                  >
                    {tag}
                    <X size={14} className="remove-icon" />
                  </span>
                ))}
                
                {availableHashtags
                  .filter(tag => !form.preferences.hashtags?.includes(tag))
                  .map(tag => (
                    <span
                      key={tag}
                      className="hashtag"
                      onClick={() => !isSubmitting && toggleHashtag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            <div className="preference-group">
              <h3>Tipo de Contenido</h3>
              <p className="preference-description">
                Selecciona los tipos de contenido que prefieres ver
              </p>
              
              <div className="checkbox-group">
                {Object.entries(form.preferences.contentTypes || {}).map(([type, value]) => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handlePreferenceChange(
                        'contentTypes', 
                        { ...form.preferences.contentTypes, [type]: e.target.checked }
                      )}
                      disabled={isSubmitting}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    {type === 'youtube' && 'Videos de YouTube'}
                    {type === 'localVideos' && 'Videos locales'}
                    {type === 'liveStreams' && 'Transmisiones en vivo'}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;