const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

const limiter = require ('../middleware/limiter');

router.post('/',auth,limiter, multer, sauceCtrl.createSauce);
router.get('/:id',auth, sauceCtrl.getOneSauce);
router.put('/:id', auth,limiter, multer, sauceCtrl.modifySauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.post('/:id/like',auth, sauceCtrl.voteSauce)
router.get('/',auth, sauceCtrl.getAllSauce);

module.exports = router;