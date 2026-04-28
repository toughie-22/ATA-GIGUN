const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

/**
 * Scheduled Tasks for ATA GiGUN
 * Runs every day at 1:00 AM
 */
const initCronJobs = () => {
  console.log('🤖 Background Services: Scheduled (Every day at 1 AM)');

  // 1. YouTube & TMDB Sync
  cron.schedule('0 1 * * *', () => {
    console.log('🚀 Starting Scheduled Database Sync...');

    const scriptsDir = path.join(__dirname, '../scripts');

    // Run YouTube Sync
    exec(`node ${path.join(scriptsDir, 'syncYoutube.js')}`, (err, stdout, stderr) => {
      if (err) console.error('❌ Cron: YouTube Sync Failed', err);
      else console.log('✅ Cron: YouTube Sync Complete');
    });

    // Run TMDB Sync (requires TMDB_API_KEY in env)
    exec(`node ${path.join(scriptsDir, 'syncMovies.js')}`, (err, stdout, stderr) => {
      if (err) console.error('❌ Cron: TMDB Sync Failed', err);
      else console.log('✅ Cron: TMDB Sync Complete');
    });
  });
};

module.exports = initCronJobs;
