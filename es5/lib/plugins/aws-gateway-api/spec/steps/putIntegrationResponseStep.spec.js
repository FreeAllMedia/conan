"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _stepsPutIntegrationResponseStepJs = require("../../steps/putIntegrationResponseStep.js");

var _stepsPutIntegrationResponseStepJs2 = _interopRequireDefault(_stepsPutIntegrationResponseStepJs);

describe("putIntegrationResponseStep", function () {
	var putIntegrationResponseSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    apiResourceId = undefined,
	    responseTemplates = undefined,
	    should = undefined;

	var APIGateway = (function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "putIntegrationResponse",
			value: function putIntegrationResponse(params, callback) {
				putIntegrationResponseSpy(params, callback);
			}
		}]);

		return APIGateway;
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		constructorSpy = _sinon2["default"].spy();
		putIntegrationResponseSpy = _sinon2["default"].spy(function (params, callback) {
			callback();
		});
		should = _chai2["default"].should();

		parameters = new ((function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "method",
				value: function method() {
					return "GET";
				}
			}, {
				key: "statusCodes",
				value: function statusCodes() {
					return [200];
				}
			}]);

			return MockConanAwsParameters;
		})())();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";
		responseTemplates = { "application/json": "" };

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId,
				apiResourceId: apiResourceId
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsPutIntegrationResponseStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsPutIntegrationResponseStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			putIntegrationResponseSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				restApiId: restApiId,
				responseTemplates: responseTemplates,
				selectionPattern: "",
				statusCode: "200"
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(rest api id is not present)", function () {
		beforeEach(function () {
			delete context.results.restApiId;
			putIntegrationResponseSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsPutIntegrationResponseStepJs2["default"])(conan, context, function () {
				putIntegrationResponseSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(integration response created)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = {};
			putIntegrationResponseSpy = _sinon2["default"].spy(function (awsParameters, callback) {
				callback(null, responseData);
			});
		});

		it("should not return error", function (done) {
			(0, _stepsPutIntegrationResponseStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		describe("(many statuses)", function () {
			beforeEach(function () {
				parameters = new ((function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "method",
						value: function method() {
							return "GET";
						}
					}, {
						key: "statusCodes",
						value: function statusCodes() {
							return [200, 401, 404];
						}
					}]);

					return MockConanAwsParameters;
				})())();

				restApiId = "23sysh";
				apiResourceId = "23sysh3";
				responseTemplates = { "application/json": "" };

				context = {
					parameters: parameters,
					results: {
						restApiId: restApiId,
						apiResourceId: apiResourceId
					},
					libraries: {
						AWS: {
							APIGateway: APIGateway
						}
					}
				};
			});

			it("should put them all", function (done) {
				(0, _stepsPutIntegrationResponseStepJs2["default"])(conan, context, function () {
					_sinon2["default"].assert.callCount(putIntegrationResponseSpy, 3);
					done();
				});
			});
		});
	});

	describe("(api resource id is not present)", function () {
		beforeEach(function () {
			delete context.results.apiResourceId;
			putIntegrationResponseSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsPutIntegrationResponseStepJs2["default"])(conan, context, function () {
				putIntegrationResponseSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			putIntegrationResponseSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", function (done) {
			(0, _stepsPutIntegrationResponseStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});