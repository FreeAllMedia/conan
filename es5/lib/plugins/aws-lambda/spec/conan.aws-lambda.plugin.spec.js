"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsLambdaJs = require("../components/conanAwsLambda.js");

var _componentsConanAwsLambdaJs2 = _interopRequireDefault(_componentsConanAwsLambdaJs);

var _conanAwsLambdaPluginJs = require("../conan.aws-lambda.plugin.js");

var _conanAwsLambdaPluginJs2 = _interopRequireDefault(_conanAwsLambdaPluginJs);

describe("ConanAwsLambdaPlugin(conan)", function () {
	var conan = undefined;

	beforeEach(function () {
		conan = new _conanJs2["default"]();
		conan.use(_conanAwsLambdaPluginJs2["default"]);
	});

	it("should setup conan.lambda()", function () {
		(typeof conan.lambda).should.eql("function");
	});

	it("should setup an empty object to hold lambdas at conan.lambdas", function () {
		conan.lambdas.should.eql({});
	});

	describe("conan.lambda(name, handlerPath)", function () {
		var lambda = undefined;
		var name = undefined;
		var handler = undefined;

		beforeEach(function () {
			name = "AccountCreate";
			handler = "handler";

			lambda = conan.lambda(name, handler);
		});

		it("should return an instance of ConanAwsLambda", function () {
			lambda.should.be.instanceOf(_componentsConanAwsLambdaJs2["default"]);
		});

		it("should pass conan to the ConanAwsLambda constructor", function () {
			lambda.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", function () {
			lambda.parameters.name.should.eql(name);
		});

		it("should pass the lambda handler to the ConanAwsLambda constructor", function () {
			lambda.parameters.handler.should.eql(handler);
		});
	});
});