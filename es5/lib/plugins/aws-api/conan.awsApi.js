"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _stepsConanFindApiStepJs = require("./steps/conan.findApi.step.js");

var _stepsConanFindApiStepJs2 = _interopRequireDefault(_stepsConanFindApiStepJs);

var _awsApiBuilderJs = require("./awsApiBuilder.js");

var _awsApiBuilderJs2 = _interopRequireDefault(_awsApiBuilderJs);

var ConanAwsApi = function ConanAwsApi(conan) {
	_classCallCheck(this, ConanAwsApi);

	conan.api = function (name) {
		var awsApiBuilder = new _awsApiBuilderJs2["default"](name);
		conan.steps.add(_stepsConanFindApiStepJs2["default"]); // HACK: idea: step data structure maybe as second arg here?
		return awsApiBuilder;
	};
};

exports["default"] = ConanAwsApi;
module.exports = exports["default"];