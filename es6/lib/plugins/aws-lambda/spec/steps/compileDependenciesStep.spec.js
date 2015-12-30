import Conan from "../../../../conan.js";
import compileDependenciesStep from "../../steps/compileDependenciesStep.js";
import sinon from "sinon";
import fs from "fs";
import path from "path";
import temp from "temp";
import unzip from "unzip2";

temp.track();

describe(".compileDependenciesStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaResponseError,
			lambdaResponseData,

			s3ResponseError,
			s3ResponseData,

			stepReturnError,
			stepReturnData,

			payload;

	const mockLambda = {
		invoke: sinon.spy((params, callback) => {
			callback(lambdaResponseError, lambdaResponseData);
		})
	};

	const mockS3GetObjectRequest = {
		createReadStream: () => {
			return fs.createReadStream(__dirname + "/fixtures/dependencies.zip");
		}
	};

	const mockS3 = {
		getObject: sinon.spy((params) => {
			return mockS3GetObjectRequest;
		})
	};

	const MockAWS = {
		S3: sinon.spy(() => {
			return mockS3;
		}),
		Lambda: sinon.spy(() => {
			return mockLambda;
		})
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		payload = {
			packages: { "async": "1.0.0" },
			bucket: "some-bucket-here",
			key: "accountCreate.dependencies.zip"
		};

		temp.mkdir("compileDependencies", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: payload,
				dependencies: { AWS: MockAWS },
				results: {}
			};

			// "Lambda Found" response by default
			lambdaResponseData = {};
			lambdaResponseError = null;

			stepDone = (afterStepCallback) => {
				return (error, data) => {
					stepReturnError = error;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			compileDependenciesStep(conan, context, stepDone(done));
		});
	});

	afterEach(done => {
		temp.cleanup(done);
	});

	it("should be a function", () => {
		(typeof compileDependenciesStep).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should set the designated region on the s3 client", () => {
		MockAWS.S3.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated lambda parameters", () => {
		mockLambda.invoke.firstCall.args[0].should.eql({
			FunctionName: "Thaumaturgy",
			InvocationType: "RequestResponse",
			LogType: "Tail",
			Payload: JSON.stringify(payload)
		});
	});

	it("should call AWS with the designated S3 parameters", () => {
		mockS3.getObject.firstCall.args[0].should.eql({
			Bucket: payload.bucket,
			Key: payload.key
		});
	});

	it("should have all dependency files within the dependency zip", done => {
		let zipFilePaths = [];

		fs.createReadStream(stepReturnData.dependencyZipFilePath)
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

	it("should return the dependency zip file's file path", () => {
		fs.existsSync(stepReturnData.dependencyZipFilePath).should.be.true;
	});

	it("should name the dependency zip file according to the lambda name", () => {
		const dependencyZipFileName = path.basename(stepReturnData.dependencyZipFilePath);
		dependencyZipFileName.should.eql("accountCreate.dependencies.zip");
	});
});
