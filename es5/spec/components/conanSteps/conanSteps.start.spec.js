"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libComponentsConanStepsJs = require("../../../lib/components/conanSteps.js");

var _libComponentsConanStepsJs2 = _interopRequireDefault(_libComponentsConanStepsJs);

var _libConanJs = require("../../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe("conanSteps.start(callback)", function () {
	var conan = undefined,
	    steps = undefined,
	    stepOne = undefined,
	    stepOneParameters = undefined,
	    stepTwo = undefined,
	    stepTwoParameters = undefined;

	beforeEach(function () {
		conan = new _libConanJs2["default"]();
		steps = new _libComponentsConanStepsJs2["default"](conan);

		stepOne = _sinon2["default"].spy(function (parentConan, context, done) {
			done(null, { apiId: 15 });
		});

		stepTwo = _sinon2["default"].spy(function (parentConan, context, done) {
			done(null, { stageId: 8 });
		});

		stepOneParameters = { "apiName": "test-dev" };
		steps.add(stepOne, stepOneParameters);

		stepTwoParameters = { "stageName": "production" };
		steps.add(stepTwo, stepTwoParameters);
	});

	it("should run all step functions in order", function (done) {
		steps.start(function (error) {
			_sinon2["default"].assert.callOrder(stepOne, stepTwo);
			done(error);
		});
	});

	it("should pass conan as the first argument to each step", function (done) {
		steps.start(function (error) {
			stepOne.firstCall.args[0].should.eql(conan);
			done(error);
		});
	});

	it("should pass the step context as the second argument to each step", function (done) {
		steps.start(function (error) {
			stepOne.firstCall.args[1].should.eql({
				parameters: stepOneParameters,
				results: {}
			});
			done(error);
		});
	});
	it("should pass step callback as the last argument to each step", function (done) {
		steps.start(function (error) {
			(typeof stepOne.firstCall.args[2]).should.equal("function");
			done(error);
		});
	});

	it("should pass results to each next step", function (done) {
		steps.start(function (error) {
			stepTwo.firstCall.args[1].should.eql({
				parameters: stepTwoParameters,
				results: {
					apiId: 15
				}
			});
			done(error);
		});
	});
});