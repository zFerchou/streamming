import React, { useState } from 'react';
import { uploadVideo } from '../services/videoService';

const UploadForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    video: null,
    thumbnail: null,
  });

  const handleChange = e => {
    if (e.target.name === 'video' || e.target.name === 'thumbnail') {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('tags', form.tags);
    data.append('video', form.video);
    if (form.thumbnail) data.append('thumbnail', form.thumbnail);

    try {
      await uploadVideo(data);
      alert('Video subido con éxito!');
    } catch {
      alert('Error al subir video');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Título" onChange={handleChange} required />
      <textarea name="description" placeholder="Descripción" onChange={handleChange} />
      <input name="tags" placeholder="Tags separados por comas" onChange={handleChange} />
      <input type="file" name="video" accept="video/*" onChange={handleChange} required />
      <input type="file" name="thumbnail" accept="image/*" onChange={handleChange} />
      <button type="submit">Subir Video</button>
    </form>
  );
};

export default UploadForm;