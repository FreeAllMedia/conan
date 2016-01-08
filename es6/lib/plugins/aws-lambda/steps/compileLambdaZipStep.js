import archiver from "archiver";
import path from "path";
import fileSystem from "fs";
import unzip from "unzip2";
import inflect from "jargon";
import glob from "glob";
import Async from "flowsync";

export default function compileLambdaZipStep(conan, context, stepDone) {
	/* eslint-disable new-cap */
	const conanAwsLambda = context.parameters;

	const packageZipFilePath = context.results.packageZipFilePath;

	const lambdaFilepath = conanAwsLambda.filePath();
	const lambdaDirectory = path.dirname(lambdaFilepath);
	const lambdaFilename = path.basename(lambdaFilepath);
	const lambdaReadStream = fileSystem.createReadStream(lambdaFilepath);

	const lambdaZipFileName = inflect(conanAwsLambda.name()).snake.toString();
	const lambdaZipFilePath = `${context.temporaryDirectoryPath}/${lambdaZipFileName}.zip`;
	const lambdaZipWriteStream = fileSystem.createWriteStream(lambdaZipFilePath);

	const dependencyGlobOrGlobs = conanAwsLambda.dependencies();

	const lambdaZip = archiver("zip", {});
	lambdaZip.append(lambdaReadStream, {name: lambdaFilename});

	Async.series([
		appendDependencies,
		appendPackages
	], () => {
		stepDone(null, {
			lambdaZipFilePath: lambdaZipFilePath
		});
	});

	function appendDependencies(done) {
		if (dependencyGlobOrGlobs) {
			if (dependencyGlobOrGlobs.constructor === Array) {
				const dependencyGlobs = dependencyGlobOrGlobs;
				Async.mapParallel(dependencyGlobs, appendGlobFiles, done);
			} else {
				const dependencyGlob = dependencyGlobOrGlobs;
				appendGlobFiles(dependencyGlob, done);
			}
		} else {
			done();
		}

		function appendGlobFiles(globString, callback) {
			glob(globString, (error, filePaths) => {
				filePaths.forEach((filePath) => {
					const fileReadStream = fileSystem.createReadStream(filePath);
					const relativeFilePath = path.relative(lambdaDirectory, filePath);
					lambdaZip.append(fileReadStream, { name: relativeFilePath });
				});
				callback();
			});
		}
	}

	function appendPackages(done) {
		if (packageZipFilePath) {
			fileSystem.createReadStream(packageZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					const isDirectory = entry.path.slice(-1) === "/";
					if (!isDirectory) {
						lambdaZip.append(entry, {name: "node_modules/" + entry.path});
					}
				})
				.on("close", () => {
					packagesAppended();
				});
		} else {
			packagesAppended();
		}

		function packagesAppended() {
			lambdaZipWriteStream.on("close", done);
			lambdaZip.pipe(lambdaZipWriteStream);
			lambdaZip.finalize();
		}
	}
}
