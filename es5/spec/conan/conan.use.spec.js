"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _libConanJs = require("../../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

describe("conan.use(ConanPlugin)", function () {
	var ConanPlugin = function ConanPlugin(conan) {
		_classCallCheck(this, ConanPlugin);

		conan.test = true;
	};

	var conan = undefined;

	beforeEach(function () {
		conan = new _libConanJs2["default"]();
		conan.use(ConanPlugin);
	});

	it("should instantiate the ConanPlugin with conan", function () {
		conan.test.should.be["true"];
	});

	it("should add the instantiated plugin to the conan.plugins array", function () {
		conan.plugins[0].should.be.instanceOf(ConanPlugin);
	});
});