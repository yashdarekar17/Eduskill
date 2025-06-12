const mongoose= require('mongoose');

const courseschema = new mongoose.Schema({
    imageUrl: String,
    title: String,
})

const courses = mongoose.model('courses',courseschema);
module.exports=courses
