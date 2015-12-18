"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanStepsJs = require("../../lib/conanSteps.js");

var _libConanStepsJs2 = _interopRequireDefault(_libConanStepsJs);

describe("conanSteps.before(existingStep, beforeStep)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _libConanStepsJs2["default"]();
	});

	it("should add a step to the collection before an existing step", function () {
		function conanStepOne(conan, done) {
			done();
		}

		function conanStepTwo(conan, done) {
			done();
		}

		conanSteps.add(conanStepOne);
		conanSteps.before(conanStepOne, conanStepTwo);

		conanSteps.all[0].should.eql(conanStepTwo);
	});
});