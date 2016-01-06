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

var _stepsCreateApiResourcesStepJs = require("../../steps/createApiResourcesStep.js");

var _stepsCreateApiResourcesStepJs2 = _interopRequireDefault(_stepsCreateApiResourcesStepJs);

describe("createApiResourcesStep", function () {
	var createResourceSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    should = undefined;

	var APIGateway = (function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "createResource",
			value: function createResource(params, callback) {
				createResourceSpy(params, callback);
			}
		}]);

		return APIGateway;
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		constructorSpy = _sinon2["default"].spy();
		createResourceSpy = _sinon2["default"].spy(function (params, callback) {
			callback();
		});
		should = _chai2["default"].should();

		parameters = new function MockConanAwsParameters() {
			_classCallCheck(this, MockConanAwsParameters);
		}();

		restApiId = "23sysh";

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsCreateApiResourcesStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsCreateApiResourcesStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS create deployment call", function () {
			createResourceSpy.firstCall.args[0].should.eql({});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			createResourceSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _stepsCreateApiResourcesStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});