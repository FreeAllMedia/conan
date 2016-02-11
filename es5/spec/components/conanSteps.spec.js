"use strict";

var _conanSteps = require("../../lib/components/conanSteps.js");

var _conanSteps2 = _interopRequireDefault(_conanSteps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ConanSteps(parent)", function () {
	it("should not throw an error", function () {
		(function () {
			var conan = {};
			var steps = new _conanSteps2.default(conan);
		}).should.not.throw();
	});

	it("should save parent to .parent", function () {
		var conan = {};
		var steps = new _conanSteps2.default(conan);
		steps.parent.should.eql(conan);
	});
}); /* eslint-disable no-unused-vars */