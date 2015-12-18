"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var ConanAwsLambda = function ConanAwsLambda(conan) {
	_classCallCheck(this, ConanAwsLambda);

	(0, _incognito2["default"])(this).conan = conan;

	// conan.lambda = this;
};

exports["default"] = ConanAwsLambda;
module.exports = exports["default"];