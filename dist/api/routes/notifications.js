"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _expoServerSdk = _interopRequireDefault(require("expo-server-sdk"));

var _multer = _interopRequireDefault(require("multer"));

// Create a new Expo SDK client
var expo = new _expoServerSdk["default"]();

var express = require('express');

var router = express.Router();

var path = require('path');

var passport = require('passport');

var connection = require('../config/db');

var bcrypt = require('bcrypt');

module.exports = function (pushToken, message, data) {
  var messages = [];
  messages.push({
    to: pushToken,
    sound: 'default',
    body: message,
    data: data
  });
  var chunks = expo.chunkPushNotifications(messages);
  var tickets = [];
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, ticketChunk;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 3;
            _iterator = chunks[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 21;
              break;
            }

            chunk = _step.value;
            _context.prev = 7;
            _context.next = 10;
            return expo.sendPushNotificationsAsync(chunk);

          case 10:
            ticketChunk = _context.sent;
            console.log(ticketChunk);
            tickets.push.apply(tickets, (0, _toConsumableArray2["default"])(ticketChunk));
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](7);
            console.error(_context.t0);

          case 18:
            _iteratorNormalCompletion = true;
            _context.next = 5;
            break;

          case 21:
            _context.next = 27;
            break;

          case 23:
            _context.prev = 23;
            _context.t1 = _context["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 27:
            _context.prev = 27;
            _context.prev = 28;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 30:
            _context.prev = 30;

            if (!_didIteratorError) {
              _context.next = 33;
              break;
            }

            throw _iteratorError;

          case 33:
            return _context.finish(30);

          case 34:
            return _context.finish(27);

          case 35:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 23, 27, 35], [7, 15], [28,, 30, 34]]);
  }))();
};