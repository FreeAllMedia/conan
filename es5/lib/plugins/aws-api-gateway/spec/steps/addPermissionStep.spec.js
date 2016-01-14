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

var _stepsAddPermissionStepJs = require("../../steps/addPermissionStep.js");

var _stepsAddPermissionStepJs2 = _interopRequireDefault(_stepsAddPermissionStepJs);

describe("addPermissionStep", function () {
	var addPermissionSpy = undefined,
	    getPolicySpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    accountId = undefined,
	    should = undefined;

	var Lambda = (function () {
		function Lambda(constructorParameters) {
			_classCallCheck(this, Lambda);

			constructorSpy(constructorParameters);
		}

		_createClass(Lambda, [{
			key: "getPolicy",
			value: function getPolicy(params, callback) {
				getPolicySpy(params, callback);
			}
		}, {
			key: "addPermission",
			value: function addPermission(params, callback) {
				addPermissionSpy(params, callback);
			}
		}]);

		return Lambda;
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		restApiId = "283mds2";
		accountId = "2293892861";

		constructorSpy = _sinon2["default"].spy();
		addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
			callback();
		});
		getPolicySpy = _sinon2["default"].spy(function (params, callback) {
			callback(null, {
				"Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"ArnLike\":{\"AWS:SourceArn\":\"arn:wrong:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
			});
		});
		should = _chai2["default"].should();

		parameters = new ((function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "path",
				value: function path() {
					return "/accounts/items";
				}
			}, {
				key: "lambda",
				value: function lambda() {
					return "listAccountItems";
				}
			}, {
				key: "method",
				value: function method() {
					return "GET";
				}
			}]);

			return MockConanAwsParameters;
		})())();

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId,
				accountId: accountId
			},
			libraries: {
				AWS: {
					Lambda: Lambda
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsAddPermissionStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get policy call", function () {
			getPolicySpy.firstCall.args[0].should.eql({
				FunctionName: "listAccountItems"
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			var parametersSent = addPermissionSpy.firstCall.args[0];
			//because it's an auto generated uuid, tested separately
			delete parametersSent.StatementId;
			parametersSent.should.eql({
				SourceArn: "arn:aws:execute-api:us-east-1:" + accountId + ":" + restApiId + "/*/GET/accounts/items",
				Action: "lambda:InvokeFunction",
				Principal: "apigateway.amazonaws.com",
				FunctionName: "listAccountItems"
			});
		});

		it("should generated an uuid on the parameters", function () {
			addPermissionSpy.firstCall.args[0].should.have.property("StatementId");
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(permission added)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = {};
			addPermissionSpy = _sinon2["default"].spy(function (awsParameters, callback) {
				callback(null, responseData);
			});
		});

		it("should return with no error", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(a parameter is not present)", function () {
		beforeEach(function () {
			parameters = {};

			context = {
				parameters: parameters,
				results: {
					restApiId: restApiId,
					accountId: accountId
				},
				libraries: {
					AWS: {
						Lambda: Lambda
					}
				}
			};
			addPermissionSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
				addPermissionSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(get policy paths)", function () {
		describe("(permission already set)", function () {
			beforeEach(function (done) {
				getPolicySpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, {
						"Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"ArnLike\":{\"AWS:SourceArn\":\"arn:aws:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
					});
				});
				addPermissionSpy = _sinon2["default"].spy();
				(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should skip the call to add permission", function () {
				addPermissionSpy.called.should.be["false"];
			});

			it("should call to get policy", function () {
				getPolicySpy.called.should.be["true"];
			});
		});

		describe("(get policy return error)", function () {
			beforeEach(function (done) {
				getPolicySpy = _sinon2["default"].spy(function (params, callback) {
					callback({});
				});
				addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, {});
				});
				(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should call to add permission", function () {
				addPermissionSpy.called.should.be["true"];
			});
		});

		describe("(get policy return an invalid json)", function () {
			beforeEach(function (done) {
				getPolicySpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, {
						"Policy": "{d\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"ArnLike\":{\"AWS:SourceArn\":\"arn:aws:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
					});
				});
				addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, {});
				});
				(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should call to add permission", function () {
				addPermissionSpy.called.should.be["true"];
			});
		});

		describe("(get policy return a json with no source arn like)", function () {
			beforeEach(function (done) {
				getPolicySpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, {
						"Policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Condition\":{\"SomeProperty\":{\"AWS:SourceArn\":\"arn:aws:execute-api:us-east-1:2293892861:283mds2/*/GET/accounts/items\"}},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws:lambda:us-east-1:166191841105:function:ListAccounts\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Sid\":\"89d8cf5e-28f5-498b-8d87-d3eb2073115e\"}],\"Id\":\"default\"}"
					});
				});
				addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
					callback(null, {});
				});
				(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
					done();
				});
			});

			it("should call to add permission", function () {
				addPermissionSpy.called.should.be["true"];
			});
		});
	});

	describe("(account id is not present)", function () {
		beforeEach(function () {
			context = {
				parameters: parameters,
				results: {
					restApiId: restApiId
				},
				libraries: {
					AWS: {
						Lambda: Lambda
					}
				}
			};
			addPermissionSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
				addPermissionSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(rest api id is not present)", function () {
		beforeEach(function () {
			context = {
				parameters: parameters,
				results: {
					accountId: accountId
				},
				libraries: {
					AWS: {
						Lambda: Lambda
					}
				}
			};
			addPermissionSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
				addPermissionSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(conflict error or already exists error)", function () {
		beforeEach(function () {
			addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 409 });
			});
		});

		it("should return no error -ignore-", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});