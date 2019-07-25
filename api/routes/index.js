var express = require('express');
var router = express.Router();
const passport = require('passport');

router.use('/', require('./usuarios'));

module.exports = router;