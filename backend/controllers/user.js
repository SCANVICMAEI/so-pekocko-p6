const User = require('../models/User');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken'); // token et verification 

const maskData = require('maskdata');

const passwordValidator = require('password-validator');


let schema = new passwordValidator();//Shema MDP : min 5 caractères max 20 caractères/ min 2 minuscule / min 1 majuscule/ min 1 chiffre / pas d'espace / 
schema
.is().min(5) 
.is().max(20) 
.has().uppercase(2) 
.has().lowercase() 
.has().digits(1) 
.has().not().spaces()  
.is().not().oneOf(['Passw0rd', 'Password123']);

exports.signup = (req, res, next) => {
  if(!schema.validate(req.body.password)) {
    throw {error:'Attention le mot de passe n ai  pas assez securisé'}
}else {
    bcrypt.hash(req.body.password, 10)// hash mdp 
      .then(hash => {
        const user = new User({
          email: maskData.maskEmail2(req.body.email), 
          password: hash
        });       
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    } 
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email)})
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // compare mdp requète et mdp bdd
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                `${process.env.TOP_SECRET}`,
                { expiresIn: '24h' } // expire 24 h 
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }; 


