"use strict";

var _conan = require("../lib/conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _conanComponent = require("../lib/components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _conanAwsLambdaPlugin = require("../lib/plugins/aws-lambda/conanAwsLambdaPlugin.js");

var _conanAwsLambdaPlugin2 = _interopRequireDefault(_conanAwsLambdaPlugin);

var _conanAwsApiGatewayPlugin = require("../lib/plugins/aws-api-gateway/conanAwsApiGatewayPlugin.js");

var _conanAwsApiGatewayPlugin2 = _interopRequireDefault(_conanAwsApiGatewayPlugin);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Conan(config)", function () {
	var conan = undefined;

	beforeEach(function () {
		conan = new _conan2.default();
	});

	it("should pass itself to ConanSteps", function () {
		conan.steps.parent.should.eql(conan);
	});

	describe("(Instantiating with a config object)", function () {
		it("should not throw an error", function () {
			(function () {
				var config = { key: "value" };
				conan = new _conan2.default(config);
			}).should.not.throw();
		});

		it("should save config object to conan.config", function () {
			var config = { key: "value" };
			conan = new _conan2.default(config);
			conan.config.should.eql(config);
		});
	});

	describe("(Instantiating without a config object)", function () {
		it("should save an empty object to conan.config", function () {
			conan.config.should.eql({});
		});
	});

	describe("(Exports)", function () {
		it("should export ConanComponent", function () {
			_conan.ConanComponent.should.eql(_conanComponent2.default);
		});

		it("should export ConanAwsLambdaPlugin", function () {
			_conan.ConanAwsLambdaPlugin.should.eql(_conanAwsLambdaPlugin2.default);
		});

		it("should export ConanAwsApiGatewayPlugin", function () {
			_conan.ConanAwsApiGatewayPlugin.should.eql(_conanAwsApiGatewayPlugin2.default);
		});
	});
}); /* eslint-disable no-unused-vars */