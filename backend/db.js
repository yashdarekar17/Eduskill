const mongoose= require('mongoose');

const mongodburl='mongodb+srv://dyash8608:yash123@cluster0.huzxl.mongodb.net/'

mongoose.connect(mongodburl, 
    //  { useNewUrlParser: true,
    //   useUnifiedTopology: true }
     )

const db= mongoose.connection;

db.on('connected',()=>{
 console.log("your db is connected to eduskill2.0 website")
})

db.on('error',()=>{
    console.log('error');
})


module.exports= db;
