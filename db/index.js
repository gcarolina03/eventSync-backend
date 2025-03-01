const mongoose = require('mongoose')
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

async function connectToDatabase() {
  try {
    await mongoose.connect(`${url}`)
    console.log(`Connected successfully to MongoDB ${url}`);
  } catch(err) {
    console.error('Connection error', err)
  }
}

async function disconnectToDatabase() {
 try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error disconnecting from MongoDB:', err);
  }
}

module.exports = { connectToDatabase, disconnectToDatabase }