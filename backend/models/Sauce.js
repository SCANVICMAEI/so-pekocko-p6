const mongoose = require('mongoose');


//modèle
const sauceSchema = mongoose.Schema({
    userId: { type: String },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true }, 
    likes: { type: Number},
    dislikes: { type: Number},
    userLiked: { type: String },
    userDisliked: { type: String},
});

module.exports = mongoose.model('Sauce', sauceSchema);