const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');

const sauceRoutes = require('./routes/sauce'); 
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://maei:Romy@cluster0.a7nwc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
   })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//ajoute header a l'objet reponse sera appliquer a toute les routes envoyer au serveur 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//transforme le corp du java script en objet json  
app.use(bodyParser.json());

app.use('/images',express.static(path.join(__dirname,'images')));

app.use('/api/sauces',sauceRoutes)

app.use('/api/auth', userRoutes);

module.exports = app;