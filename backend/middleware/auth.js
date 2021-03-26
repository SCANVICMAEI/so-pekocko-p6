const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {// chaque requéte est verifier avec le token 
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,`${process.env.TOP_SECRET}`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};