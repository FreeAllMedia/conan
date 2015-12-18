"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanApiJs = require("../conan.api.js");

var _conanApiJs2 = _interopRequireDefault(_conanApiJs);

var _conanJs = require("../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _awsApiBuilderJs = require("../awsApiBuilder.js");

var _awsApiBuilderJs2 = _interopRequireDefault(_awsApiBuilderJs);

describe("ConanAwsApi(conan, name)", function () {
	var api = undefined,
	    conan = undefined,
	    name = undefined;

	before(function () {
		name = "tester-api";
		conan = new _conanJs2["default"]();
		conan.use(_conanApiJs2["default"]);

		api = conan.api(name);
	});

	describe(".constructor(conan, name)", function () {
		it("should add the find api step", function () {
			conan.steps.all.map(function (step) {
				return step.name === "conanFindApiStep";
			}).should.be.ok;
		});
	});

	describe(".description(text)", function () {
		it("should set the description text for the api");
	});

	describe(".stage(name)", function () {
		it("should return an instance of ConanAwsApiStage");
	});
});