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

		function conanStepThree(conan, done) {
			done();
		}

		var stepOneParameters = { foo: "bar" };
		conanSteps.add(conanStepOne, stepOneParameters);

		var stepTwoParameters = { baz: "squee" };
		conanSteps.add(conanStepTwo, stepTwoParameters);

		var stepThreeParameters = { blah: "bing" };
		conanSteps.before(conanStepTwo, conanStepThree, stepThreeParameters);

		conanSteps.all[1].should.eql({
			handler: conanStepThree, parameters: stepThreeParameters
		});
	});
});