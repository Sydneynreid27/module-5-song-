const mongoose = require('mongoose');

let dbConnected = false;

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('MONGO_URI not set. Running in memory mode.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    dbConnected = true;
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed. Running in memory mode.', error.message);
    return false;
  }
}

function isDatabaseConnected() {
  return dbConnected;
}

module.exports = {
  connectDatabase,
  isDatabaseConnected,
};
