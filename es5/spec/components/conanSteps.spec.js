/* eslint-disable no-unused-vars */
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libComponentsConanStepsJs = require("../../lib/components/conanSteps.js");

var _libComponentsConanStepsJs2 = _interopRequireDefault(_libComponentsConanStepsJs);

describe("ConanSteps()", function () {
	it("should not throw an error", function () {
		(function () {
			var steps = new _libComponentsConanStepsJs2["default"]();
		}).should.not["throw"]();
	});
});