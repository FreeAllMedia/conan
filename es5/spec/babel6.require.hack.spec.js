"use strict";

var _babel6RequireHack = require("../lib/babel6.require.hack.js");

var _babel6RequireHack2 = _interopRequireDefault(_babel6RequireHack);

var _module = require("module");

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("babel6 require hack", function () {
	var oldRequire = undefined;

	beforeEach(function () {
		oldRequire = _module2.default.prototype.require;
	});

	afterEach(function () {
		_module2.default.prototype.require = oldRequire;
	});

	it("should override the module require function", function () {
		(0, _babel6RequireHack2.default)();
		require("./fixtures/module.js").name.should.equal("Apple");
	});

	it("should override the module require function for es5 too", function () {
		var oldAssign = Object.assign;
		Object.assign = undefined;
		(0, _babel6RequireHack2.default)();
		require("./fixtures/module.js").name.should.equal("Apple");
		Object.assign = oldAssign;
	});
});