"use strict";

var _conan = require("../../lib/conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("conan.deploy(callback)", function () {
	var conan = undefined;

	beforeEach(function () {
		conan = new _conan2.default();
	});

	it("should run all step functions in order", function (done) {
		var conanStepFunction = function conanStepFunction(stepConan, context, stepDone) {
			return stepDone();
		};

		var conanStepOne = _sinon2.default.spy(conanStepFunction);
		var conanStepTwo = _sinon2.default.spy(conanStepFunction);

		conan.steps.add(conanStepOne);
		conan.steps.add(conanStepTwo);

		conan.deploy(function (error) {
			_sinon2.default.assert.callOrder(conanStepOne, conanStepTwo);
			done(error);
		});
	});

	it("should return step errors", function (done) {
		var conanStepError = new Error("Some error happened!");

		var conanStepWithErrorFunction = function conanStepWithErrorFunction(stepConan, context, stepDone) {
			stepDone(conanStepError);
		};

		var conanStepOne = _sinon2.default.spy(conanStepWithErrorFunction);
		var conanStepTwo = _sinon2.default.spy();

		conan.steps.add(conanStepOne);
		conan.steps.add(conanStepTwo);

		conan.deploy(function (error) {
			error.should.eql(conanStepError);
			done();
		});
	});

	it("should halt step execution if an error is returned", function (done) {
		var conanStepError = new Error("Some error happened!");

		var conanStepWithError = function conanStepWithError(stepConan, context, stepDone) {
			stepDone(conanStepError);
		};

		var conanStepOne = _sinon2.default.spy(conanStepWithError);
		var conanStepTwo = _sinon2.default.spy();

		conan.steps.add(conanStepOne);
		conan.steps.add(conanStepTwo);

		conan.deploy(function () {
			conanStepTwo.called.should.be.false;
			done();
		});
	});
});