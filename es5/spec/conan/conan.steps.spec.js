"use strict";

var _conan = require("../../lib/conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _conanSteps = require("../../lib/components/conanSteps.js");

var _conanSteps2 = _interopRequireDefault(_conanSteps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("conan.steps", function () {
	it("should return an instance of ConanSteps", function () {
		var conan = new _conan2.default();
		conan.steps.should.be.instanceOf(_conanSteps2.default);
	});
});