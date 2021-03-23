const express = require('express');

const app = express();

const mongoose = require('mongoose');

const path = require('path');

// Importation des  routes

const sauceRoutes = require('./routes/sauce'); 

const userRoutes = require('./routes/user');

// Mise en place securité

var Ddos = require('ddos')

var ddos = new Ddos({burst:10, limit:15})

app.use(ddos.express);

require('dotenv').config(); //pour definir les variables d environnement 

const helmet = require('helmet'); //definit les entetes HTTP

const mongoSanitize = require('express-mongo-sanitize'); //desinfecte donnees fournies par user

const rateLimit = require('express-rate-limit'); //pour limiter tentative d identifications

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.a7nwc.mongodb.net/${process.env.DB_LINK}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
   })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.urlencoded({extended: true})); //remplace bodyParser

app.use(express.json());

app.use('/images',express.static(path.join(__dirname,'images')));

app.use('/api/sauces',sauceRoutes)

app.use('/api/auth', userRoutes);

app.use(helmet());

const limiter = rateLimit({ // limite le nombre d identification
  windowMs: 60 * 1000, // 1 minute
  max: 3 //3 requetes max par minute
});

app.use(limiter);

app.use(mongoSanitize());

module.exports = app;