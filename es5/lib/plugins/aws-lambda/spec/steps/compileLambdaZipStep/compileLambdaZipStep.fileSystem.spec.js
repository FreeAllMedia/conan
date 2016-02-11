"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _compileLambdaZipStep = require("../../../steps/compileLambdaZipStep.js");

var _compileLambdaZipStep2 = _interopRequireDefault(_compileLambdaZipStep);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_temp2.default.track();

describe(".compileLambdaZipStep(conan, context, stepDone) classHandler", function () {
	var conan = undefined,
	    context = undefined,
	    lambdaFilePath = undefined,
	    handlerFilePath = undefined,
	    temporaryDirectoryPath = undefined,
	    conanAwsLambda = undefined;

	beforeEach(function () {
		conan = new _conan2.default({
			basePath: __dirname + "../../../../..",
			region: "us-east-1"
		});

		lambdaFilePath = __dirname + "/../../fixtures/lambda.js";
		handlerFilePath = __dirname + "/../../fixtures/customHandler.js";

		conanAwsLambda = new (function () {
			function MockConanAwsLambda() {
				_classCallCheck(this, MockConanAwsLambda);
			}

			_createClass(MockConanAwsLambda, [{
				key: "name",
				value: function name() {
					return "MyLambda";
				}
			}, {
				key: "handler",
				value: function handler() {
					return ["handler", handlerFilePath];
				}
			}]);

			return MockConanAwsLambda;
		}())();

		var filePath = lambdaFilePath;
		conanAwsLambda.filePath = _sinon2.default.spy(function (newFilePath) {
			if (newFilePath) {
				filePath = newFilePath;
			}
			return filePath;
		});

		var dependencies = [];
		conanAwsLambda.dependencies = _sinon2.default.spy(function (newDependencies) {
			if (newDependencies) {
				dependencies.push([newDependencies]);
			}
			return dependencies;
		});

		temporaryDirectoryPath = _temp2.default.mkdirSync("compileLambdaZip");

		context = {
			temporaryDirectoryPath: temporaryDirectoryPath,
			parameters: conanAwsLambda,
			results: {}
		};
	});

	describe(".fileSystem", function () {
		describe("(when provided a filesystem)", function () {
			var mockFileSystem = undefined;

			beforeEach(function (done) {
				mockFileSystem = {
					createReadStream: _sinon2.default.spy(_fs2.default.createReadStream),
					createWriteStream: _sinon2.default.spy(_fs2.default.createWriteStream),
					statSync: _sinon2.default.spy(_fs2.default.statSync),
					existsSync: _sinon2.default.spy(_fs2.default.existsSync)
				};
				context.fileSystem = mockFileSystem;
				(0, _compileLambdaZipStep2.default)(conan, context, done);
			});

			it("should use a provided filesystem", function () {
				[mockFileSystem.createReadStream.called, mockFileSystem.createWriteStream.called, mockFileSystem.statSync.called, mockFileSystem.existsSync.called].should.eql([true, true, true, true]);
			});
		});
	});
});