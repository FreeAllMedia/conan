"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsLambdaJs = require("../components/conanAwsLambda.js");

var _componentsConanAwsLambdaJs2 = _interopRequireDefault(_componentsConanAwsLambdaJs);

var _conanAwsLambdaPluginJs = require("../conanAwsLambdaPlugin.js");

var _conanAwsLambdaPluginJs2 = _interopRequireDefault(_conanAwsLambdaPluginJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

describe("ConanAwsLambdaPlugin(conan)", function () {
	var conan = undefined;

	beforeEach(function () {
		conan = new _conanJs2["default"]();
		conan.use(_conanAwsLambdaPluginJs2["default"]);
	});

	it("should set conan.config.region to 'us-east-1' if not already set", function () {
		conan.config.region.should.eql("us-east-1");
	});

	it("should NOT set conan.config.region to 'us-east-1' if already set", function () {
		conan = new _conanJs2["default"]({
			region: "us-west-2"
		});
		conan.use(_conanAwsLambdaPluginJs2["default"]);
		conan.config.region.should.eql("us-west-2");
	});

	it("should setup conan.lambda()", function () {
		(typeof conan.lambda).should.eql("function");
	});

	it("should setup an empty object to hold lambdas at conan.lambdas", function () {
		conan.lambdas.should.eql({});
	});

	describe("(AWS)", function () {
		before(function () {
			conan = new _conanJs2["default"]();
			conan.steps.constructor.prototype.library = _sinon2["default"].spy(conan.steps.constructor.prototype.library);
			conan.use(_conanAwsLambdaPluginJs2["default"]);
		});

		it("should add the AWS library", function () {
			conan.steps.library.calledWith("AWS", _awsSdk2["default"]).should.be["true"];
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
			lambda.should.be.instanceOf(_componentsConanAwsLambdaJs2["default"]);
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