const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('../models/Movie');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const YOUTUBE_API_KEY = 'AIzaSyBfqZ-k-NqMBYTetkeMJG1MPEYi2FGKKWc';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Suggested Nollywood Channels
const CHANNELS = [
  { name: 'SceneOne TV', handle: '@SceneOneTV' },
  { name: 'Realnolly TV', handle: '@RealnollyTV' },
  { name: 'Uchenna Mbunabo TV', handle: '@UchennaMbunaboTV' },
  { name: 'Firstnolly TV', handle: '@Firstnollytv' }
];

const syncYoutube = async () => {
  try {
    console.log('🌶️ ATA GiGUN: Starting YouTube synchronization...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    for (const channel of CHANNELS) {
      console.log(`\n📺 Fetching from: ${channel.name}...`);
      
      try {
        // 1. Search for the latest 2026 Nollywood movies in this channel
        const searchResponse = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
          params: {
            key: YOUTUBE_API_KEY,
            q: `${channel.name} Nollywood full movie 2026`,
            part: 'snippet',
            maxResults: 5,
            type: 'video',
            order: 'date'
          }
        });

        const videos = searchResponse.data.items;
        console.log(`Found ${videos.length} potential movies.`);

        for (const video of videos) {
          const { title, description, thumbnails, publishedAt } = video.snippet;
          const videoId = video.id.videoId;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          
          // Basic filtering to ensure it's a "Full Movie" and not a trailer
          const isFullMovie = title.toLowerCase().includes('full movie') || 
                              description.toLowerCase().includes('full movie') ||
                              title.toLowerCase().includes('complete');

          if (!isFullMovie) {
            console.log(`⏩ Skipping (likely trailer/clip): ${title}`);
            continue;
          }

          const existingMovie = await Movie.findOne({ 
            $or: [{ title: title }, { fullMovieUrl: videoUrl }] 
          });

          if (existingMovie) {
            console.log(`⏭️ Already exists: ${title}`);
            continue;
          }

          // Create new movie entry
          const newMovie = new Movie({
            title: title.replace(/[^a-zA-Z0-9 ]/g, '').split('Full Movie')[0].trim(),
            year: new Date(publishedAt).getFullYear() || 2026,
            genre: ['Nollywood', 'Drama'], // Default genres
            synopsis: description.slice(0, 500),
            posterUrl: thumbnails.high?.url || thumbnails.default?.url,
            isYouTubeFilm: true,
            fullMovieUrl: videoUrl,
            ataScore: Math.floor(Math.random() * (95 - 70 + 1)) + 70, // Random initial heat for new syncs
            director: channel.name
          });

          await newMovie.save();
          console.log(`✅ Added New Movie: ${newMovie.title}`);
        }
      } catch (err) {
        console.error(`❌ Error fetching from ${channel.name}:`, err.response?.data?.error?.message || err.message);
      }
      
      // Wait to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ YouTube Synchronization Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
};

syncYoutube();
