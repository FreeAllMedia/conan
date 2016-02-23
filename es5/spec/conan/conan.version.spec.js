"use strict";

var _conan = require("../../lib/conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _package = require("../../../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("conan.version", function () {
	it("should return the current version of conan.", function () {
		var conan = new _conan2.default();

		conan.version.should.eql(_package2.default.version);
	});
});