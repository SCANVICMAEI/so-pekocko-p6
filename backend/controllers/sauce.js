const Sauce = require('../models/Sauce')

const fs = require('fs');

//POST
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   likes :0,
   dislikes:0,
  });


  sauce.save()
    .then(() => res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({error}));
};

//GET
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error: error}));
};

//PUT

exports.modifySauce = (req, res, next) => {
  if (req.file) {//Si une nouvelle image est reçue dans la requête
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const fileName = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${fileName}`, (err => {//On supprime l'ancienne image
                if (err) console.log(err);
                else {
                    console.log("Image supprimée: " + fileName);
                }
            }))
        })
  } 
  //On ajoute les nouvelles informations à l'objet sauce
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})//et on met à jour la base de données
  .then(() => res.status(200).json( {message: 'Sauce modifiée !'}))
  .catch(error => res.status(404).json({ error }));
}


//DELETE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
     _id: req.params.id
  })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
    Sauce.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({error}));
  });
})
  .catch(error => res.status(500).json({error}));
};


//POST
exports.voteSauce = (req, res, next) => {
  const Id = req.body.userId
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    switch (req.body.like) {
      case 1 : //if user likes the sauce
        if (!sauce.usersLiked.includes(Id)) { //If the user hasn't already liked the sauce
          /***increasing likes qtty by 1, pushing userId in usersLiked array ***/
          Sauce.updateOne({ _id: req.params.id }, {$inc: {likes: 1}, $push: {usersLiked: Id}, _id: req.params.id})
            .then(() => res.status(210).json({ message: 'La sauce a été likée'}))
            .catch(error => res.status(400).json({ error }));
        }
      break;

      case -1 : //if user dislikes the sauce
        if (!sauce.usersDisliked.includes(req.body.userId)) { //If the user hasn't already disliked the sauce
          /***increasing dislikes qtty by 1, pushing userId in usersDisliked array ***/
          Sauce.updateOne({ _id: req.params.id }, {$inc: {dislikes: 1}, $push: {usersDisliked: Id}, _id: req.params.id})
            .then(() => res.status(210).json({ message: 'La sauce a été likée'}))
            .catch(error => res.status(400).json({ error }));
        }
      break;

      case 0 : //if user either removes a like or a dislike
        if (sauce.usersLiked.includes(Id)) { //if userId alreadu in usersLiked array
          /***Decreasing likes by one, removing userId from usersLiked array***/
          Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: Id}, _id: req.params.id})
            .then(() => res.status(201).json({ message: 'Like supprimé'}))
            .catch(error => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(Id)) { //if userId already in usersDisliked array
          /***Decreasing dislikes by one, removing userId from usersDisliked array***/
          Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: Id}, _id: req.params.id})
            .then(() => res.status(201).json({ message: 'Dislike supprimé'}))
            .catch(error => res.status(400).json({ error }));	
        }
      break;

      default:
        throw { error: "Oops, il y a un problème ! "};
    }
  })
  .catch(error => res.status(500).json({ error }));
};




//GET
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


