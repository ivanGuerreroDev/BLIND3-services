"use strict";

var jwt = require('jsonwebtoken');

var config = require('../../config');

var checkToken = function checkToken(req, res, next) {
  var header = req.headers['authorization'];

  if (typeof header !== 'undefined') {
    var bearer = header.split(' ');
    var clave = bearer[1];
    jwt.verify(clave, config.secret, function (err, decoded) {
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
    console.log('acceso denegado');
    res.sendStatus(403);
  }
};

module.exports = checkToken;