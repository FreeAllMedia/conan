"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _conan = require("../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _conanAwsApiGateway = require("../components/conanAwsApiGateway.js");

var _conanAwsApiGateway2 = _interopRequireDefault(_conanAwsApiGateway);

var _conanAwsApiGatewayPlugin = require("../conanAwsApiGatewayPlugin.js");

var _conanAwsApiGatewayPlugin2 = _interopRequireDefault(_conanAwsApiGatewayPlugin);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ConanAwsApiGatewayPlugin(conan)", function () {
	var conan = undefined,
	    api = undefined;

	beforeEach(function () {
		conan = new _conan2.default();
		conan.use(_conanAwsApiGatewayPlugin2.default);
	});

	it("should setup conan.api()", function () {
		_typeof(conan.api).should.eql("function");
	});

	it("should setup an empty object to hold apis at conan.apis", function () {
		conan.apis.should.eql({});
	});

	describe("(AWS)", function () {
		var librarySpy = undefined;
		var fakeConan = undefined;

		before(function (done) {
			librarySpy = _sinon2.default.spy();

			fakeConan = {
				steps: {
					library: function library(name, value) {
						librarySpy(name, value);
						done();
					}
				}
			};

			/* eslint-disable no-new */
			new _conanAwsApiGatewayPlugin2.default(fakeConan);
		});

		it("should add the AWS library", function () {
			librarySpy.calledWith("AWS", _awsSdk2.default).should.be.true;
		});
	});

	describe("conan.api(name)", function () {
		var name = undefined;

		beforeEach(function () {
			name = "MyAPI";

			api = conan.api(name);
		});

		it("should return an instance of ConanAwsApiGateway", function () {
			api.should.be.instanceOf(_conanAwsApiGateway2.default);
		});

		it("should pass conan to the ConanAwsApiGateway constructor", function () {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsApiGateway constructor", function () {
			api.name().should.eql(name);
		});
	});
});