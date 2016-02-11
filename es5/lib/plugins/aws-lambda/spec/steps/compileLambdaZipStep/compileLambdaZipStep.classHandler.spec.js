"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _compileLambdaZipStep = require("../../../steps/compileLambdaZipStep.js");

var _compileLambdaZipStep2 = _interopRequireDefault(_compileLambdaZipStep);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _unzip = require("unzip2");

var _unzip2 = _interopRequireDefault(_unzip);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

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
			basePath: __dirname + "/../../fixtures",
			region: "us-east-1"
		});

		lambdaFilePath = __dirname + "/../../fixtures/lambda.js";

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
					return ["handler"];
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

	describe("(When lambda file exports a class by default)", function () {
		var lambdaZipFilePath = undefined;

		beforeEach(function (done) {
			conanAwsLambda.filePath(_path2.default.normalize(__dirname + "/../../fixtures/lambdaClass.js"));
			(0, _compileLambdaZipStep2.default)(conan, context, function (error, data) {
				lambdaZipFilePath = data.lambdaZipFilePath;
				done();
			});
		});

		it("should generate a lambda class conan handler on the zip root", function (done) {
			/* eslint-disable new-cap */
			_fs2.default.createReadStream(lambdaZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				if (entry.path.indexOf("conanHandler") !== -1) {
					(function () {
						var entryData = "";
						entry.on("data", function (data) {
							entryData = "" + entryData + data;
						});
						entry.on("end", function () {
							var expectedConanHandlerCode = _fs2.default.readFileSync(__dirname + "/../../fixtures/lambdaClassHandler.js", "utf-8");
							entryData.should.eql(expectedConanHandlerCode);
							done();
						});
					})();
				}
			});
		});
	});

	describe("(When lambda file exports a function by default)", function () {
		var lambdaZipFilePath = undefined;

		beforeEach(function (done) {
			conanAwsLambda.filePath(_path2.default.normalize(__dirname + "/../../fixtures/lambda.js"));
			(0, _compileLambdaZipStep2.default)(conan, context, function (error, data) {
				lambdaZipFilePath = data.lambdaZipFilePath;
				done();
			});
		});

		it("should generate a lambda function conan handler on the zip root", function (done) {
			/* eslint-disable new-cap */
			_fs2.default.createReadStream(lambdaZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				if (entry.path.indexOf("conanHandler") !== -1) {
					(function () {
						var entryData = "";

						entry.on("data", function (data) {
							entryData = "" + entryData + data;
						});

						entry.on("end", function () {
							var expectedConanHandlerCode = _fs2.default.readFileSync(__dirname + "/../../fixtures/lambdaHandler.js", "utf-8");
							entryData.should.eql(expectedConanHandlerCode);
							done();
						});
					})();
				}
			});
		});

		it("should call the function with the handler event and context");
	});
});