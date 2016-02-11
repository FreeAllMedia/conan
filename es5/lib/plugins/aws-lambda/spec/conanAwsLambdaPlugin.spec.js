"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _conan = require("../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _conanAwsLambda = require("../components/conanAwsLambda.js");

var _conanAwsLambda2 = _interopRequireDefault(_conanAwsLambda);

var _conanAwsLambdaPlugin = require("../conanAwsLambdaPlugin.js");

var _conanAwsLambdaPlugin2 = _interopRequireDefault(_conanAwsLambdaPlugin);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ConanAwsLambdaPlugin(conan)", function () {
	var conan = undefined;

	beforeEach(function () {
		conan = new _conan2.default();
		conan.use(_conanAwsLambdaPlugin2.default);
	});

	it("should set conan.config.region to 'us-east-1' if not already set", function () {
		conan.config.region.should.eql("us-east-1");
	});

	it("should NOT set conan.config.region to 'us-east-1' if already set", function () {
		conan = new _conan2.default({
			region: "us-west-2"
		});
		conan.use(_conanAwsLambdaPlugin2.default);
		conan.config.region.should.eql("us-west-2");
	});

	it("should set conan.config.basePath to process.cwd if not already set", function () {
		conan.config.basePath.should.eql(process.cwd());
	});

	it("should NOT set conan.config.basePath to process.cwd if already set", function () {
		conan = new _conan2.default({
			basePath: "myCustomPath"
		});
		conan.use(_conanAwsLambdaPlugin2.default);
		conan.config.basePath.should.eql("myCustomPath");
	});

	it("should setup conan.lambda()", function () {
		_typeof(conan.lambda).should.eql("function");
	});

	it("should setup an empty object to hold lambdas at conan.lambdas", function () {
		conan.lambdas.should.eql({});
	});

	describe("(AWS)", function () {
		before(function () {
			conan = new _conan2.default();
			conan.steps.constructor.prototype.library = _sinon2.default.spy(conan.steps.constructor.prototype.library);
			conan.use(_conanAwsLambdaPlugin2.default);
		});

		it("should add the AWS library", function () {
			conan.steps.library.calledWith("AWS", _awsSdk2.default).should.be.true;
		});
	});

	describe("conan.lambda(name, handlerPath)", function () {
		var lambda = undefined;
		var name = undefined;
		var filePath = undefined;
		var handler = undefined;

		beforeEach(function () {
			name = "AccountCreate";
			filePath = "/account/create";
			handler = "handler";

			lambda = conan.lambda(name, filePath, handler);
		});

		it("should return an instance of ConanAwsLambda", function () {
			lambda.should.be.instanceOf(_conanAwsLambda2.default);
		});

		it("should pass conan to the ConanAwsLambda constructor", function () {
			lambda.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", function () {
			lambda.name().should.eql(name);
		});

		it("should pass the lambda file path to the ConanAwsLambda constructor", function () {
			lambda.filePath().should.eql(filePath);
		});

		it("should pass the lambda handler to the ConanAwsLambda constructor", function () {
			lambda.handler().should.eql([handler]);
		});
	});
});