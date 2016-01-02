import Conan from "../../../../conan.js";
import compilePackagesStep from "../../steps/compilePackagesStep.js";
import sinon from "sinon";
import fs from "fs";
import path from "path";
import temp from "temp";
import unzip from "unzip2";

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

			parameters;

	const mockAwsLambda = {
		invoke: sinon.spy((params, callback) => {
			callback(lambdaResponseError, lambdaResponseData);
		})
	};

	const mockS3GetObjectRequest = {
		createReadStream: () => {
			return fs.createReadStream(__dirname + "/fixtures/packages.zip");
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
			return mockAwsLambda;
		})
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		parameters = {
			packages: () => { return { "async": "1.0.0" }; },
			bucket: () => { return "some-bucket-here"; },
			key: () => { return "accountCreate.dependencies.zip"; }
		};

		temp.mkdir("compilePackages", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: parameters,
				libraries: { AWS: MockAWS },
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

			compilePackagesStep(conan, context, stepDone(done));
		});
	});

	afterEach(done => {
		temp.cleanup(done);
	});

	it("should be a function", () => {
		(typeof compilePackagesStep).should.equal("function");
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

	it("should call AWS with the designated S3 parameters", () => {
		mockS3.getObject.firstCall.args[0].should.eql({
			Bucket: parameters.bucket(),
			Key: parameters.key()
		});
	});

	it("should have all package files within the package zip", done => {
		let zipFilePaths = [];

		fs.createReadStream(stepReturnData.packageZipFilePath)
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
		fs.existsSync(stepReturnData.packageZipFilePath).should.be.true;
	});

	it("should name the package zip file according to the lambda name", () => {
		const packageZipFileName = path.basename(stepReturnData.packageZipFilePath);
		packageZipFileName.should.eql("accountCreate.dependencies.zip");
	});
});
