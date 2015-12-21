"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _componentsConanAwsLambdaJs = require("../../../components/conanAwsLambda.js");

var _componentsConanAwsLambdaJs2 = _interopRequireDefault(_componentsConanAwsLambdaJs);

describe("conanAwsLambda.role(name)", function () {
	var conan = undefined;
	var lambda = undefined;

	beforeEach(function () {
		conan = new _conanJs2["default"]();
		lambda = new _componentsConanAwsLambdaJs2["default"](conan, "AccountCreate");
	});

	it("should return `this` to allow chaining", function () {
		lambda.role("roleName").should.eql(lambda);
	});

	it("should set conanAwsLambda.parameters.role to the provided role name", function () {
		lambda.role("roleName").parameters.role.should.equal("roleName");
	});
});