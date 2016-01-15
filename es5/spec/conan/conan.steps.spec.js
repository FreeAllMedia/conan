"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _libComponentsConanStepsJs = require("../../lib/components/conanSteps.js");

var _libComponentsConanStepsJs2 = _interopRequireDefault(_libComponentsConanStepsJs);

describe("conan.steps", function () {
	it("should return an instance of ConanSteps", function () {
		var conan = new _libConanJs2["default"]();
		conan.steps.should.be.instanceOf(_libComponentsConanStepsJs2["default"]);
	});
});