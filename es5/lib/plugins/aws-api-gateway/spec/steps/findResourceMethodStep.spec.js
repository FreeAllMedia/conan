"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _findResourceMethodStep = require("../../steps/findResourceMethodStep.js");

var _findResourceMethodStep2 = _interopRequireDefault(_findResourceMethodStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("findResourceMethodStep", function () {
	var getMethodSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    apiResourceId = undefined,
	    should = undefined;

	var APIGateway = function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "getMethod",
			value: function getMethod(params, callback) {
				getMethodSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		getMethodSpy = _sinon2.default.spy(function (params, callback) {
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
			}]);

			return MockConanAwsParameters;
		}())();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";

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
		(typeof _findResourceMethodStep2.default === "undefined" ? "undefined" : _typeof(_findResourceMethodStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _findResourceMethodStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			getMethodSpy.firstCall.args[0].should.eql({
				httpMethod: parameters.method(),
				resourceId: context.results.apiResourceId,
				restApiId: restApiId
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
			getMethodSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _findResourceMethodStep2.default)(conan, context, function () {
				getMethodSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api resource id is not present)", function () {
		beforeEach(function () {
			delete context.results.apiResourceId;
			getMethodSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _findResourceMethodStep2.default)(conan, context, function () {
				getMethodSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(resource method not found)", function () {
		beforeEach(function () {
			getMethodSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 404 });
			});
		});

		it("should return no error", function (done) {
			(0, _findResourceMethodStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should return null as the method name", function (done) {
			(0, _findResourceMethodStep2.default)(conan, context, function (error, result) {
				(result.resourceHttpMethod === null).should.be.true;
				done();
			});
		});
	});

	describe("(resource method found)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { httpMethod: "GET" };
			getMethodSpy = _sinon2.default.spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return the method name", function (done) {
			(0, _findResourceMethodStep2.default)(conan, context, function (error, result) {
				result.resourceHttpMethod.should.equal(responseData.httpMethod);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			getMethodSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _findResourceMethodStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});