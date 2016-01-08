"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsGatewayApiJs = require("../components/conanAwsGatewayApi.js");

var _componentsConanAwsGatewayApiJs2 = _interopRequireDefault(_componentsConanAwsGatewayApiJs);

var _conanAwsGatewayApiPluginJs = require("../conanAwsGatewayApiPlugin.js");

var _conanAwsGatewayApiPluginJs2 = _interopRequireDefault(_conanAwsGatewayApiPluginJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

describe("ConanAwsGatewayApiPlugin(conan)", function () {
	var conan = undefined,
	    api = undefined;

	beforeEach(function () {
		conan = new _conanJs2["default"]();
		conan.use(_conanAwsGatewayApiPluginJs2["default"]);
	});

	it("should setup conan.api()", function () {
		(typeof conan.api).should.eql("function");
	});

	it("should setup an empty object to hold apis at conan.apis", function () {
		conan.apis.should.eql({});
	});

	describe("(AWS)", function () {
		var librarySpy = undefined;
		var fakeConan = undefined;

		before(function (done) {
			librarySpy = _sinon2["default"].spy();

			fakeConan = {
				steps: {
					library: function library(name, value) {
						librarySpy(name, value);
						done();
					}
				}
			};

			/* eslint-disable no-new */
			new _conanAwsGatewayApiPluginJs2["default"](fakeConan);
		});

		it("should add the AWS library", function () {
			librarySpy.calledWith("AWS", _awsSdk2["default"]).should.be["true"];
		});
	});

	describe("conan.api(name)", function () {
		var name = undefined;

		beforeEach(function () {
			name = "MyAPI";

			api = conan.api(name);
		});

		it("should return an instance of ConanAwsGatewayApi", function () {
			api.should.be.instanceOf(_componentsConanAwsGatewayApiJs2["default"]);
		});

		it("should pass conan to the ConanAwsGatewayApi constructor", function () {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsGatewayApi constructor", function () {
			api.name().should.eql(name);
		});
	});
});