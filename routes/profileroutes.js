const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');
const { jwtwebmiddleware, generatetoken } = require('./../jwt');
const path = require('path');


// Route to render the login page
router.get('/login', (req, res) => {
  res.render('login.html');
});

// Route to render the signup page
router.get('/signup', (req, res) => {
  res.render('signup.html');
});





// Route for signup
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    const newProfile = new Profile(data);
    const response = await newProfile.save();
    
    console.log('Data saved');
    
    const payload = {
      id: response.id,
    };

    console.log(JSON.stringify(payload));

    const token = generatetoken(payload);
    console.log("Token is:", token);
    
  //  res.status(200).json({ Response: response, Token: token });
  console.log(response)
   res.render('login')
  
  } catch (err) {
    console.log(err);
    
  }
});

// Route for login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Use findOne instead of findById
    const profile = await Profile.findOne({ username: username });

    
    if (!profile || !(await profile.camparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }else{
      res.render('index')
    }

    const payload = {
      id: profile.id, // Use profile.id here
    };

    console.log(JSON.stringify(payload));

    const token = generatetoken(payload);
    console.log("Token is:", token);

    // Send only one response
   // res.status(200).json({ Response: profile, Token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/logout',async(res,req) =>{
  try{
      
  }catch(err){
    console.log(err='internal server error')
  }

})

module.exports = router;
