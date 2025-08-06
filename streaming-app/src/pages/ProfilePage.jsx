import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../services/authService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    description: '',
    country: '',
    avatar: null,
  });

  useEffect(() => {
    getUserFromToken().then(data => {
      setUser(data);
      setForm({
        username: data.username || '',
        description: data.description || '',
        country: data.country || '',
        avatar: null,
      });
    });
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('description', form.description);
    formData.append('country', form.country);
    if (form.avatar) formData.append('avatar', form.avatar);

    try {
      // Aquí deberías llamar a la API para actualizar perfil (falta implementar servicio)
      alert('Perfil actualizado (simulado)');
    } catch {
      alert('Error al actualizar perfil');
    }
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="profile-page">
      <h2>Perfil de {user.username}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nombre de usuario"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="País"
        />
        <input
          type="file"
          name="avatar"
          onChange={handleChange}
          accept="image/*"
        />
        <button type="submit">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default ProfilePage;
