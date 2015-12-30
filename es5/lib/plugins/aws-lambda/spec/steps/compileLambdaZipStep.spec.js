"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
	    dependencyZipFilePath = undefined,
	    lambdaZipFilePath = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    payload = undefined;

	beforeEach(function (done) {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		lambdaFilePath = __dirname + "/fixtures/lambda.js";
		dependencyZipFilePath = __dirname + "/fixtures/dependencies.zip";

		_temp2["default"].mkdir("compileLambdaZip", function (error, temporaryDirectoryPath) {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: {
					name: "TestLambda",
					filePath: lambdaFilePath,
					handler: "handler",
					fileName: "accountCreate.lambda.zip"
				},
				dependencies: {},
				results: {
					dependencyZipFilePath: dependencyZipFilePath
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

	it("should insert the lambda file and its dependencies into the zip file", function (done) {
		var zipFilePaths = [];

		_fs2["default"].createReadStream(stepReturnData.lambdaZipFilePath).pipe(_unzip2["default"].Parse()).on("entry", function (entry) {
			zipFilePaths.push(entry.path);
		}).on("close", function () {
			var asyncFilePaths = ["lambda.js", "async/.jshintrc", "async/.travis.yml", "async/CHANGELOG.md", "async/LICENSE", "async/README.md", "async/bower.json", "async/component.json", "async/lib/async.js", "async/package.json", "async/support/sync-package-managers.js"];

			zipFilePaths.should.have.members(asyncFilePaths);

			done();
		});
	});

	it("should return the lambda zip file path", function () {
		_fs2["default"].existsSync(stepReturnData.lambdaZipFilePath).should.be["true"];
	});
});