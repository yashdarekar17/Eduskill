const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');
const { jwtwebmiddleware, generatetoken } = require('../jwt');
const path = require('path');

router.get('/index', (req, res) => {
  res.render('index.html');
});
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
  res.redirect('login');
  
  } catch (err) {
    console.log(err);
    
  }
});

// Route for login
router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      const profile = await Profile.findOne({ username });

      if (!profile || !(await profile.comparePassword(password))) {
          return res.status(401).json({ error: "Invalid username or password" });
      }

      const payload = { id: profile.id };
      const token = generatetoken(payload);

      // ✅ Store token in HTTP-Only Cookie
      res.cookie("token", token, {
          httpOnly: true, 
          secure: false, // Change to true in production with HTTPS
          sameSite: "Lax"
      });

      console.log("✅ Token Set:", token); // Debugging
      res.redirect('index');
      // res.json({ message: "Login successful", token: token });
  } catch (err) {
      console.error(err);
      // res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/check-session', jwtwebmiddleware, async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ loggedIn: false, message: "Unauthorized" });
      }

      const profile = await Profile.findById(req.user.id);
      if (!profile) {
          return res.status(401).json({ loggedIn: false, message: "User not found" });
      }

      res.json({ loggedIn: true, username: profile.username });
  } catch (err) {
      console.error(err);
      res.status(500).json({ loggedIn: false, message: "Internal server error" });
  }
});
router.post('/logout', async (req, res) => {
  try {
      res.clearCookie("token");
      res.redirect('index')
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
