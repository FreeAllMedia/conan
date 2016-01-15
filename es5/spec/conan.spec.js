/* eslint-disable no-unused-vars */
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _libComponentsConanComponentJs = require("../lib/components/conanComponent.js");

var _libComponentsConanComponentJs2 = _interopRequireDefault(_libComponentsConanComponentJs);

var _libPluginsAwsLambdaConanAwsLambdaPluginJs = require("../lib/plugins/aws-lambda/conanAwsLambdaPlugin.js");

var _libPluginsAwsLambdaConanAwsLambdaPluginJs2 = _interopRequireDefault(_libPluginsAwsLambdaConanAwsLambdaPluginJs);

var _libPluginsAwsApiGatewayConanAwsApiGatewayPluginJs = require("../lib/plugins/aws-api-gateway/conanAwsApiGatewayPlugin.js");

var _libPluginsAwsApiGatewayConanAwsApiGatewayPluginJs2 = _interopRequireDefault(_libPluginsAwsApiGatewayConanAwsApiGatewayPluginJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe("Conan(config)", function () {
	var conan = undefined;

	beforeEach(function () {
		conan = new _libConanJs2["default"]();
	});

	it("should pass itself to ConanSteps", function () {
		conan.steps.parent.should.eql(conan);
	});

	describe("(Instantiating with a config object)", function () {
		it("should not throw an error", function () {
			(function () {
				var config = { key: "value" };
				conan = new _libConanJs2["default"](config);
			}).should.not["throw"]();
		});

		it("should save config object to conan.config", function () {
			var config = { key: "value" };
			conan = new _libConanJs2["default"](config);
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
			_libConanJs.ConanComponent.should.eql(_libComponentsConanComponentJs2["default"]);
		});

		it("should export ConanAwsLambdaPlugin", function () {
			_libConanJs.ConanAwsLambdaPlugin.should.eql(_libPluginsAwsLambdaConanAwsLambdaPluginJs2["default"]);
		});

		it("should export ConanAwsApiGatewayPlugin", function () {
			_libConanJs.ConanAwsApiGatewayPlugin.should.eql(_libPluginsAwsApiGatewayConanAwsApiGatewayPluginJs2["default"]);
		});
	});
});