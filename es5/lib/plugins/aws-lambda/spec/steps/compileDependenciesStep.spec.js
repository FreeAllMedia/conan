"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _stepsCompileDependenciesStepJs = require("../../steps/compileDependenciesStep.js");

var _stepsCompileDependenciesStepJs2 = _interopRequireDefault(_stepsCompileDependenciesStepJs);

// TODO: for this step, instead of using a shell cli command to call thaumaturgy
// it's better to just invoke the lambda using the aws sdk
// https://github.com/nicosommi/thaumaturgy/blob/master/cli/thaumaturgy-build#L92

describe("compileDependenciesStep", function () {
	var conan = undefined,
	    context = undefined,
	    constructorSpy = undefined,
	    invokeSpy = undefined;

	var Lambda = (function () {
		function Lambda(params) {
			_classCallCheck(this, Lambda);

			constructorSpy(params);
		}

		_createClass(Lambda, [{
			key: "invoke",
			value: function invoke(params, callback) {
				invokeSpy(params, callback);
			}
		}]);

		return Lambda;
	})();

	beforeEach(function () {
		context = {
			parameters: {
				name: "test Lambda"
			},
			dependencies: {
				aws: {
					Lambda: Lambda
				}
			}
		};

		conan = { config: { "region": "us-east-1" }
		};
	});

	it("should be a function", function () {
		(typeof _stepsCompileDependenciesStepJs2["default"]).should.equal("function");
	});

	describe("(calling thaumaturgy lambda)", function () {
		beforeEach(function (done) {
			(0, _stepsCompileDependenciesStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should call the thaumaturgy build lambda function");

		it("should send the appropiate package parameter to it");
	});

	describe("(dependency threatment)", function () {
		it("should uncompress the zip file");
	});
});