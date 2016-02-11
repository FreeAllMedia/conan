"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _findApiByNameStep = require("../../steps/findApiByNameStep.js");

var _findApiByNameStep2 = _interopRequireDefault(_findApiByNameStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("findApiByNameStep", function () {
	var getRestApisSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    should = undefined;

	var APIGateway = function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "getRestApis",
			value: function getRestApis(params, callback) {
				getRestApisSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		getRestApisSpy = _sinon2.default.spy(function (params, callback) {
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

		context = {
			parameters: parameters,
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _findApiByNameStep2.default === "undefined" ? "undefined" : _typeof(_findApiByNameStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _findApiByNameStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			getRestApisSpy.firstCall.args[0].should.eql({});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(apis returned but not found)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { items: [{ name: "testApi1" }, { name: "testApi2" }] };
			getRestApisSpy = _sinon2.default.spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return false for that api", function (done) {
			(0, _findApiByNameStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should not return for that api", function (done) {
			(0, _findApiByNameStep2.default)(conan, context, function (error, result) {
				should.not.exist(result);
				done();
			});
		});
	});

	describe("(api found)", function () {
		var responseData = undefined;
		var matchingApi = undefined;

		beforeEach(function () {
			matchingApi = { name: "testApi", id: "asa23k" };
			responseData = { items: [{ name: "testApi1" }, matchingApi] };
			getRestApisSpy = _sinon2.default.spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return the id for that api", function (done) {
			(0, _findApiByNameStep2.default)(conan, context, function (error, result) {
				result.restApiId.should.equal(matchingApi.id);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			getRestApisSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _findApiByNameStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});