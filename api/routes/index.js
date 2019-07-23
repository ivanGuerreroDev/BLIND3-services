var express = require('express');
var router = express.Router();

router.use('/', require('./usuarios'));

module.exports = router;