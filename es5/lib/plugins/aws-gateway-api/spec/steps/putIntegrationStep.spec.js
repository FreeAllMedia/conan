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

var _stepsPutIntegrationStepJs = require("../../steps/putIntegrationStep.js");

var _stepsPutIntegrationStepJs2 = _interopRequireDefault(_stepsPutIntegrationStepJs);

describe("putIntegrationStep", function () {
	var putIntegrationSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    apiResourceId = undefined,
	    lambdaArn = undefined,
	    uri = undefined,
	    requestTemplates = undefined,
	    should = undefined;

	var APIGateway = (function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "putIntegration",
			value: function putIntegration(params, callback) {
				putIntegrationSpy(params, callback);
			}
		}]);

		return APIGateway;
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		constructorSpy = _sinon2["default"].spy();
		putIntegrationSpy = _sinon2["default"].spy(function (params, callback) {
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
				key: "path",
				value: function path() {
					return "/account/items";
				}
			}, {
				key: "headers",
				value: function headers() {
					return [];
				}
			}, {
				key: "queryStrings",
				value: function queryStrings() {
					return [];
				}
			}]);

			return MockConanAwsParameters;
		})())();

		// uri according to aws docs
		// arn:aws:apigateway:{region}:{service}:{path|action}/{service_api}

		restApiId = "23sysh";
		apiResourceId = "23sysh3";
		lambdaArn = "arn:aws:lambda:us-east-1:166191849902:function:accounts";
		uri = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/" + lambdaArn + "/invocations";

		requestTemplates = { "application/json": "{\n  \"params\": {\n \"header\": {\n},\n \"queryString\": {\n},\n \"path\": {\n}},\n \"data\": $input.json('$')\n}" };

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId,
				apiResourceId: apiResourceId,
				lambdaArn: lambdaArn
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsPutIntegrationStepJs2["default"]).should.equal("function");
	});

	describe("(parameter mapping)", function () {
		describe("(header)", function () {
			beforeEach(function (done) {
				context.parameters = new ((function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "path",
						value: function path() {
							return "/accounts/items";
						}
					}, {
						key: "method",
						value: function method() {
							return "GET";
						}
					}, {
						key: "headers",
						value: function headers() {
							return ["Access-Token"];
						}
					}, {
						key: "queryStrings",
						value: function queryStrings() {
							return [];
						}
					}]);

					return MockConanAwsParameters;
				})())();
				requestTemplates = { "application/json": "{\n  \"params\": {\n \"header\": {\n\"accessToken\": \"$input.params('Access-Token')\"\n},\n \"queryString\": {\n},\n \"path\": {\n}},\n \"data\": $input.json('$')\n}" };
				(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should map the header parameters", function () {
				putIntegrationSpy.firstCall.args[0].requestTemplates.should.eql(requestTemplates);
			});
		});

		describe("(queryStrings)", function () {
			beforeEach(function (done) {
				context.parameters = new ((function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "method",
						value: function method() {
							return "GET";
						}
					}, {
						key: "path",
						value: function path() {
							return "/accounts/items";
						}
					}, {
						key: "headers",
						value: function headers() {
							return [];
						}
					}, {
						key: "queryStrings",
						value: function queryStrings() {
							return ["pageSize"];
						}
					}]);

					return MockConanAwsParameters;
				})())();
				requestTemplates = { "application/json": "{\n  \"params\": {\n \"header\": {\n},\n \"queryString\": {\n\"pageSize\": \"$input.params('pageSize')\"\n},\n \"path\": {\n}},\n \"data\": $input.json('$')\n}" };
				(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should map the header parameters", function () {
				putIntegrationSpy.firstCall.args[0].requestTemplates.should.eql(requestTemplates);
			});
		});

		describe("(path)", function () {
			beforeEach(function (done) {
				context.parameters = new ((function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "method",
						value: function method() {
							return "GET";
						}
					}, {
						key: "path",
						value: function path() {
							return "/account/{id}";
						}
					}, {
						key: "headers",
						value: function headers() {
							return [];
						}
					}, {
						key: "queryStrings",
						value: function queryStrings() {
							return [];
						}
					}]);

					return MockConanAwsParameters;
				})())();
				requestTemplates = { "application/json": "{\n  \"params\": {\n \"header\": {\n},\n \"queryString\": {\n},\n \"path\": {\n\"id\": \"$input.params('id')\"\n}},\n \"data\": $input.json('$')\n}" };
				(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should map the header parameters", function () {
				putIntegrationSpy.firstCall.args[0].requestTemplates.should.eql(requestTemplates);
			});
		});
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			putIntegrationSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				type: "AWS",
				integrationHttpMethod: "POST",
				uri: uri,
				requestTemplates: requestTemplates,
				restApiId: restApiId
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(resource method created)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = {};
			putIntegrationSpy = _sinon2["default"].spy(function (awsParameters, callback) {
				callback(null, responseData);
			});
		});

		it("should return with no error", function (done) {
			(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(rest api id is not present)", function () {
		beforeEach(function () {
			delete context.results.restApiId;
			putIntegrationSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function () {
				putIntegrationSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(api resource id is not present)", function () {
		beforeEach(function () {
			delete context.results.apiResourceId;
			putIntegrationSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function () {
				putIntegrationSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(lambda arn is not present)", function () {
		beforeEach(function () {
			delete context.results.lambdaArn;
			putIntegrationSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function () {
				putIntegrationSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			putIntegrationSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", function (done) {
			(0, _stepsPutIntegrationStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});