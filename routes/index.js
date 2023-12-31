var express = require('express');
var router = express.Router();
const mongoose = require('./db');
const TeleSignSDK = require('telesignsdk');
// const ipinfo = require('ip-geolocation-ipinfo');
const axios = require('axios');


// const User1 = require('../schema/User1.model');



// mongoose.connect('mongodb+srv://akshayjai19001900:Akshay_2001@cluster0.fy17wn5.mongodb.net/Cloud-Project', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017/CRM', { useNewUrlParser: true, useUnifiedTopology: true });



// const db = mongoose.connection;
// // express.use(cors());

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// CREATING SCHEMA FOR SAVING PRODUCT DETAILS:

const prodcutDetails = new mongoose.Schema({
  product: String,
  unit: Number,
});

const Details1 = mongoose.model('Details1', prodcutDetails);


// TO SAVE OR STORE THE PRODUCT DETAILS 

router.post('/product-details', async (req,res) =>{
  try {
    const {product , unit} = req.body;
    const newDetail = new Details1({product, unit});

    await newDetail.save();
    res.status(201).json({ message: 'Details Saved Successful' });
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET PRODUCT DETAILS API...............

router.get('/get-productDetails', async (req,res)=>{
  try{
    // const user = await User1.findOne({ username });
    // const detail = await Details1.get({product, unit});
    const allDetails = await Details1.find();

    res.status(200).json(allDetails);

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//  TO GET THE SUM OF THE UNITS....................

router.get('/getSumOfUnits', async (req, res) => {
  try {
    const details = await Details1.find();
    const sumOfUnits = details.reduce((sum, detail) => sum + detail.unit, 0);
    res.json({ sumOfUnits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Replace the defaults below with your Telesign authentication credentials or pull them from environment variables.


// Set the message text and type.


// TO SEND SMS USING TELESIGN.............. FUNCTION BELOW..............

const customerId = "E82EE288-2554-4F1F-B155-1B1431AE5569"
const apiKey = "ZpXY1pfpd7XcFLsL9+uyVYrPrmj4EOwIEwCCEN1waOsk3GoYwxXvWNvvIKXUNNMyITGq/R7lmcC2ztt5w7OKSQ=="
 
const client = new TeleSignSDK(customerId, apiKey);

// Define the callback.

router.post('/send-sms', (req, res) => {
  const { phoneNumber, message, messageType } = req.body;
 

  function smsCallback(error, responseBody) {
    if (error === null) {
      console.log('\nResponse body:\n' + JSON.stringify(responseBody));
      res.status(200).json(responseBody);
    } else {
      console.error('Unable to send SMS. Error:\n\n' + error);
      res.status(500).json({ error: 'Unable to send SMS' });
    }
  }

  client.sms.message(smsCallback, phoneNumber, message, messageType);
});


router.get('/get-location', async (req, res) => {
  try {
    const ipAddress = req.query.ip;

    // Make a request to the ipinfo.io API to get location information based on IP
    const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
    const locationData = response.data;

// Split the 'loc' string into latitude and longitude


const [latitude, longitude] = locationData.loc.split(',');
    res.json({
      ip: locationData.ip,
      city: locationData.city,
      region: locationData.region,
      country: locationData.country,
      latitude: latitude,
      longitude: longitude,
    });
  } catch (error) {
    console.error('Error getting location:', error.message);
    res.status(500).json({ error: 'Error getting location' });
  }
});


// TO SAVE THE LOCATION DETAILS...............

const locationSchema = new mongoose.Schema({
  latitude1: Number,
  longitude1: Number,
});

const Location = mongoose.model('Location', locationSchema);

router.post('/saveLocation', async(req,res)=>{
  try {
    const { latitude1, longitude1 } = req.body;

    const newLocation = new Location({
      latitude1,
      longitude1,
    });

    await newLocation.save();
    console.log("The save location to db is working")
    res.status(200).json({ message: 'Location saved successfully' });
  }
  catch (error) {
    console.error(error);
    console.log("The save location to db has some error please fix it developer")
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});





module.exports = router;
