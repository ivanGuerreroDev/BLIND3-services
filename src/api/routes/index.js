var express = require('express');
var router = express.Router();
const passport = require('passport');

router.use('/', require('./usuarios'));
router.use('/', require('./mensajes'));

module.exports = router;