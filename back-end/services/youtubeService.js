const axios = require('axios');
const API_KEY = process.env.YOUTUBE_API_KEY;

exports.getYoutubeVideos = async (params) => {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      type: 'video',
      key: API_KEY,
      ...params
    }
  });
  
  return response.data.items.map(item => ({
    source: 'youtube',
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.default.url,
    hashtags: item.snippet.tags || []
  }));
};