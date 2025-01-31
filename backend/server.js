const express = require("express");
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const db = require('./db')
const path = require('path')
require('dotenv').config()
app.engine('html',require('ejs').renderFile)
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname,'public')));


// Basic route to test HTML file



 const port = process.env.port
const profileroutes = require('./routes/profileroutes')
app.use('/Profile',profileroutes)
app.listen(port ,()=>{
    console.log('port 5000 running successfully')
    
  })

