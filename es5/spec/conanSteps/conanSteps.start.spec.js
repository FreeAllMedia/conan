"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanStepsJs = require("../../lib/conanSteps.js");

var _libConanStepsJs2 = _interopRequireDefault(_libConanStepsJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe("conanSteps.start(callback)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _libConanStepsJs2["default"]();
	});

	it("should run all step functions in order", function (done) {
		var conanStepFunction = function conanStepFunction(conan, doneStep) {
			return doneStep();
		};

		var conanStepOne = _sinon2["default"].spy(conanStepFunction);
		var conanStepTwo = _sinon2["default"].spy(conanStepFunction);

		conanSteps.add(conanStepOne);
		conanSteps.add(conanStepTwo);

		conanSteps.start(function (error) {
			_sinon2["default"].assert.callOrder(conanStepOne, conanStepTwo);
			done(error);
		});
	});
});