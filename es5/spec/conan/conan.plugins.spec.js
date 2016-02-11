"use strict";

var _conan = require("../../lib/conan.js");

var _conan2 = _interopRequireDefault(_conan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("conan.plugins", function () {
	it("should return an instance of Array", function () {
		var conan = new _conan2.default();
		conan.plugins.should.be.instanceOf(Array);
	});
});