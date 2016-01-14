"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libComponentsConanStepsJs = require("../../../lib/components/conanSteps.js");

var _libComponentsConanStepsJs2 = _interopRequireDefault(_libComponentsConanStepsJs);

describe("conanSteps.add(conanStep)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _libComponentsConanStepsJs2["default"]();
	});

	it("should add the step function to the collection", function () {
		function conanStep(conan, context, done) {
			done();
		}
		var parameters = { name: "stepName" };
		conanSteps.add(conanStep, parameters);
		conanSteps.all[0].should.eql({ handler: conanStep, parameters: parameters });
	});
});