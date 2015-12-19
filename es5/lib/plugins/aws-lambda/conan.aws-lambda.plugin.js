"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var ConanAwsLambdaPlugin = (function () {
	function ConanAwsLambdaPlugin(conan) {
		_classCallCheck(this, ConanAwsLambdaPlugin);

		(0, _incognito2["default"])(this).conan = conan;

		conan.lambda = this.newLambda;
	}

	_createClass(ConanAwsLambdaPlugin, [{
		key: "newLambda",
		value: function newLambda() {}
	}]);

	return ConanAwsLambdaPlugin;
})();

exports["default"] = ConanAwsLambdaPlugin;
module.exports = exports["default"];