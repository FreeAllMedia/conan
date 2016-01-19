import Conan from "../../../../../conan.js";
import compileLambdaZipStep from "../../../steps/compileLambdaZipStep.js";
import fileSystem from "fs";
import unzip from "unzip2";
import temp from "temp";
import sinon from "sinon";

temp.track();

describe(".compileLambdaZipStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaFilePath,
			handlerFilePath,

			stepReturnData,

			conanAwsLambda;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		lambdaFilePath = `${__dirname}/../../fixtures/lambda.js`;
		handlerFilePath = `${__dirname}/../../fixtures/customHandler.js`;

		conanAwsLambda = new class MockConanAwsLambda {
			name() { return "MyLambda"; }
			handler() { return ["handler", handlerFilePath]; }
		}();

		let filePath = lambdaFilePath;
		conanAwsLambda.filePath = sinon.spy((newFilePath) => {
			if (newFilePath) { filePath = newFilePath; }
			return filePath;
		});

		let dependencies = [];
		conanAwsLambda.dependencies = sinon.spy((newDependencies) => {
			if (newDependencies) {
				dependencies.push([newDependencies]);
			}
			return dependencies;
		});

		temp.mkdir("compileLambdaZip", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				results: {}
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

	describe("(When .handler is a file path)", () => {
		it("should move the lambda file path to dependencies", () => {
			conanAwsLambda.dependencies.calledWith(lambdaFilePath).should.be.true;
		});
		it("should set the handler file path as the lambda file path", () => {
			conanAwsLambda.filePath.calledWith(handlerFilePath).should.be.true;
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
						"customHandler.js"
					];

					zipFilePaths.should.have.members(expectedFilePaths);

					done();
				});
		});
	});
});
