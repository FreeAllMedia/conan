"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

var _libConanContextJs = require("../../lib/conanContext.js");

var _libConanContextJs2 = _interopRequireDefault(_libConanContextJs);

describe("conan.context", function () {
	it("should return an instance of ConanContext", function () {
		var conan = new _libConanJs2["default"]();

		conan.context.should.be.instanceOf(_libConanContextJs2["default"]);
	});
});