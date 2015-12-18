"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanAwsApi = function ConanAwsApi(conan, name) {
	_classCallCheck(this, ConanAwsApi);

	conan.steps.add(findApiStep, {
		apiName: name
	});

	conan.steps.add(findStageStep, {
		apiName: name,
		stageName: name
	});
};

exports["default"] = ConanAwsApi;
module.exports = exports["default"];