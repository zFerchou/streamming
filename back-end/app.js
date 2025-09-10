const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const intelligentRoutes = require('./routes/intelligentRoutes');
const livestreamsRouter = require('./routes/livestreams');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/intelligent', intelligentRoutes);
app.use('/api/livestreams', livestreamsRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
