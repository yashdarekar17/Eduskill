const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


const ProfileSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    username:{
        type:String,
        
    },

    Branch:{
      type:String,
      required:true,
      enum:['Computer','AIDS','Computer science(data science)']
    },
    

    mobileno:{
        type:Number,
    },
    
    Email:{
        type:String,
        required:true,
        unique:true
        
    },

    password:{
        type:String,
        required:true
    },

    

})
ProfileSchema.pre('save', async function(next) {
    const Profile = this;

    try {
        if (!Profile.isModified('password')) return next();

        if (!Profile.password || typeof Profile.password !== 'string' || Profile.password.trim() === '') {
            return next(new Error('Invalid password'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword= await bcrypt.hash(Profile.password, salt);
        Profile.password = hashpassword;
        next();
    } catch (err) {
        console.error('Error during password hashing:', err);
        return next(err);
    }
 });




 ProfileSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
