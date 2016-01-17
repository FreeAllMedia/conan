"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

describe("conan.plugins", function () {
	it("should return an instance of Array", function () {
		var conan = new _libConanJs2["default"]();
		conan.plugins.should.be.instanceOf(Array);
	});
});