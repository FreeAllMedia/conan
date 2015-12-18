"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanStepsJs = require("../../lib/conanSteps.js");

var _libConanStepsJs2 = _interopRequireDefault(_libConanStepsJs);

describe("conanSteps.after(existingStep, afterStep)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _libConanStepsJs2["default"]();
	});

	it("should add a step to the collection after an existing step", function () {
		function conanStepOne(conan, done) {
			done();
		}

		function conanStepTwo(conan, done) {
			done();
		}

		function conanStepThree(conan, done) {
			done();
		}

		conanSteps.add(conanStepOne);
		conanSteps.add(conanStepTwo);

		conanSteps.after(conanStepOne, conanStepThree);

		conanSteps.all[1].should.eql(conanStepThree);
	});
});