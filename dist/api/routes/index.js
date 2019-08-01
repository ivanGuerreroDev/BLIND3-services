"use strict";

var express = require('express');

var router = express.Router();

var passport = require('passport');

router.use('/', require('./usuarios'));
module.exports = router;