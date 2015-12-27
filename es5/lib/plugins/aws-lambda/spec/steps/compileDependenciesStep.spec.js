"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsCompileDependenciesStepJs = require("../../steps/compileDependenciesStep.js");

var _stepsCompileDependenciesStepJs2 = _interopRequireDefault(_stepsCompileDependenciesStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe(".compileDependenciesStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    lambdaResponseError = undefined,
	    lambdaResponseData = undefined,
	    s3ResponseError = undefined,
	    s3ResponseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    payload = undefined;

	var mockLambda = {
		invoke: _sinon2["default"].spy(function (params, callback) {
			callback(lambdaResponseError, lambdaResponseData);
		})
	};

	var mockGetObjectStream = {};

	var mockS3 = {
		getObject: _sinon2["default"].spy(function (params) {
			return mockGetObjectStream;
		})
	};

	var MockAWS = {
		S3: _sinon2["default"].spy(function () {
			return mockS3;
		}),
		Lambda: _sinon2["default"].spy(function () {
			return mockLambda;
		})
	};

	beforeEach(function (done) {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		payload = {
			packages: { "dovima": "^1.0.0" },
			bucket: "some-bucket-here",
			key: "something.zip"
		};

		context = {
			parameters: payload,
			dependencies: { AWS: MockAWS },
			results: {}
		};

		// "Lambda Found" response by default
		lambdaResponseData = {};
		lambdaResponseError = null;

		stepDone = function (afterStepCallback) {
			return function (error, data) {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		(0, _stepsCompileDependenciesStepJs2["default"])(conan, context, stepDone(done));
	});

	it("should be a function", function () {
		(typeof _stepsCompileDependenciesStepJs2["default"]).should.equal("function");
	});

	it("should set the designated region on the lambda client", function () {
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	it("should set the designated region on the s3 client", function () {
		MockAWS.S3.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	it("should call AWS with the designated lambda parameters", function () {
		mockLambda.invoke.firstCall.args[0].should.eql({
			FunctionName: "Thaumaturgy",
			InvocationType: "RequestResponse",
			LogType: "Tail",
			Payload: JSON.stringify(payload)
		});
	});

	it("should call AWS with the designated S3 parameters", function () {
		mockS3.getObject.firstCall.args[0].should.eql({
			Bucket: payload.bucket,
			Key: payload.key
		});
	});

	it("should return the dependency zip files read stream", function () {
		stepReturnData.should.eql({
			dependencyZipStream: mockGetObjectStream
		});
	});
});