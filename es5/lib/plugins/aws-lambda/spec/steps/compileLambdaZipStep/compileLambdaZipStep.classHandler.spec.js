import Conan from "../../../../../conan.js";
import compileLambdaZipStep from "../../../steps/compileLambdaZipStep.js";
import fileSystem from "fs";
import unzip from "unzip2";
import temp from "temp";
import sinon from "sinon";
import path from "path";

temp.track();

describe(".compileLambdaZipStep(conan, context, stepDone) classHandler", () => {
	let conan,
			context,

			lambdaFilePath,
			handlerFilePath,

			temporaryDirectoryPath,
			conanAwsLambda;

	beforeEach(() => {
		conan = new Conan({
			basePath: `${__dirname}/../../fixtures`,
			region: "us-east-1"
		});

		lambdaFilePath = `${__dirname}/../../fixtures/lambda.js`;

		conanAwsLambda = new class MockConanAwsLambda {
			name() { return "MyLambda"; }
			handler() { return ["handler"]; }
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

		temporaryDirectoryPath = temp.mkdirSync("compileLambdaZip");

		context = {
			temporaryDirectoryPath: temporaryDirectoryPath,
			parameters: conanAwsLambda,
			results: {}
		};
	});

	describe("(When lambda file exports a class by default)", () => {
		let lambdaZipFilePath;

		beforeEach(done => {
			conanAwsLambda.filePath(path.normalize(`${__dirname}/../../fixtures/lambdaClass.js`));
			compileLambdaZipStep(conan, context, (error, data) => {
				lambdaZipFilePath = data.lambdaZipFilePath;
				done();
			});
		});

		it("should generate a lambda class conan handler on the zip root", done => {
			/* eslint-disable new-cap */
			fileSystem.createReadStream(lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					if (entry.path.indexOf("conanHandler") !== -1) {
						let entryData = "";
						entry.on("data", (data) => {
							entryData = `${entryData}${data}`;
						});
						entry.on("end", () => {
							const expectedConanHandlerCode = fileSystem.readFileSync(`${__dirname}/../../fixtures/lambdaClassHandler.js`, "utf-8");
							entryData.should.eql(expectedConanHandlerCode);
							done();
						});
					}
				});
		});
	});

	describe("(When lambda file exports a function by default)", () => {
		let lambdaZipFilePath;

		beforeEach(done => {
			conanAwsLambda.filePath(path.normalize(`${__dirname}/../../fixtures/lambda.js`));
			compileLambdaZipStep(conan, context, (error, data) => {
				lambdaZipFilePath = data.lambdaZipFilePath;
				done();
			});
		});

		it("should generate a lambda function conan handler on the zip root", done => {
			/* eslint-disable new-cap */
			fileSystem.createReadStream(lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					if (entry.path.indexOf("conanHandler") !== -1) {
						let entryData = "";

						entry.on("data", (data) => {
							entryData = `${entryData}${data}`;
						});

						entry.on("end", () => {
							const expectedConanHandlerCode = fileSystem.readFileSync(`${__dirname}/../../fixtures/lambdaHandler.js`, "utf-8");
							entryData.should.eql(expectedConanHandlerCode);
							done();
						});
					}
				});
		});

		it("should call the function with the handler event and context");
	});
});
