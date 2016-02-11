"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _conanSteps = require("../../../lib/components/conanSteps.js");

var _conanSteps2 = _interopRequireDefault(_conanSteps);

var _conan = require("../../../lib/conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("conanSteps.start(callback)", function () {
	var conan = undefined,
	    steps = undefined,
	    stepOne = undefined,
	    stepOneParameters = undefined,
	    stepTwo = undefined,
	    stepTwoParameters = undefined,
	    temporaryFilePath = undefined;

	beforeEach(function (done) {
		conan = new _conan2.default();
		steps = new _conanSteps2.default(conan);

		steps.library("sinon", _sinon2.default);

		stepOne = _sinon2.default.spy(function (parentConan, context, stepDone) {
			temporaryFilePath = context.temporaryDirectoryPath + "/temp.file";
			_fs2.default.writeFile(temporaryFilePath, "Hello!", function () {
				stepDone(null, { apiId: 15 });
			});
		});

		stepTwo = _sinon2.default.spy(function (parentConan, context, stepDone) {
			stepDone(null, { stageId: 8 });
		});

		stepOneParameters = { "apiName": "test-dev" };
		steps.add(stepOne, stepOneParameters);

		stepTwoParameters = { "stageName": "production" };
		steps.add(stepTwo, stepTwoParameters);

		steps.start(done);
	});

	it("should run all step functions in order", function () {
		_sinon2.default.assert.callOrder(stepOne, stepTwo);
	});

	it("should pass conan as the first argument to each step", function () {
		stepOne.firstCall.args[0].should.eql(conan);
	});

	it("should pass the step parameters through the context", function () {
		stepOne.firstCall.args[1].parameters.should.eql(stepOneParameters);
	});

	it("should pass the step libraries through the context", function () {
		stepOne.firstCall.args[1].libraries.should.eql({
			sinon: _sinon2.default
		});
	});

	it("should pass the step a temp directory path through the context", function () {
		stepOne.firstCall.args[1].temporaryDirectoryPath.should.include("conanSteps");
	});

	it("should pass the step results through the context", function () {
		stepTwo.firstCall.args[1].results.should.eql({
			apiId: 15
		});
	});

	it("should pass step callback as the last argument to each step", function () {
		_typeof(stepOne.firstCall.args[2]).should.equal("function");
	});

	describe("(Error handling)", function () {
		var stepError = undefined;

		beforeEach(function () {
			conan = new _conan2.default();
			steps = new _conanSteps2.default(conan);
			stepError = new Error("Some step error");

			stepOne = _sinon2.default.spy(function (parentConan, context, stepDone) {
				stepDone(stepError);
			});

			stepOneParameters = { "apiName": "test-dev" };
			steps.add(stepOne, stepOneParameters);
		});

		it("should return the step error to the final callback so the user knows why the proccess failed", function (done) {
			steps.start(function (error) {
				error.should.eql(stepError);
				done();
			});
		});
	});

	describe("(Temp Directory)", function () {
		it("should create the temp directory", function (done) {
			var stepThree = _sinon2.default.spy(function (parentConan, context, stepDone) {
				_fs2.default.existsSync(context.temporaryDirectoryPath).should.be.true;
				stepDone();
			});
			steps.add(stepThree, {});
			steps.start(function () {
				done();
			});
		});

		// it("should track and remove all temp files after all steps have finished", done => {
		// 	fs.exists(temporaryFilePath, tempfileExists => {
		// 		tempfileExists.should.be.false;
		// 		done();
		// 	});
		// });
	});
});