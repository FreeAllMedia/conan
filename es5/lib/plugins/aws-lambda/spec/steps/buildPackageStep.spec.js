"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsBuildPackageStepJs = require("../../steps/buildPackageStep.js");

var _stepsBuildPackageStepJs2 = _interopRequireDefault(_stepsBuildPackageStepJs);

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

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

_temp2["default"].track();

describe(".buildPackageStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    lambdaResponseError = undefined,
	    lambdaResponseData = undefined,
	    s3ResponseError = undefined,
	    s3ResponseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    conanAwsLambda = undefined,
	    mockLambdaSpy = undefined,
	    mockS3Spy = undefined,
	    _packages = undefined,
	    packageZipFileName = undefined;

	var mockS3GetObjectRequest = {
		createReadStream: function createReadStream() {
			return _fs2["default"].createReadStream(__dirname + "/../fixtures/packages.zip");
		}
	};

	var mockS3 = {
		getObject: _sinon2["default"].spy(function () {
			return mockS3GetObjectRequest;
		})
	};

	var MockS3 = function MockS3(config) {
		_classCallCheck(this, MockS3);

		mockS3Spy(config);
		return mockS3;
	};

	var mockLambda = {
		invoke: _sinon2["default"].spy(function (params, callback) {
			callback(lambdaResponseError, lambdaResponseData);
		})
	};

	var MockLambda = function MockLambda(config) {
		_classCallCheck(this, MockLambda);

		mockLambdaSpy(config);
		return mockLambda;
	};

	var MockAWS = {
		S3: MockS3,
		Lambda: MockLambda
	};

	beforeEach(function (done) {
		conan = new _conanJs2["default"]({
			region: "us-east-1",
			bucket: "some-bucket-here"
		});

		var lambdaName = "TestFunction";

		packageZipFileName = (0, _jargon2["default"])(lambdaName).camel.toString() + ".packages.zip";

		_packages = { "async": "1.0.0" };

		conanAwsLambda = new ((function () {
			function MockConanAwsLambda() {
				_classCallCheck(this, MockConanAwsLambda);
			}

			_createClass(MockConanAwsLambda, [{
				key: "name",
				value: function name() {
					return lambdaName;
				}
			}, {
				key: "packages",
				value: function packages() {
					return _packages;
				}
			}]);

			return MockConanAwsLambda;
		})())();

		mockLambdaSpy = _sinon2["default"].spy();
		mockS3Spy = _sinon2["default"].spy();

		_temp2["default"].mkdir("compilePackages", function (error, temporaryDirectoryPath) {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				libraries: { AWS: MockAWS },
				results: {}
			};

			// "Lambda Found" response by default
			lambdaResponseData = {};
			lambdaResponseError = null;

			stepDone = function (afterStepCallback) {
				return function (callbackError, data) {
					stepReturnError = callbackError;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			(0, _stepsBuildPackageStepJs2["default"])(conan, context, stepDone(done));
		});
	});

	afterEach(function (done) {
		_temp2["default"].cleanup(done);
	});

	it("should be a function", function () {
		(typeof _stepsBuildPackageStepJs2["default"]).should.equal("function");
	});

	describe("(When packages are set to be compiled)", function () {
		it("should set the designated region on the lambda client", function () {
			mockLambdaSpy.calledWith({
				region: conan.config.region
			}).should.be["true"];
		});

		it("should set the designated region on the s3 client", function () {
			mockS3Spy.calledWith({
				region: conan.config.region
			}).should.be["true"];
		});

		it("should call AWS with the designated lambda parameters", function () {
			mockLambda.invoke.firstCall.args[0].should.eql({
				FunctionName: "Thaumaturgy",
				InvocationType: "RequestResponse",
				LogType: "Tail",
				Payload: JSON.stringify({
					packages: conanAwsLambda.packages(),
					bucket: conan.config.bucket,
					key: packageZipFileName
				})
			});
		});

		it("should call AWS with the designated S3 parameters", function () {
			mockS3.getObject.firstCall.args[0].should.eql({
				Bucket: conan.config.bucket,
				Key: packageZipFileName
			});
		});

		it("should have all package files within the package zip", function (done) {
			/* eslint-disable new-cap */
			var zipFilePaths = [];

			_fs2["default"].createReadStream(stepReturnData.packageZipFilePath).pipe(_unzip22["default"].Parse()).on("entry", function (entry) {
				zipFilePaths.push(entry.path);
			}).on("close", function () {
				var asyncFilePaths = ["async/.jshintrc", "async/.travis.yml", "async/CHANGELOG.md", "async/LICENSE", "async/README.md", "async/bower.json", "async/component.json", "async/lib/", "async/lib/async.js", "async/package.json", "async/support/", "async/support/sync-package-managers.js"];

				zipFilePaths.should.have.members(asyncFilePaths);

				done();
			});
		});

		it("should return the package zip file's file path", function () {
			_fs2["default"].existsSync(stepReturnData.packageZipFilePath).should.be["true"];
		});

		it("should name the package zip file according to the lambda name", function () {
			var returnedPackageZipFileName = _path2["default"].basename(stepReturnData.packageZipFilePath);
			returnedPackageZipFileName.should.eql(packageZipFileName);
		});
	});

	describe("(When packages are NOT set to be compiled)", function () {
		it("should return with the package zip file path set to null", function (done) {
			_packages = undefined;
			(0, _stepsBuildPackageStepJs2["default"])(conan, context, function (error, results) {
				(results.packageZipFilePath === null).should.be["true"];
				done();
			});
		});
	});
});