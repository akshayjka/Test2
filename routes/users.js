var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const cors = require('cors');
const multer = require('multer');
const Grid = require('gridfs-stream');
// const User1 = require('../schema/User1.model');



/* GET users listing. */
mongoose.connect('mongodb://localhost:27017/CRM', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
// express.use(cors());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const Image1 = mongoose.model('Users', imageSchema);

const createSchema = new mongoose.Schema({
  username : String,
  password : String,
  image: {
    data: Buffer,
    contentType: String
  }
})

const User1 = mongoose.model('User1',createSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a schema for the user data
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);


// TO UPLOAD AN IMAGE



// router.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     const imageData = req.file.buffer;
//     const contentType = req.file.mimetype;

//     const newImage = new Image1({
//       data: imageData,
//       contentType: contentType,
//     });

//     await newImage.save();

//     res.status(201).json({ message: 'Image uploaded successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// TO GET THE IMAGE FROM DB


// server/routes/image.js
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User1.findOne({ username });

    if (!user) {
      console.log("The user no tfound", user)
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      image: {
        contentType: user.image.contentType,
        data: user.image.data.toString('base64')
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { username, password } = req.body;
    const image = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    const newUser = new User1({ username, password, image });
    const user = await User1.findOne({ username });
    if(user){
      return res.status(201).json({ message: 'User Already Exist' });
    }
    else {
      await newUser.save();
    res.status(201).json({ message: 'Registration successful' });

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// to get and check user credentials

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Query MongoDB for the user
    const user = await User1.findOne({ username, password });

    // Check if the user is found
    if (user) {
      console.log("The user details", user)
      return res.status(200).json({ message: 'Login successful', user });
    } else {
      console.log(user)
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// TO UPDATE PASSWORD API

router.put('/update-password/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { newPassword } = req.body;

    // Find the user by username
    const user = await User1.findOne({ username });

    // Check if the user is found
    if (user) {
      // Update the user's password
      user.password = newPassword;
      await user.save();

      return res.status(200).json({ message: 'Password updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
