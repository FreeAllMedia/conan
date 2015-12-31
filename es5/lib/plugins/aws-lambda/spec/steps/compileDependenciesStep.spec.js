"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsCompileDependenciesStepJs = require("../../steps/compileDependenciesStep.js");

var _stepsCompileDependenciesStepJs2 = _interopRequireDefault(_stepsCompileDependenciesStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _unzip2 = require("unzip2");

var _unzip22 = _interopRequireDefault(_unzip2);

_temp2["default"].track();

describe(".compileDependenciesStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    lambdaResponseError = undefined,
	    lambdaResponseData = undefined,
	    s3ResponseError = undefined,
	    s3ResponseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    parameters = undefined;

	var mockAwsLambda = {
		invoke: _sinon2["default"].spy(function (params, callback) {
			callback(lambdaResponseError, lambdaResponseData);
		})
	};

	var mockS3GetObjectRequest = {
		createReadStream: function createReadStream() {
			return _fs2["default"].createReadStream(__dirname + "/fixtures/dependencies.zip");
		}
	};

	var mockS3 = {
		getObject: _sinon2["default"].spy(function (params) {
			return mockS3GetObjectRequest;
		})
	};

	var MockAWS = {
		S3: _sinon2["default"].spy(function () {
			return mockS3;
		}),
		Lambda: _sinon2["default"].spy(function () {
			return mockAwsLambda;
		})
	};

	beforeEach(function (done) {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		parameters = {
			packages: function packages() {
				return { "async": "1.0.0" };
			},
			bucket: function bucket() {
				return "some-bucket-here";
			},
			key: function key() {
				return "accountCreate.dependencies.zip";
			}
		};

		_temp2["default"].mkdir("compileDependencies", function (error, temporaryDirectoryPath) {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: parameters,
				libraries: { AWS: MockAWS },
				results: {}
			};

			// "Lambda Found" response by default
			lambdaResponseData = {};
			lambdaResponseError = null;

			stepDone = function (afterStepCallback) {
				return function (error, data) {
					stepReturnError = error;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			(0, _stepsCompileDependenciesStepJs2["default"])(conan, context, stepDone(done));
		});
	});

	afterEach(function (done) {
		_temp2["default"].cleanup(done);
	});

	it("should be a function", function () {
		(typeof _stepsCompileDependenciesStepJs2["default"]).should.equal("function");
	});

	it("should set the designated region on the lambda client", function () {
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	it("should set the designated region on the s3 client", function () {
		MockAWS.S3.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	it("should call AWS with the designated lambda parameters", function () {
		mockAwsLambda.invoke.firstCall.args[0].should.eql({
			FunctionName: "Thaumaturgy",
			InvocationType: "RequestResponse",
			LogType: "Tail",
			Payload: JSON.stringify({
				packages: parameters.packages(),
				bucket: parameters.bucket(),
				key: parameters.key()
			})
		});
	});

	it("should call AWS with the designated S3 parameters", function () {
		mockS3.getObject.firstCall.args[0].should.eql({
			Bucket: parameters.bucket(),
			Key: parameters.key()
		});
	});

	it("should have all dependency files within the dependency zip", function (done) {
		var zipFilePaths = [];

		_fs2["default"].createReadStream(stepReturnData.dependencyZipFilePath).pipe(_unzip22["default"].Parse()).on("entry", function (entry) {
			zipFilePaths.push(entry.path);
		}).on("close", function () {
			var asyncFilePaths = ["async/.jshintrc", "async/.travis.yml", "async/CHANGELOG.md", "async/LICENSE", "async/README.md", "async/bower.json", "async/component.json", "async/lib/", "async/lib/async.js", "async/package.json", "async/support/", "async/support/sync-package-managers.js"];

			zipFilePaths.should.have.members(asyncFilePaths);

			done();
		});
	});

	it("should return the dependency zip file's file path", function () {
		_fs2["default"].existsSync(stepReturnData.dependencyZipFilePath).should.be["true"];
	});

	it("should name the dependency zip file according to the lambda name", function () {
		var dependencyZipFileName = _path2["default"].basename(stepReturnData.dependencyZipFilePath);
		dependencyZipFileName.should.eql("accountCreate.dependencies.zip");
	});
});