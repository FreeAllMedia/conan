"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe("conan.deploy(callback)", function () {
	var conan = undefined;

	beforeEach(function () {
		conan = new _libConanJs2["default"]();
	});

	it("should run all step functions in order", function (done) {
		var conanStepFunction = function conanStepFunction(stepConan, stepDone) {
			return stepDone();
		};

		var conanStepOne = _sinon2["default"].spy(conanStepFunction);
		var conanStepTwo = _sinon2["default"].spy(conanStepFunction);

		conan.steps.add(conanStepOne);
		conan.steps.add(conanStepTwo);

		conan.deploy(function (error) {
			_sinon2["default"].assert.callOrder(conanStepOne, conanStepTwo);
			done(error);
		});
	});
});