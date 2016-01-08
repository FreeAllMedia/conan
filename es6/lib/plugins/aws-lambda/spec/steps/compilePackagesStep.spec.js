import Conan from "../../../../conan.js";
import compilePackagesStep from "../../steps/compilePackagesStep.js";
import sinon from "sinon";
import fileSystem from "fs";
import path from "path";
import temp from "temp";
import unzip from "unzip2";
import inflect from "jargon";

temp.track();

describe(".compilePackagesStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaResponseError,
			lambdaResponseData,

			s3ResponseError,
			s3ResponseData,

			stepReturnError,
			stepReturnData,

			conanAwsLambda,

			mockLambdaSpy,
			mockS3Spy,

			packages,
			packageZipFileName;

	const mockS3GetObjectRequest = {
		createReadStream: () => {
			return fileSystem.createReadStream(__dirname + "/fixtures/packages.zip");
		}
	};

	const mockS3 = {
		getObject: sinon.spy(() => {
			return mockS3GetObjectRequest;
		})
	};

	class MockS3 {
		constructor(config) {
			mockS3Spy(config);
			return mockS3;
		}
	}

	const mockLambda = {
		invoke: sinon.spy((params, callback) => {
			callback(lambdaResponseError, lambdaResponseData);
		})
	};

	class MockLambda {
		constructor(config) {
			mockLambdaSpy(config);
			return mockLambda;
		}
	}

	const MockAWS = {
		S3: MockS3,
		Lambda: MockLambda
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1",
			bucket: "some-bucket-here"
		});

		const lambdaName = "TestFunction";

		packageZipFileName = `${inflect(lambdaName).camel.toString()}.packages.zip`;

		packages = { "async": "1.0.0" };

		conanAwsLambda = new class MockConanAwsLambda {
			name() { return lambdaName; }
			packages() { return packages; }
		}();

		mockLambdaSpy = sinon.spy();
		mockS3Spy = sinon.spy();

		temp.mkdir("compilePackages", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				libraries: { AWS: MockAWS },
				results: {}
			};

			// "Lambda Found" response by default
			lambdaResponseData = {};
			lambdaResponseError = null;

			stepDone = (afterStepCallback) => {
				return (callbackError, data) => {
					stepReturnError = callbackError;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			compilePackagesStep(conan, context, stepDone(done));
		});
	});

	afterEach(done => {
		temp.cleanup(done);
	});

	it("should be a function", () => {
		(typeof compilePackagesStep).should.equal("function");
	});

	describe("(When packages are set to be compiled)", () => {
		it("should set the designated region on the lambda client", () => {
			mockLambdaSpy.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should set the designated region on the s3 client", () => {
			mockS3Spy.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated lambda parameters", () => {
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

		it("should call AWS with the designated S3 parameters", () => {
			mockS3.getObject.firstCall.args[0].should.eql({
				Bucket: conan.config.bucket,
				Key: packageZipFileName
			});
		});

		it("should have all package files within the package zip", done => {
			/* eslint-disable new-cap */
			let zipFilePaths = [];

			fileSystem.createReadStream(stepReturnData.packageZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					zipFilePaths.push(entry.path);
				})
				.on("close", () => {
					const asyncFilePaths = [
						"async/.jshintrc",
						"async/.travis.yml",
						"async/CHANGELOG.md",
						"async/LICENSE",
						"async/README.md",
						"async/bower.json",
						"async/component.json",
						"async/lib/",
						"async/lib/async.js",
						"async/package.json",
						"async/support/",
						"async/support/sync-package-managers.js"
					];

					zipFilePaths.should.have.members(asyncFilePaths);

					done();
				});
		});

		it("should return the package zip file's file path", () => {
			fileSystem.existsSync(stepReturnData.packageZipFilePath).should.be.true;
		});

		it("should name the package zip file according to the lambda name", () => {
			const returnedPackageZipFileName = path.basename(stepReturnData.packageZipFilePath);
			returnedPackageZipFileName.should.eql(packageZipFileName);
		});
	});

	describe("(When packages are NOT set to be compiled)", () => {
		it("should return with the package zip file path set to null", done => {
			packages = undefined;
			compilePackagesStep(conan, context, (error, results) => {
				(results.packageZipFilePath === null).should.be.true;
				done();
			});
		});
	});
});
