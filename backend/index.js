const express = require("express");
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const db = require('./db')
const path = require('path')
const Razorpay = require('razorpay')
require('dotenv').config()
app.engine('html',require('ejs').renderFile)
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.set('views', path.join(__dirname, '../frontend/views'));



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});
// Basic route to test HTML file
// const products = [
//   { id: 1, name: 'web development', price: 500, currency: 'INR' }, // Price in rupees
//   { id: 2, name: 'app development', price: 500, currency: 'INR' },
//   { id: 3, name: 'ui/ux', price: 500, currency: 'INR' },
//   { id: 4, name: 'data science', price: 500, currency: 'INR' }
// ];


// app.get('/products', (req, res) => {
//   res.json(products);
// });
app.get('/razorpay-key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create Razorpay order
app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body; // Expect amount and currency from the frontend

    // Ensure valid inputs
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required.' });
    }

    // Create the Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert amount to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    });

    // Send the order details to the frontend
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});



// const paymentController = require('./controller/paymentcontroller');

// app.get('/paymentController', paymentController.renderProductPage);
// app.post('/createOrder', paymentController.createOrder);

 const port = process.env.port
const profileroutes = require('./routes/profileroutes')
app.use('/Profile',profileroutes)
app.listen(port ,()=>{
    console.log('port 5000 running successfully')
    
  })

