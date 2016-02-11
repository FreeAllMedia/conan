"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _findApiResourceByPathStep = require("../../steps/findApiResourceByPathStep.js");

var _findApiResourceByPathStep2 = _interopRequireDefault(_findApiResourceByPathStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("findApiResourceByPathStep", function () {
	var getResourcesSpy = undefined,
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
			key: "getResources",
			value: function getResources(params, callback) {
				getResourcesSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		getResourcesSpy = _sinon2.default.spy(function (params, callback) {
			callback();
		});
		should = _chai2.default.should();

		parameters = new (function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "path",
				value: function path() {
					return "/testPath";
				}
			}]);

			return MockConanAwsParameters;
		}())();

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
		(typeof _findApiResourceByPathStep2.default === "undefined" ? "undefined" : _typeof(_findApiResourceByPathStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _findApiResourceByPathStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			getResourcesSpy.firstCall.args[0].should.eql({
				restApiId: restApiId,
				limit: 500
			});
		});

		it("should throw if there is no restApiId in the previous steps results", function (done) {
			delete context.results.restApiId;
			(0, _findApiResourceByPathStep2.default)(conan, context, function (error) {
				error.should.eql(new Error("There is no api defined as a previous step or there was an error o that step."));
				done();
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(api resource full path found)", function () {
		var responseData = undefined;

		describe("(on a completely new path)", function () {
			beforeEach(function () {
				context.parameters = new (function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "path",
						value: function path() {
							return "/accounts/items";
						}
					}]);

					return MockConanAwsParameters;
				}())();

				responseData = {
					items: [{ path: "/a/cool/resource" }, { path: "/different/item" }, { path: "/", id: "v6x4ma2fog" }]
				};
				getResourcesSpy = _sinon2.default.spy(function (params, callback) {
					callback(null, responseData);
				});
			});

			it("should queue the missing resources", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.newApiResources.should.eql(["accounts", "items"]);
					done();
				});
			});

			it("should use the right parent id as the root resource", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.apiResourceParentId.should.equal("v6x4ma2fog");
					done();
				});
			});
		});

		describe("(when the resource leaf is missing)", function () {
			beforeEach(function () {
				context.parameters = new (function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "path",
						value: function path() {
							return "/accounts/items";
						}
					}]);

					return MockConanAwsParameters;
				}())();

				responseData = {
					items: [{ path: "/a/cool/resource" }, { path: "/different/item" }, { path: "/accounts", id: "v6x4ma2sss" }, { path: "/", id: "v6x4ma2fog" }]
				};

				getResourcesSpy = _sinon2.default.spy(function (params, callback) {
					callback(null, responseData);
				});
			});

			it("should explicitly set tu null the api resource id if it was not there", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					(result.apiResourceId === null).should.be.true;
					done();
				});
			});

			it("should queue the missing resource", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.newApiResources.should.eql(["items"]);
					done();
				});
			});

			it("should use the right parent id for the missing resource", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.apiResourceParentId.should.equal("v6x4ma2sss");
					done();
				});
			});
		});

		describe("(when there is two or more missing resources)", function () {
			beforeEach(function () {
				context.parameters = new (function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "path",
						value: function path() {
							return "/accounts/items/subItems";
						}
					}]);

					return MockConanAwsParameters;
				}())();

				responseData = {
					items: [{ path: "/a/cool/resource" }, { path: "/different/item" }, { path: "/accounts", id: "v6x4ma2sss" }, { path: "/", id: "v6x4ma2fog" }]
				};

				getResourcesSpy = _sinon2.default.spy(function (params, callback) {
					callback(null, responseData);
				});
			});

			it("should explicitly set tu null the api resource id if it was not there", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					(result.apiResourceId === null).should.be.true;
					done();
				});
			});

			it("should queue the missing resources", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.newApiResources.should.eql(["items", "subItems"]);
					done();
				});
			});

			it("should use the right parent id for the first missing resource", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.apiResourceParentId.should.equal("v6x4ma2sss");
					done();
				});
			});

			it("should return the array in the appropiate order", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.newApiResources[0].should.eql("items");
					done();
				});
			});
		});

		describe("(on a existing path)", function () {
			beforeEach(function () {
				context.parameters = new (function () {
					function MockConanAwsParameters() {
						_classCallCheck(this, MockConanAwsParameters);
					}

					_createClass(MockConanAwsParameters, [{
						key: "path",
						value: function path() {
							return "/accounts/items/subItems";
						}
					}]);

					return MockConanAwsParameters;
				}())();

				responseData = {
					items: [{ path: "/a/cool/resource" }, { path: "/different/item" }, { path: "/accounts", id: "v6x4ma2ss1", parentId: "v6x4ma2fog" }, { path: "/accounts/items", id: "v6x4ma2ss2", parentId: "v6x4ma2ss1" }, { path: "/accounts/items/subItems", id: "v6x4ma2ss3", parentId: "v6x4ma2ss2" }, { path: "/", id: "v6x4ma2fog" }]
				};

				getResourcesSpy = _sinon2.default.spy(function (params, callback) {
					callback(null, responseData);
				});
			});

			it("should return the existing resource id", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.apiResourceId.should.equal("v6x4ma2ss3");
					done();
				});
			});

			it("should return the existing resource parent id", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.apiResourceParentId.should.equal("v6x4ma2ss2");
					done();
				});
			});

			it("should return and empty resource queue to create", function (done) {
				(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
					result.newApiResources.should.eql([]);
					done();
				});
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			getResourcesSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _findApiResourceByPathStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});

		it("should explicitly set tu null the api resource id if it was not there", function (done) {
			(0, _findApiResourceByPathStep2.default)(conan, context, function (error, result) {
				(result.apiResourceId === null).should.be.true;
				done();
			});
		});
	});
});