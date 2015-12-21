/* eslint-disable no-unused-vars */
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libConanJs = require("../lib/conan.js");

var _libConanJs2 = _interopRequireDefault(_libConanJs);

describe("Conan(config)", function () {
	describe("(Instantiating with a config object)", function () {
		it("should not throw an error", function () {
			(function () {
				var config = { key: "value" };
				var conan = new _libConanJs2["default"](config);
			}).should.not["throw"]();
		});

		it("should save config object to conan.config", function () {
			var config = { key: "value" };
			var conan = new _libConanJs2["default"](config);
			conan.config.should.eql(config);
		});
	});

	describe("(Instantiating without a config object)", function () {
		it("should not throw an error", function () {
			(function () {
				var conan = new _libConanJs2["default"]();
			}).should.not["throw"]();
		});

		it("should save an empty object to conan.config", function () {
			var conan = new _libConanJs2["default"]();
			conan.config.should.eql({});
		});
	});
});