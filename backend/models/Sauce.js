const mongoose = require('mongoose');



//modèle
const sauceSchema = mongoose.Schema({
    userId: { type: String },
    name: {
         type: String,minlength:[5,"minimum 5 caractères"],
         maxlength:[30,"maximum 30 caractères"], 
         required: true ,
         match: /^[^@&*";?#/\$=*<>]+$/g},

    manufacturer: {
         type: String,minlength:[5,"minimum 5 caractères"],
         maxlength:[30,"maximum 30 caractères"],
        required: true ,
        match: /^[^@&*";?#/\$=*<>]+$/g},
    description: {
         type: String, 
         minlength:[10,"minimum 10 caractères"],
         maxlength:[150,"maximum 150 caractères"], 
         required: true ,
         match: /^[^@&*";?#/\$=*<>]+$/g},
    mainPepper: { 
        type: String,
        minlength:[5,"minimum 10 caractères"],
        maxlength:[30,"maximum 30 caractères"],
        required: true ,
        match: /^[^@&*";?#/\$=*<>]+$/g},
    imageUrl: { 
        type: String, 
        required: true },
    heat: { 
        type: Number, 
        required: true }, 
    likes: { type: Number},
    dislikes: { type: Number},
    usersLiked: { type:Array},
    usersDisliked: { type:Array},
});


module.exports = mongoose.model('Sauce', sauceSchema);