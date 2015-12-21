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
		var path = undefined;
		var handler = undefined;

		beforeEach(function () {
			name = "AccountCreate";
			path = "/account/create";
			handler = "handler";

			lambda = conan.lambda(name, path, handler);
		});

		it("should return an instance of ConanAwsLambda", function () {
			lambda.should.be.instanceOf(_componentsConanAwsLambdaJs2["default"]);
		});

		it("should pass conan to the ConanAwsLambda constructor", function () {
			lambda.properties.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", function () {
			lambda.properties.name.should.eql(name);
		});

		it("should pass the lambda path to the ConanAwsLambda constructor", function () {
			lambda.properties.path.should.eql(path);
		});

		it("should pass the lambda handler to the ConanAwsLambda constructor", function () {
			lambda.properties.handler.should.eql(handler);
		});
	});
});