/* eslint-disable no-unused-vars */
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libComponentsConanStepsJs = require("../../lib/components/conanSteps.js");

var _libComponentsConanStepsJs2 = _interopRequireDefault(_libComponentsConanStepsJs);

describe("ConanSteps(parent)", function () {
	it("should not throw an error", function () {
		(function () {
			var conan = {};
			var steps = new _libComponentsConanStepsJs2["default"](conan);
		}).should.not["throw"]();
	});

	it("should save parent to .parent", function () {
		var conan = {};
		var steps = new _libComponentsConanStepsJs2["default"](conan);
		steps.parent.should.eql(conan);
	});
});