"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanStepsJs = require("../../lib/conanSteps.js");

var _libConanStepsJs2 = _interopRequireDefault(_libConanStepsJs);

describe("conanSteps.add(conanStep)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _libConanStepsJs2["default"]();
	});

	it("should add a step to the collection", function () {
		function conanStep(conan, done) {
			done();
		}
		conanSteps.add(conanStep);
		conanSteps.all[0].should.eql(conanStep);
	});
});