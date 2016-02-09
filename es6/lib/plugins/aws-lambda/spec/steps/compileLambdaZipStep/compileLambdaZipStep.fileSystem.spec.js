import Conan from "../../../../../conan.js";
import compileLambdaZipStep from "../../../steps/compileLambdaZipStep.js";
import fileSystem from "fs";
import temp from "temp";
import sinon from "sinon";

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
			basePath: `${__dirname}../../../../..`,
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

		temporaryDirectoryPath = temp.mkdirSync("compileLambdaZip");

		context = {
			temporaryDirectoryPath: temporaryDirectoryPath,
			parameters: conanAwsLambda,
			results: {}
		};
	});

	describe(".fileSystem", () => {
		describe("(when provided a filesystem)", () => {
			let mockFileSystem;

			beforeEach(done => {
				mockFileSystem = {
					createReadStream: sinon.spy(fileSystem.createReadStream),
					createWriteStream: sinon.spy(fileSystem.createWriteStream),
					statSync: sinon.spy(fileSystem.statSync),
					existsSync: sinon.spy(fileSystem.existsSync)
				};
				context.fileSystem = mockFileSystem;
				compileLambdaZipStep(conan, context, done);
			});

			it("should use a provided filesystem", () => {
				[
					mockFileSystem.createReadStream.called,
					mockFileSystem.createWriteStream.called,
					mockFileSystem.statSync.called,
					mockFileSystem.existsSync.called
				].should.eql([true, true, true, true]);
			});
		});
	});
});
