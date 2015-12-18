"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function start(callback) {
	var _ = (0, _incognito2["default"])(this);
	_flowsync2["default"].mapSeries(_.steps, function (step, done) {
		step(_.parent, _.context, done);
	}, callback);
}

module.exports = exports["default"];