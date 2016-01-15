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

var _stepsPutMethodResponseStepJs = require("../../steps/putMethodResponseStep.js");

var _stepsPutMethodResponseStepJs2 = _interopRequireDefault(_stepsPutMethodResponseStepJs);

describe("putMethodResponseStep", function () {
	var putMethodResponseSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    apiResourceId = undefined,
	    responseParameters = undefined,
	    should = undefined;

	var APIGateway = (function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "putMethodResponse",
			value: function putMethodResponse(params, callback) {
				putMethodResponseSpy(params, callback);
			}
		}]);

		return APIGateway;
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		constructorSpy = _sinon2["default"].spy();
		putMethodResponseSpy = _sinon2["default"].spy(function (params, callback) {
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
					return { "200": "" };
				}
			}, {
				key: "responseHeaders",
				value: function responseHeaders() {
					return {};
				}
			}]);

			return MockConanAwsParameters;
		})())();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";
		responseParameters = {};

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId,
				apiResourceId: apiResourceId,
				responseStatusCodes: []
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsPutMethodResponseStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsPutMethodResponseStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			putMethodResponseSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				restApiId: restApiId,
				statusCode: "200",
				responseParameters: {}
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
			putMethodResponseSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsPutMethodResponseStepJs2["default"])(conan, context, function () {
				putMethodResponseSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(the status code is present on the array)", function () {
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
						return { "200": "", "404": "Not Found*" };
					}
				}, {
					key: "responseHeaders",
					value: function responseHeaders() {
						return {};
					}
				}]);

				return MockConanAwsParameters;
			})())();

			restApiId = "23sysh";
			apiResourceId = "23sysh3";

			context = {
				parameters: parameters,
				results: {
					restApiId: restApiId,
					apiResourceId: apiResourceId,
					responseStatusCodes: ["200"]
				},
				libraries: {
					AWS: {
						APIGateway: APIGateway
					}
				}
			};

			putMethodResponseSpy = _sinon2["default"].spy(function (params, callback) {
				callback(null, {});
			});
		});

		it("should skip the function call for it", function (done) {
			(0, _stepsPutMethodResponseStepJs2["default"])(conan, context, function () {
				putMethodResponseSpy.firstCall.args[0].statusCode.should.equal("404");
				done();
			});
		});
	});

	describe("(method response created)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = {};
			putMethodResponseSpy = _sinon2["default"].spy(function (awsParameters, callback) {
				callback(null, responseData);
			});
		});

		it("should not return an error", function (done) {
			(0, _stepsPutMethodResponseStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(api resource id is not present)", function () {
		beforeEach(function () {
			delete context.results.apiResourceId;
			putMethodResponseSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsPutMethodResponseStepJs2["default"])(conan, context, function () {
				putMethodResponseSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(responseHeaders)", function () {
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
						return { "200": "", "401": "Unauthorized*", "404": "Not Found*" };
					}
				}, {
					key: "responseHeaders",
					value: function responseHeaders() {
						return { "Access-Control-Allow-Origin": "*" };
					}
				}]);

				return MockConanAwsParameters;
			})())();

			responseParameters = {
				"method.response.header.Access-Control-Allow-Origin": false
			};

			context = {
				parameters: parameters,
				results: {
					restApiId: restApiId,
					apiResourceId: apiResourceId,
					responseStatusCodes: []
				},
				libraries: {
					AWS: {
						APIGateway: APIGateway
					}
				}
			};
		});

		it("should put them all in the response parameters", function (done) {
			(0, _stepsPutMethodResponseStepJs2["default"])(conan, context, function () {
				putMethodResponseSpy.firstCall.args[0].responseParameters.should.eql(responseParameters);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			putMethodResponseSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", function (done) {
			(0, _stepsPutMethodResponseStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});