"use strict";

var _conanSteps = require("../../../lib/components/conanSteps.js");

var _conanSteps2 = _interopRequireDefault(_conanSteps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("conanSteps.findByName(stepName)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _conanSteps2.default();
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