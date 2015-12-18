"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanStepsJs = require("../lib/conanSteps.js");

var _libConanStepsJs2 = _interopRequireDefault(_libConanStepsJs);

describe("ConanSteps()", function () {
	it("should not throw an error", function () {
		(function () {
			var steps = new _libConanStepsJs2["default"]();
		}).should.not["throw"]();
	});
});