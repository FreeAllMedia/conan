"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _getAccountIdStep = require("../../steps/getAccountIdStep.js");

var _getAccountIdStep2 = _interopRequireDefault(_getAccountIdStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("getAccountIdStep", function () {
	var getUserSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    accountId = undefined,
	    should = undefined;

	var IAM = function () {
		function IAM(constructorParameters) {
			_classCallCheck(this, IAM);

			constructorSpy(constructorParameters);
		}

		_createClass(IAM, [{
			key: "getUser",
			value: function getUser(params, callback) {
				getUserSpy(params, callback);
			}
		}]);

		return IAM;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		accountId = "12787444639";

		constructorSpy = _sinon2.default.spy();
		getUserSpy = _sinon2.default.spy(function (params, callback) {
			callback(null, { User: { Arn: "aws:arn:iam::" + accountId + ":user/division_abc/subdivision_xyz/Bob" } });
		});
		should = _chai2.default.should();

		context = {
			libraries: {
				AWS: {
					IAM: IAM
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _getAccountIdStep2.default === "undefined" ? "undefined" : _typeof(_getAccountIdStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _getAccountIdStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			getUserSpy.firstCall.args[0].should.eql({});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(account id found)", function () {
		it("should not return no error", function (done) {
			(0, _getAccountIdStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should return the account id", function (done) {
			(0, _getAccountIdStep2.default)(conan, context, function (error, results) {
				results.accountId.should.equal(accountId);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			getUserSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _getAccountIdStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});