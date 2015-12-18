"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _libConanStepsJs = require("../../lib/conanSteps.js");

var _libConanStepsJs2 = _interopRequireDefault(_libConanStepsJs);

describe("conan.steps", function () {
	it("should return an instance of ConanSteps", function () {
		var conan = new _libConanJs2["default"]();
		conan.steps.should.be.instanceOf(_libConanStepsJs2["default"]);
	});
});