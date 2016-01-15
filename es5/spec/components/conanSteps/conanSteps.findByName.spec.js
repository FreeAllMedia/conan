"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libComponentsConanStepsJs = require("../../../lib/components/conanSteps.js");

var _libComponentsConanStepsJs2 = _interopRequireDefault(_libComponentsConanStepsJs);

describe("conanSteps.findByName(stepName)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _libComponentsConanStepsJs2["default"]();
	});

	it("should findByName the step function to the collection", function () {
		function stepOne(conan, context, done) {
			done();
		}
		var parameters = { name: "stepName" };
		conanSteps.add(stepOne, parameters);

		conanSteps.findByName("stepOne").should.eql({
			handler: stepOne,
			parameters: parameters
		});
	});
});