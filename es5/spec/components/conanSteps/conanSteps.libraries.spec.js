"use strict";

var _conanSteps = require("../../../lib/components/conanSteps.js");

var _conanSteps2 = _interopRequireDefault(_conanSteps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("conanSteps.library(name, value)", function () {
	var conanSteps = undefined;

	beforeEach(function () {
		conanSteps = new _conanSteps2.default();
	});

	it("should add library to each step's context", function (testDone) {
		var FakeAWS = function FakeAWS() {
			_classCallCheck(this, FakeAWS);
		};

		conanSteps.library("AWS", FakeAWS);
		function stepExample(conan, context, done) {
			context.libraries.AWS.should.eql(FakeAWS);
			done();
		}
		conanSteps.add(stepExample);
		conanSteps.start(testDone);
	});
});