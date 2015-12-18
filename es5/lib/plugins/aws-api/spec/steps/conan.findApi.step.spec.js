"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rewire = require("rewire");

var _rewire2 = _interopRequireDefault(_rewire);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var conanFindApiStep = (0, _rewire2["default"])("../../steps/conan.findApi.step.js");

describe("conanFindApiStep", function () {
	var awsSpy = undefined,
	    conanContext = undefined,
	    awsApiGatewayConstructorSpy = undefined;

	before(function () {
		conanContext = {
			config: function config() {
				return "us-east-1";
			}
		};
		awsSpy = _sinon2["default"].spy(function (params, callback) {
			callback();
		});
		awsApiGatewayConstructorSpy = _sinon2["default"].spy();
		conanFindApiStep.__set__("ApiGateWayConstructor", function (params) {
			awsApiGatewayConstructorSpy(params);
			return {
				getRestApis: awsSpy
			};
		});
	});

	it("should be a function", function () {
		(typeof conanFindApiStep).should.equal("function");
	});

	it("should call the aws sdk get-api function", function (done) {
		conanFindApiStep(conanContext, function () {
			awsSpy.called.should.be["true"];
			done();
		});
	});

	it("should call the constructor with the appropiate region", function (done) {
		conanFindApiStep(conanContext, function () {
			awsApiGatewayConstructorSpy.calledWith({ region: "us-east-1" }).should.be["true"];
			done();
		});
	});

	describe("(scenarios)", function () {
		var keyAwsApiName = undefined;
		var keyAwsApiId = undefined;
		var keyAwsApiObject = undefined;
		var awsGetRestApisResponse = undefined;

		before(function () {
			keyAwsApiName = "testName";
			keyAwsApiId = "xgslsi7";
			keyAwsApiObject = { name: keyAwsApiName, id: keyAwsApiId };
			awsGetRestApisResponse = { items: [keyAwsApiObject, { name: "other", id: "ss" }] };

			awsSpy = _sinon2["default"].spy(function (params, callback) {
				callback(null, awsGetRestApisResponse);
			});

			conanFindApiStep.__set__("ApiGateWayConstructor", function () {
				return {
					getRestApis: awsSpy
				};
			});
		});

		describe("(when the api exists)", function () {
			it("should return the existing api", function (done) {
				conanContext.stepBuilder = { name: keyAwsApiName };
				conanFindApiStep(conanContext, function (error, result) {
					result.should.eql(keyAwsApiObject);
					done();
				});
			});
		});

		describe("(when the api do not exists)", function () {
			it("should return null/undefined", function (done) {
				conanContext.stepBuilder = { name: "unexistingName" };
				conanFindApiStep(conanContext, function (error, result) {
					(!result).should.be["true"];
					done();
				});
			});
		});
	});
});