import archiver from "archiver";
import path from "path";
import fileSystem from "fs";
import unzip from "unzip";
import inflect from "jargon";
import glob from "glob";

export default function compileLambdaZipStep(conan, context, stepDone) {
	/* eslint-disable new-cap */
	const conanAwsLambda = context.parameters;

	const packageZipFilePath = context.results.packageZipFilePath;

	const lambdaFilepath = conanAwsLambda.filePath();
	const lambdaDirectory = path.dirname(lambdaFilepath);
	const lambdaFilename = path.basename(lambdaFilepath);
	const lambdaReadStream = fileSystem.createReadStream(lambdaFilepath);

	const dependencyGlobOrGlobs = conanAwsLambda.dependencies();

	const lambdaZip = archiver("zip", {});
	lambdaZip.append(lambdaReadStream, {name: lambdaFilename});

	function appendGlobFiles(globString) {
		glob(globString, (error, filePaths) => {
			filePaths.forEach((filePath) => {
				const fileReadStream = fileSystem.createReadStream(filePath);
				const relativeFilePath = path.relative(lambdaDirectory, filePath);
				lambdaZip.append(fileReadStream, { name: relativeFilePath });
			});
		});
	}

	if (dependencyGlobOrGlobs.constructor === Array) {
		const dependencyGlobs = dependencyGlobOrGlobs;
		dependencyGlobs.forEach((dependencyGlob) => {
			appendGlobFiles(dependencyGlob);
		});
	} else {
		const dependencyGlob = dependencyGlobOrGlobs;
		appendGlobFiles(dependencyGlob);
	}

	//lambdaZip.append();

	fileSystem.createReadStream(packageZipFilePath)
		.pipe(unzip.Parse())
		.on("entry", (entry) => {
			const isDirectory = entry.path.slice(-1) === "/";
			if (!isDirectory) {
				lambdaZip.append(entry, {name: "node_modules/" + entry.path});
			}
		})
		.on("close", () => {
			const lambdaZipFileName = inflect(conanAwsLambda.name()).snake.toString();
			const lambdaZipFilePath = `${context.temporaryDirectoryPath}/${lambdaZipFileName}.zip`;
			const lambdaZipWriteStream = fileSystem.createWriteStream(lambdaZipFilePath);

			lambdaZipWriteStream.on("close", () => {
				stepDone(null, {
					lambdaZipFilePath: lambdaZipFilePath
				});
			});

			lambdaZip.pipe(lambdaZipWriteStream);
			lambdaZip.finalize();
		});
}
