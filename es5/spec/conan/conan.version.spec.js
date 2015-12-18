"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _packageJson = require("../../../package.json");

var _packageJson2 = _interopRequireDefault(_packageJson);

describe("conan.version", function () {
	it("should return the current version of conan.", function () {
		var conan = new _libConanJs2["default"]();

		conan.version.should.eql(_packageJson2["default"].version);
	});
});