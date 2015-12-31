"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsCompileLambdaZipStepJs = require("../../steps/compileLambdaZipStep.js");

var _stepsCompileLambdaZipStepJs2 = _interopRequireDefault(_stepsCompileLambdaZipStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _unzip = require("unzip");

var _unzip2 = _interopRequireDefault(_unzip);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

describe(".compileLambdaZipStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    lambdaFilePath = undefined,
	    dependencyFilePath = undefined,
	    packageZipFilePath = undefined,
	    lambdaZipFilePath = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    parameters = undefined;

	beforeEach(function (done) {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		lambdaFilePath = __dirname + "/fixtures/lambda.js";
		packageZipFilePath = __dirname + "/fixtures/packages.zip";

		parameters = new ((function () {
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
				key: "packages",
				value: function packages() {
					return [__dirname + "/fixtures/*.js"];
				}
			}]);

			return MockConanAwsLambda;
		})())();

		_temp2["default"].mkdir("compileLambdaZip", function (error, temporaryDirectoryPath) {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: parameters,
				libraries: {},
				results: {
					packageZipFilePath: packageZipFilePath
				}
			};

			stepDone = function (callback) {
				return function (error, data) {
					stepReturnError = error;
					stepReturnData = data;
					callback();
				};
			};

			(0, _stepsCompileLambdaZipStepJs2["default"])(conan, context, stepDone(done));
		});
	});

	it("should be a function", function () {
		(typeof _stepsCompileLambdaZipStepJs2["default"]).should.equal("function");
	});

	it("should insert the correct data for the designated lambda into the zip file", function (done) {
		var lambdaFileData = _fs2["default"].readFileSync(lambdaFilePath);

		_fs2["default"].createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2["default"].Parse()).on("entry", function (entry) {
			if (entry.path === "lambda.js") {
				var Writable = require('stream').Writable;
				var ws = Writable({ objectMode: true });
				ws._write = function (chunk, enc, next) {
					chunk.should.eql(lambdaFileData);
					done();
				};
				entry.pipe(ws);
			}
		});
	});

	it("should insert the correct data for the designated packages into the zip file", function (done) {
		var lambdaFileData = _fs2["default"].readFileSync(lambdaFilePath);

		_fs2["default"].createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2["default"].Parse()).on("entry", function (entry) {
			if (entry.path === "lambda.js") {
				var Writable = require('stream').Writable;
				var ws = Writable({ objectMode: true });
				ws._write = function (chunk, enc, next) {
					chunk.should.eql(lambdaFileData);
					done();
				};
				entry.pipe(ws);
			}
		});
	});0;

	it("should insert the lambda file and its packages into the zip file", function (done) {
		var zipFilePaths = [];

		_fs2["default"].createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2["default"].Parse()).on("entry", function (entry) {
			zipFilePaths.push(entry.path);
		}).on("close", function () {
			var asyncFilePaths = ["lambda.js", "save.js", "node_modules/async/.jshintrc", "node_modules/async/.travis.yml", "node_modules/async/CHANGELOG.md", "node_modules/async/LICENSE", "node_modules/async/README.md", "node_modules/async/bower.json", "node_modules/async/component.json", "node_modules/async/lib/async.js", "node_modules/async/package.json", "node_modules/async/support/sync-package-managers.js"];

			zipFilePaths.should.have.members(asyncFilePaths);

			done();
		});
	});

	it("should return the lambda zip file path", function () {
		_fs2["default"].existsSync(stepReturnData.lambdaZipFilePath).should.be["true"];
	});
});