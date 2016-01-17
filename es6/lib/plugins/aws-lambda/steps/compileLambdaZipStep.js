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

	const handlerFilePath = conanAwsLambda.handler()[1];

	if (fileSystem.existsSync(handlerFilePath)) {
		conanAwsLambda.dependencies(conanAwsLambda.filePath());
		conanAwsLambda.filePath(handlerFilePath);
	}

	const lambdaFilePath = conanAwsLambda.filePath();
	const lambdaDirectory = path.dirname(lambdaFilePath);
	const lambdaFileName = path.basename(lambdaFilePath);
	const lambdaReadStream = fileSystem.createReadStream(lambdaFilePath);

	const lambdaZipFileName = inflect(conanAwsLambda.name()).snake.toString();
	const lambdaZipFilePath = `${context.temporaryDirectoryPath}/${lambdaZipFileName}.zip`;
	const lambdaZipWriteStream = fileSystem.createWriteStream(lambdaZipFilePath);

	const dependencyGlobOrGlobs = conanAwsLambda.dependencies();

	const lambdaZip = archiver("zip", {});
	lambdaZip.append(lambdaReadStream, {name: lambdaFileName});

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
					addPathToZip(filePath);
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

	function addPathToZip(filePath) {
		const fileStats = fileSystem.statSync(filePath);
		const isDirectory = fileStats.isDirectory();
		let relativeFilePath = path.relative(lambdaDirectory, filePath);
		if (!isDirectory) {
			const fileReadStream = fileSystem.createReadStream(filePath);
			lambdaZip.append(fileReadStream, { name: relativeFilePath, stats: fileStats });
		} else {
			relativeFilePath = `${relativeFilePath}/`;
			lambdaZip.append("", { name: relativeFilePath, stats: fileStats });
		}
	}
}
