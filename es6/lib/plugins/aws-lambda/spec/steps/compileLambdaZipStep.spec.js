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

		dependencyFilePaths = [];
		packageZipFilePath = undefined;

		lambdaFilePath = __dirname + "/../fixtures/lambda.js";

		conanAwsLambda = new class MockConanAwsLambda {
			filePath() 			{	return lambdaFilePath; }
			name() 		 			{	return "TestFunction"; }
			dependencies() 	{ return dependencyFilePaths; }
			handler() 			{ return ["handler"]; }
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

	describe("(Multiple dependency file)", () => {
		beforeEach(done => {
			// Testing that glob matching works.
			// If glob matching works normal paths will, too.
			dependencyFilePaths = [
				[
					__dirname + "/../fixtures/**/s*e.js"
				],
				[
					__dirname + "/../fixtures/**/d*y.js",
					"lib"
				],
				[
					__dirname + "/../fixtures/emptyDirectory"
				],
				[
					__dirname + "/../fixtures/directory/file.js"
				],
				[
					__dirname + "/../../conanAwsLambdaPlugin.js"
				],
				[
					__dirname + "/../../conanAwsLambdaPlugin.js",
					"lib"
				]
			];

			compileLambdaZipStep(conan, context, stepDone(done));
		});

		it("should insert the lambda file, the dependencies, and its packages into the zip file", done => {
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
						"emptyDirectory/",
						"directory/file.js",
						"conanAwsLambdaPlugin.js",
						"lib/conanAwsLambdaPlugin.js",
						"save.js",
						"lib/destroy.js"
					];

					zipFilePaths.should.eql(expectedFilePaths);

					done();
				});
		});
	});

	describe("(With a package zip file)", () => {
		beforeEach(done => {
			context.results.packageZipFilePath = __dirname + "/../fixtures/packages.zip";
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
