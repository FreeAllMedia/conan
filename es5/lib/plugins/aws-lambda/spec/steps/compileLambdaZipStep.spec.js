"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _compileLambdaZipStep = require("../../steps/compileLambdaZipStep.js");

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

describe(".compileLambdaZipStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    lambdaFilePath = undefined,
	    dependencyFilePaths = undefined,
	    packageZipFilePath = undefined,
	    dependenciesSpy = undefined,
	    stepReturnData = undefined,
	    conanAwsLambda = undefined;

	beforeEach(function (done) {
		conan = new _conan2.default({
			basePath: __dirname + "/../../..",
			region: "us-east-1"
		});

		dependenciesSpy = _sinon2.default.spy();

		dependencyFilePaths = [];
		packageZipFilePath = undefined;

		lambdaFilePath = __dirname + "/../fixtures/lambda.js";

		conanAwsLambda = new (function () {
			function MockConanAwsLambda() {
				_classCallCheck(this, MockConanAwsLambda);
			}

			_createClass(MockConanAwsLambda, [{
				key: "filePath",
				value: function filePath() {
					return lambdaFilePath;
				}
			}, {
				key: "name",
				value: function name() {
					return "TestFunction";
				}
			}, {
				key: "dependencies",
				value: function dependencies(value) {
					if (value) {
						dependenciesSpy(value);
					}
					return dependencyFilePaths;
				}
			}, {
				key: "handler",
				value: function handler() {
					return ["handler"];
				}
			}]);

			return MockConanAwsLambda;
		}())();

		_temp2.default.mkdir("compileLambdaZip", function (error, temporaryDirectoryPath) {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				libraries: {},
				results: {
					packageZipFilePath: packageZipFilePath
				}
			};

			stepDone = function stepDone(callback) {
				return function (callbackError, data) {
					stepReturnData = data;
					callback();
				};
			};

			(0, _compileLambdaZipStep2.default)(conan, context, stepDone(done));
		});
	});

	it("should be a function", function () {
		(typeof _compileLambdaZipStep2.default === "undefined" ? "undefined" : _typeof(_compileLambdaZipStep2.default)).should.equal("function");
	});

	it("should return the lambda zip file path", function () {
		_fs2.default.existsSync(stepReturnData.lambdaZipFilePath).should.be.true;
	});

	describe("(Multiple dependency file)", function () {
		beforeEach(function (done) {
			// Testing that glob matching works.
			// If glob matching works normal paths will, too.

			var fixturesDirectoryPath = _path2.default.normalize(__dirname + "/../fixtures");

			dependencyFilePaths = [[fixturesDirectoryPath + "/**/s*e.js"], [fixturesDirectoryPath + "/**/d*y.js", "lib"], [fixturesDirectoryPath + "/emptyDirectory"], [fixturesDirectoryPath + "/directory/file.js"], [__dirname + "/../../conanAwsLambdaPlugin.js"], [__dirname + "/../../conanAwsLambdaPlugin.js", "lib"]];

			(0, _compileLambdaZipStep2.default)(conan, context, stepDone(done));
		});

		it("should create a conan handler on the root of the zipFile", function (done) {
			/* eslint-disable new-cap */
			var zipFilePaths = [];

			_fs2.default.createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				if (entry.path.match(/conanHandler\-[a-zA-Z0-9.]*/)) {
					zipFilePaths.push(entry.path);
				}
			}).on("close", function () {
				zipFilePaths.length.should.equal(1);
				done();
			});
		});

		it("should generate the conan handler on the root of the zipFile", function (done) {
			/* eslint-disable new-cap */
			var zipFilePaths = [];

			_fs2.default.createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				if (entry.path.match(/conanHandler\-[a-zA-Z0-9.]*/)) {
					zipFilePaths.push(entry.path);
				}
			}).on("close", function () {
				zipFilePaths.length.should.equal(1);
				done();
			});
		});

		it("should add the lambda file as a dependency", function () {
			dependenciesSpy.calledWith(lambdaFilePath).should.be.true;
		});

		it("should insert the lambda file, the dependencies, and its packages into the zip file", function (done) {
			/* eslint-disable new-cap */
			var zipFilePaths = [];

			_fs2.default.createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				if (!entry.path.match(/conanHandler\-[a-zA-Z0-9.]*/)) {
					zipFilePaths.push(entry.path);
				}
			}).on("close", function () {
				var expectedFilePaths = ["aws-lambda/spec/fixtures/emptyDirectory/", "aws-lambda/spec/fixtures/directory/file.js", "aws-lambda/conanAwsLambdaPlugin.js", "lib/aws-lambda/conanAwsLambdaPlugin.js", "aws-lambda/spec/fixtures/save.js", "lib/aws-lambda/spec/fixtures/destroy.js"];

				zipFilePaths.should.eql(expectedFilePaths);

				done();
			});
		});
	});

	describe("(With a package zip file)", function () {
		beforeEach(function (done) {
			context.results.packageZipFilePath = __dirname + "/../fixtures/packages.zip";
			(0, _compileLambdaZipStep2.default)(conan, context, stepDone(done));
		});

		it("should insert the lambda file, the dependency, and its packages into the zip file", function (done) {
			var zipFilePaths = [];

			_fs2.default.createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				if (!entry.path.match(/conanHandler\-[a-zA-Z0-9.]*/)) {
					zipFilePaths.push(entry.path);
				}
			}).on("close", function () {
				var expectedFilePaths = ["node_modules/async/.jshintrc", "node_modules/async/.travis.yml", "node_modules/async/CHANGELOG.md", "node_modules/async/LICENSE", "node_modules/async/README.md", "node_modules/async/bower.json", "node_modules/async/component.json", "node_modules/async/lib/async.js", "node_modules/async/package.json", "node_modules/async/support/sync-package-managers.js"];

				zipFilePaths.should.have.members(expectedFilePaths);

				done();
			});
		});
	});
});