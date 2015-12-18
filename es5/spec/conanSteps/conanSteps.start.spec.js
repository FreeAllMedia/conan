"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanStepsJs = require("../../lib/conanSteps.js");

var _libConanStepsJs2 = _interopRequireDefault(_libConanStepsJs);

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe("conanSteps.start(callback)", function () {
	var conan = undefined,
	    conanSteps = undefined,
	    conanStepOne = undefined,
	    conanStepTwo = undefined;

	beforeEach(function () {
		conan = new _libConanJs2["default"]();
		conanSteps = new _libConanStepsJs2["default"](conan);
		var conanStepFunction = function conanStepFunction(conan, context, stepDone) {
			return stepDone();
		};

		conanStepOne = _sinon2["default"].spy(conanStepFunction);
		conanStepTwo = _sinon2["default"].spy(conanStepFunction);
		conanSteps.add(conanStepOne);
		conanSteps.add(conanStepTwo);
	});

	it("should run all step functions in order", function (done) {
		conanSteps.start(function (error) {
			_sinon2["default"].assert.callOrder(conanStepOne, conanStepTwo);
			done(error);
		});
	});

	it("should pass conan as the first argument to each step", function (done) {
		conanSteps.start(function (error) {
			conanStepOne.firstCall.args[0].should.eql(conan);
			done(error);
		});
	});

	it("should pass the api context as the second argument to each step");
	it("should pass step callback as the last argument to each step");

	it("should aggregate context changes across steps");
});