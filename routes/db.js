// db.js
const mongoose = require('mongoose');
const { MONGO_URI } = process.env; // Use environment variables for sensitive information

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://akshayjai19001900:Akshay_2001@cluster0.fy17wn5.mongodb.net/CRM');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
