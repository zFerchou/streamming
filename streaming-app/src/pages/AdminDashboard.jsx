import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const videoRes = await axios.get('http://localhost:5000/api/admin/videos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userRes = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(videoRes.data);
        setUsers(userRes.data);
      } catch (error) {
        alert('Error cargando datos administrativos');
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administrador</h2>
      <section>
        <h3>Videos</h3>
        <ul>
          {videos.map(video => (
            <li key={video._id}>
              {video.title} - {video.owner.username}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Usuarios</h3>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {user.username} ({user.role})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
