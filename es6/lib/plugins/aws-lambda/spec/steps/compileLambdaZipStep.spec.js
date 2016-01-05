import Conan from "../../../../conan.js";
import compileLambdaZipStep from "../../steps/compileLambdaZipStep.js";
import fileSystem from "fs";
import unzip from "unzip2";
import temp from "temp";

describe(".compileLambdaZipStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaFilePath,
			dependencyFilePaths,

			packageZipFilePath,

			stepReturnData,

			conanAwsLambda;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		dependencyFilePaths = undefined;
		packageZipFilePath = undefined;

		lambdaFilePath = __dirname + "/fixtures/lambda.js";

		conanAwsLambda = new class MockConanAwsLambda {
			filePath() {	return lambdaFilePath; }
			name() 		 {	return "TestFunction"; }
			dependencies() { return dependencyFilePaths; }
		}();

		temp.mkdir("compileLambdaZip", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				libraries: {},
				results: {
					packageZipFilePath: packageZipFilePath
				}
			};

			stepDone = (callback) => {
				return (callbackError, data) => {
					stepReturnData = data;
					callback();
				};
			};

			compileLambdaZipStep(conan, context, stepDone(done));
		});
	});

	it("should be a function", () => {
		(typeof compileLambdaZipStep).should.equal("function");
	});

	it("should return the lambda zip file path", () => {
		fileSystem.existsSync(stepReturnData.lambdaZipFilePath).should.be.true;
	});

	describe("(One dependency file)", () => {
		beforeEach(done => {
			// Testing that glob matching works.
			// If glob matching works normal paths will, too.
			dependencyFilePaths = __dirname + "/**/s*e.js";
			compileLambdaZipStep(conan, context, stepDone(done));
		});

		it("should insert the lambda file, the dependency, and its packages into the zip file", done => {
			/* eslint-disable new-cap */
			let zipFilePaths = [];

			fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					zipFilePaths.push(entry.path);
				})
				.on("close", () => {
					const expectedFilePaths = [
						"lambda.js",
						"save.js"
					];

					zipFilePaths.should.have.members(expectedFilePaths);

					done();
				});
		});

		it("should insert the correct data for the designated lambda into the zip file", done => {
			/* eslint-disable new-cap */
			const lambdaFileData = fileSystem.readFileSync(lambdaFilePath);

			fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					if (entry.path === "lambda.js") {
						const Writable = require("stream").Writable;
						const writableStream = Writable({ objectMode: true });
						writableStream._write = (chunk) => {
							chunk.should.eql(lambdaFileData);
							done();
						};
						entry.pipe(writableStream);
					}
				});
		});
	});

	describe("(Multiple dependency file)", () => {
		beforeEach(done => {
			// Testing that glob matching works.
			// If glob matching works normal paths will, too.
			dependencyFilePaths = [
				__dirname + "/**/s*e.js",
				__dirname + "/**/d*y.js"
			];

			compileLambdaZipStep(conan, context, stepDone(done));
		});

		it("should insert the lambda file, the dependency, and its packages into the zip file", done => {
			let zipFilePaths = [];

			fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					zipFilePaths.push(entry.path);
				})
				.on("close", () => {
					const expectedFilePaths = [
						"lambda.js",
						"save.js",
						"destroy.js"
					];

					zipFilePaths.should.have.members(expectedFilePaths);

					done();
				});
		});
	});

	describe("(With a package zip file)", () => {
		beforeEach(done => {
			context.results.packageZipFilePath = __dirname + "/fixtures/packages.zip";
			compileLambdaZipStep(conan, context, stepDone(done));
		});

		it("should insert the lambda file, the dependency, and its packages into the zip file", done => {
			let zipFilePaths = [];

			fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					zipFilePaths.push(entry.path);
				})
				.on("close", () => {
					const expectedFilePaths = [
						"lambda.js",
						"node_modules/async/.jshintrc",
						"node_modules/async/.travis.yml",
						"node_modules/async/CHANGELOG.md",
						"node_modules/async/LICENSE",
						"node_modules/async/README.md",
						"node_modules/async/bower.json",
						"node_modules/async/component.json",
						"node_modules/async/lib/async.js",
						"node_modules/async/package.json",
						"node_modules/async/support/sync-package-managers.js"
					];

					zipFilePaths.should.have.members(expectedFilePaths);

					done();
				});
		});
	});
});
