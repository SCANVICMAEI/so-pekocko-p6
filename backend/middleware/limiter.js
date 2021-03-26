const rateLimit = require('express-rate-limit'); //pour limiter tentative d identifications

const limiter = rateLimit({ // limite le nombre d identification
    windowMs: 60 * 1000, // 1 minute
    max: 3 //3 requetes max par minute
  });

module.exports = limiter ;