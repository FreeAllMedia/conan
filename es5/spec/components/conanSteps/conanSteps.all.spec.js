"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libComponentsConanStepsJs = require("../../../lib/components/conanSteps.js");

var _libComponentsConanStepsJs2 = _interopRequireDefault(_libComponentsConanStepsJs);

describe("conanSteps.all", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _libComponentsConanStepsJs2["default"]();
	});

	it("should default to an empty array", function () {
		conanSteps.all.should.eql([]);
	});

	it("should return all steps", function () {
		function conanStep(conan, done) {
			done();
		}
		var parameters = { foo: "bar" };
		conanSteps.add(conanStep, parameters);
		conanSteps.all.should.eql([{
			handler: conanStep,
			parameters: parameters
		}]);
	});
});