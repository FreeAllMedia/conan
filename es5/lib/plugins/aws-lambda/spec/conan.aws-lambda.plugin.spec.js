"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _conanAwsLambdaPluginJs = require("../conan.aws-lambda.plugin.js");

var _conanAwsLambdaPluginJs2 = _interopRequireDefault(_conanAwsLambdaPluginJs);

describe("ConanAwsLambdaPlugin(conan)", function () {
		it("should create a lambda builder function at conan.lambda()", function () {
				var conan = new _conanJs2["default"]();
				conan.use(_conanAwsLambdaPluginJs2["default"]);

				(typeof conan.lambda).should.eql("function");
		});
});