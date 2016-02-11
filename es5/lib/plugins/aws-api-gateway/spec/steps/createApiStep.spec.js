"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _createApiStep = require("../../steps/createApiStep.js");

var _createApiStep2 = _interopRequireDefault(_createApiStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("createApiStep", function () {
	var createRestApiSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    should = undefined;

	var APIGateway = function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "createRestApi",
			value: function createRestApi(params, callback) {
				createRestApiSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		createRestApiSpy = _sinon2.default.spy(function (params, callback) {
			callback();
		});
		should = _chai2.default.should();

		parameters = new (function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "name",
				value: function name() {
					return "testApi";
				}
			}]);

			return MockConanAwsParameters;
		}())();

		restApiId = "23sysh";

		context = {
			parameters: parameters,
			results: {},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _createApiStep2.default === "undefined" ? "undefined" : _typeof(_createApiStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _createApiStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			createRestApiSpy.firstCall.args[0].should.eql({
				name: "testApi"
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(api id is present)", function () {
		beforeEach(function () {
			context.results = { restApiId: restApiId };
			createRestApiSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _createApiStep2.default)(conan, context, function () {
				createRestApiSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api created)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { name: "testApi", id: 2 };
			createRestApiSpy = _sinon2.default.spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return with no error for that api", function (done) {
			(0, _createApiStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should return the id", function (done) {
			(0, _createApiStep2.default)(conan, context, function (error, result) {
				result.restApiId.should.equal(2);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			createRestApiSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _createApiStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});