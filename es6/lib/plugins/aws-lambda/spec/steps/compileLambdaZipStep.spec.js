import Conan from "../../../../conan.js";
import compileLambdaZipStep from "../../steps/compileLambdaZipStep.js";
import sinon from "sinon";
import fs from "fs";
import unzip from "unzip";
import temp from "temp";

describe(".compileLambdaZipStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaFilePath,
			dependencyZipFilePath,
			lambdaZipFilePath,

			stepReturnError,
			stepReturnData,

			parameters;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		lambdaFilePath = __dirname + "/fixtures/lambda.js";
		dependencyZipFilePath = __dirname + "/fixtures/dependencies.zip";

		parameters = new class MockConanAwsLambda {
			filePath() { 		return lambdaFilePath; }
			name() { 				return "TestFunction"; }
		}();

		temp.mkdir("compileLambdaZip", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: parameters,
				dependencies: {},
				results: {
					dependencyZipFilePath: dependencyZipFilePath
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
		const lambdaFileData = fs.readFileSync(lambdaFilePath);

		fs.createReadStream(stepReturnData.lambdaZipFilePath)
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

	it("should insert the lambda file and its dependencies into the zip file", done => {
		let zipFilePaths = [];

		fs.createReadStream(stepReturnData.lambdaZipFilePath)
			.pipe(unzip.Parse())
			.on("entry", (entry) => {
				zipFilePaths.push(entry.path);
			})
			.on("close", () => {
				const asyncFilePaths = [
					"lambda.js",
					"async/.jshintrc",
					"async/.travis.yml",
					"async/CHANGELOG.md",
					"async/LICENSE",
					"async/README.md",
					"async/bower.json",
					"async/component.json",
					"async/lib/async.js",
					"async/package.json",
					"async/support/sync-package-managers.js"
				];

				zipFilePaths.should.have.members(asyncFilePaths);

				done();
			});
	});

	it("should return the lambda zip file path", () => {
		fs.existsSync(stepReturnData.lambdaZipFilePath).should.be.true;
	});
});
