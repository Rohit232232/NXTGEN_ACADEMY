const mongoose = require('mongoose');

async function initDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to your .env file.');
  }

  mongoose.connection.on('connected', () => {
    console.log('[db] Connected to MongoDB');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });

  await mongoose.connect(uri);
}

module.exports = { initDb, mongoose };