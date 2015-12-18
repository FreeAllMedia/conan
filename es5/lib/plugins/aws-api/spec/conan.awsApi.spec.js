"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanApiJs = require("../conan.api.js");

var _conanApiJs2 = _interopRequireDefault(_conanApiJs);

var _conanJs = require("../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _awsApiBuilderJs = require("../awsApiBuilder.js");

var _awsApiBuilderJs2 = _interopRequireDefault(_awsApiBuilderJs);

describe("ConanAwsApi.constructor(conan)", function () {
	var conan = undefined;

	before(function () {
		conan = new _conanJs2["default"]();
		conan.use(_conanApiJs2["default"]);
	});

	it("should be correctly plugged into conan", function () {
		conan.plugins[0].should.be.instanceOf(_conanApiJs2["default"]);
	});

	describe("(plugged methods)", function () {
		describe(".api", function () {
			it("should have an api member", function () {
				conan.should.have.property("api");
			});

			it("should be a function", function () {
				(typeof conan.api).should.equal("function");
			});

			describe("(after calling it)", function () {
				var awsApiBuilder = undefined;

				before(function () {
					awsApiBuilder = conan.api("testApi");
				});

				it("should call the setup function", function () {
					awsApiBuilder.should.be.instanceOf(_awsApiBuilderJs2["default"]);
				});

				it("should add all the necessary steps", function () {
					var names = conan.steps.all.map(function (step) {
						return step.name;
					});
					names.should.eql(["conanFindApiStep"]);
				});
			});

			describe("(after calling deploy)", function () {
				it("should call the aws find api function");
			});
		});
	});
});