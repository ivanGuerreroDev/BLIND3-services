
let jwt = require('jsonwebtoken');
const config = require('../../config');

let checkToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if(typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const clave = bearer[1];
      jwt.verify(clave, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            status: false,
            message: 'Token is not valid'
          });
        } 
        req.decoded = decoded;
        next();
      });
  } else {
      //If header is undefined return Forbidden (403)
      console.log('acceso denegado')
      res.sendStatus(403)
  } 
};

module.exports = checkToken