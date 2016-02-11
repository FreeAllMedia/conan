"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _putIntegrationResponseStep = require("../../steps/putIntegrationResponseStep.js");

var _putIntegrationResponseStep2 = _interopRequireDefault(_putIntegrationResponseStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("putIntegrationResponseStep", function () {
	var putIntegrationResponseSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    apiResourceId = undefined,
	    responseTemplates = undefined,
	    responseParameters = undefined,
	    should = undefined;

	var APIGateway = function () {
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
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		putIntegrationResponseSpy = _sinon2.default.spy(function (params, callback) {
			callback();
		});
		should = _chai2.default.should();

		parameters = new (function () {
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
					return { "200": "" };
				}
			}, {
				key: "responseHeaders",
				value: function responseHeaders() {
					return {};
				}
			}]);

			return MockConanAwsParameters;
		}())();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";
		responseTemplates = { "application/json": "" };
		responseParameters = {};

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
		(typeof _putIntegrationResponseStep2.default === "undefined" ? "undefined" : _typeof(_putIntegrationResponseStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _putIntegrationResponseStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			putIntegrationResponseSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				restApiId: restApiId,
				responseTemplates: responseTemplates,
				responseParameters: responseParameters,
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
			putIntegrationResponseSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _putIntegrationResponseStep2.default)(conan, context, function () {
				putIntegrationResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(integration response created)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = {};
			putIntegrationResponseSpy = _sinon2.default.spy(function (awsParameters, callback) {
				callback(null, responseData);
			});
		});

		it("should not return error", function (done) {
			(0, _putIntegrationResponseStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		describe("(many statuses)", function () {
			beforeEach(function () {
				parameters = new (function () {
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
							return { "200": "", "401": "Unauthorized*", "404": "Not Found*" };
						}
					}, {
						key: "responseHeaders",
						value: function responseHeaders() {
							return { "Access-Control-Allow-Origin": "*" };
						}
					}]);

					return MockConanAwsParameters;
				}())();

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
				(0, _putIntegrationResponseStep2.default)(conan, context, function () {
					_sinon2.default.assert.callCount(putIntegrationResponseSpy, 3);
					done();
				});
			});
		});

		describe("(responseHeaders)", function () {
			beforeEach(function () {
				parameters = new (function () {
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
							return { "200": "", "401": "Unauthorized*", "404": "Not Found*" };
						}
					}, {
						key: "responseHeaders",
						value: function responseHeaders() {
							return { "Access-Control-Allow-Origin": "*" };
						}
					}]);

					return MockConanAwsParameters;
				}())();

				responseParameters = {
					"method.response.header.Access-Control-Allow-Origin": "'*'"
				};

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

			it("should put them all in the response parameters", function (done) {
				(0, _putIntegrationResponseStep2.default)(conan, context, function () {
					putIntegrationResponseSpy.firstCall.args[0].responseParameters.should.eql(responseParameters);
					done();
				});
			});
		});
	});

	describe("(api resource id is not present)", function () {
		beforeEach(function () {
			delete context.results.apiResourceId;
			putIntegrationResponseSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _putIntegrationResponseStep2.default)(conan, context, function () {
				putIntegrationResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			putIntegrationResponseSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", function (done) {
			(0, _putIntegrationResponseStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});