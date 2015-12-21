"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _componentsConanAwsLambdaJs = require("./components/conanAwsLambda.js");

var _componentsConanAwsLambdaJs2 = _interopRequireDefault(_componentsConanAwsLambdaJs);

var ConanAwsLambdaPlugin = (function () {
	function ConanAwsLambdaPlugin(conan) {
		_classCallCheck(this, ConanAwsLambdaPlugin);

		conan.lambda = this.lambda;
		conan.lambdas = {};
	}

	_createClass(ConanAwsLambdaPlugin, [{
		key: "lambda",
		value: function lambda(name, filePath, handlerName) {
			return new _componentsConanAwsLambdaJs2["default"](this, name, filePath, handlerName);
		}
	}]);

	return ConanAwsLambdaPlugin;
})();

exports["default"] = ConanAwsLambdaPlugin;
module.exports = exports["default"];