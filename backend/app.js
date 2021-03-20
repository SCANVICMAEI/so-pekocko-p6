const express = require('express');

const bodyParser = require('body-parser'); // permet d'extraire l'objet json de la demande 

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

app.use((req, res, next) => {//ajoute header a l'objet reponse sera appliquer a toute les routes envoyer au serveur / permet d'accder a notre api depuis n 'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());//transforme le corp du java script en objet json  

app.use('/images',express.static(path.join(__dirname,'images')));

app.use('/api/sauces',sauceRoutes)

app.use('/api/auth', userRoutes);

module.exports = app;