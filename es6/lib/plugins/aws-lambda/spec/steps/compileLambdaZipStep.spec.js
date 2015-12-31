import Conan from "../../../../conan.js";
import compileLambdaZipStep from "../../steps/compileLambdaZipStep.js";
import sinon from "sinon";
import fileSystem from "fs";
import unzip from "unzip";
import temp from "temp";

describe(".compileLambdaZipStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaFilePath,
			dependencyFilePath,

			packageZipFilePath,
			lambdaZipFilePath,

			stepReturnError,
			stepReturnData,

			parameters;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		lambdaFilePath = __dirname + "/fixtures/lambda.js";
		packageZipFilePath = __dirname + "/fixtures/packages.zip";

		parameters = new class MockConanAwsLambda {
			filePath() {	return lambdaFilePath; }
			name() 		 {	return "TestFunction"; }
			packages() { 	return [__dirname + "/fixtures/*.js"]; }
		}();

		temp.mkdir("compileLambdaZip", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: parameters,
				libraries: {},
				results: {
					packageZipFilePath: packageZipFilePath
				}
			};

			stepDone = (callback) => {
				return (error, data) => {
					stepReturnError = error;
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

	it("should insert the correct data for the designated lambda into the zip file", done => {
		const lambdaFileData = fileSystem.readFileSync(lambdaFilePath);

		fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
			.pipe(unzip.Parse())
			.on("entry", (entry) => {
				if (entry.path === "lambda.js") {
					const Writable = require('stream').Writable;
					const ws = Writable({ objectMode: true });
					ws._write = (chunk, enc, next) => {
					    chunk.should.eql(lambdaFileData);
							done();
					};
					entry.pipe(ws);
				}
			});
	});

	it("should insert the correct data for the designated packages into the zip file", done => {
		const lambdaFileData = fileSystem.readFileSync(lambdaFilePath);

		fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
			.pipe(unzip.Parse())
			.on("entry", (entry) => {
				if (entry.path === "lambda.js") {
					const Writable = require('stream').Writable;
					const ws = Writable({ objectMode: true });
					ws._write = (chunk, enc, next) => {
							chunk.should.eql(lambdaFileData);
							done();
					};
					entry.pipe(ws);
				}
			});
	});0

	it("should insert the lambda file and its packages into the zip file", done => {
		let zipFilePaths = [];

		fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
			.pipe(unzip.Parse())
			.on("entry", (entry) => {
				zipFilePaths.push(entry.path);
			})
			.on("close", () => {
				const asyncFilePaths = [
					"lambda.js",
					"save.js",
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

				zipFilePaths.should.have.members(asyncFilePaths);

				done();
			});
	});

	it("should return the lambda zip file path", () => {
		fileSystem.existsSync(stepReturnData.lambdaZipFilePath).should.be.true;
	});
});
