"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _stepsConanFindApiStepJs = require("./steps/conan.findApi.step.js");

var _stepsConanFindApiStepJs2 = _interopRequireDefault(_stepsConanFindApiStepJs);

var _awsApiBuilderJs = require("./awsApiBuilder.js");

var _awsApiBuilderJs2 = _interopRequireDefault(_awsApiBuilderJs);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var ConanAwsApiPlugin = (function () {
	function ConanAwsApiPlugin(conan) {
		_classCallCheck(this, ConanAwsApiPlugin);

		(0, _incognito2["default"])(this).conan = conan;
		conan.api = this.newApi;
	}

	_createClass(ConanAwsApiPlugin, [{
		key: "newApi",
		value: function newApi(name) {
			var conan = (0, _incognito2["default"])(this).conan;
			return new ConanAwsApi(conan, name);
		}
	}]);

	return ConanAwsApiPlugin;
})();

exports["default"] = ConanAwsApiPlugin;
module.exports = exports["default"];