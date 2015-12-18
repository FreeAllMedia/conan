"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanApiPluginJs = require("../conan.api.plugin.js");

var _conanApiPluginJs2 = _interopRequireDefault(_conanApiPluginJs);

var _conanJs = require("../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

describe("ConanAwsApiPlugin(conan)", function () {
	var conan = undefined;

	before(function () {
		conan = new _conanJs2["default"]();
		conan.use(_conanApiPluginJs2["default"]);
	});

	it("should set a builder function for ConanAwsApi at .api(apiName)", function () {
		(typeof conan.api).should.equal("function");
	});
});