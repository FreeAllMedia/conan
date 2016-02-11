"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanAwsApiGateway = require("./components/conanAwsApiGateway.js");

var _conanAwsApiGateway2 = _interopRequireDefault(_conanAwsApiGateway);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanAwsApiGatewayPlugin = function () {
	function ConanAwsApiGatewayPlugin(conan) {
		_classCallCheck(this, ConanAwsApiGatewayPlugin);

		conan.api = this.api;
		conan.apis = {};
		conan.steps.library("AWS", _awsSdk2.default);
	}

	_createClass(ConanAwsApiGatewayPlugin, [{
		key: "api",
		value: function api(name) {
			return new _conanAwsApiGateway2.default(this, name);
		}
	}]);

	return ConanAwsApiGatewayPlugin;
}();

exports.default = ConanAwsApiGatewayPlugin;