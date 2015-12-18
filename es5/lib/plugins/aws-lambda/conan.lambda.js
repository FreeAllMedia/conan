"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanAwsLambda = function ConanAwsLambda(conan) {
	_classCallCheck(this, ConanAwsLambda);

	conan.lambda = this;
};

exports["default"] = ConanAwsLambda;
module.exports = exports["default"];