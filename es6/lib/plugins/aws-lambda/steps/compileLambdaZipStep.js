import archiver from "archiver";
import path from "path";
import fileSystem from "fs";
import unzip from "unzip2";
import inflect from "jargon";
import glob from "glob";
import Async from "flowsync";
import hacher from "hacher";

function buildZipPath(fullPath, basePath) {
	return fullPath.replace(`${path.normalize(basePath)}/`, "");
}

export default function compileLambdaZipStep(conan, context, stepDone) {
	/* eslint-disable new-cap */
	const conanAwsLambda = context.parameters;

	const packageZipFilePath = context.results.packageZipFilePath;

	const handlerFilePath = conanAwsLambda.handler()[1];
	const handlerName = conanAwsLambda.handler()[0];

	//the lambda file path is another dependency
	conanAwsLambda.dependencies(conanAwsLambda.filePath());

	const lambdaZip = archiver("zip", {});

	if (fileSystem.existsSync(handlerFilePath)) {
		conanAwsLambda.filePath(handlerFilePath);
		const lambdaFilePath = conanAwsLambda.filePath();
		const lambdaFileName = path.basename(lambdaFilePath);
		const lambdaReadStream = fileSystem.createReadStream(lambdaFilePath);

		lambdaZip.append(lambdaReadStream, {name: lambdaFileName});
	} else {
		const lambdaFilePath = buildZipPath(conanAwsLambda.filePath(), conan.config.basePath);
		const conanHandlerContent = `module.exports = {\n\t${handlerName}: require("./${lambdaFilePath}").${handlerName}\n};`;
		const conanHandlerFileName = `conanHandler-${hacher.getUUID()}.js`;

		conanAwsLambda.filePath(conanHandlerFileName);
		lambdaZip.append(conanHandlerContent, {name: conanHandlerFileName});
	}

	const lambdaZipFileName = inflect(conanAwsLambda.name()).snake.toString();
	const lambdaZipFilePath = `${context.temporaryDirectoryPath}/${lambdaZipFileName}.zip`;
	const lambdaZipWriteStream = fileSystem.createWriteStream(lambdaZipFilePath);

	const dependencies = conanAwsLambda.dependencies();

	Async.series([
		appendDependencies,
		appendPackages
	], () => {
		stepDone(null, {
			lambdaZipFilePath: lambdaZipFilePath
		});
	});

	function appendDependencies(done) {
		if (dependencies.length > 0) {
			Async.mapParallel(dependencies, appendDependencyGlob, done);
		} else {
			done();
		}

		function appendDependencyGlob(dependency, callback) {
			const dependencyGlob = dependency[0];
			const dependencyZipPath = dependency[1];

			glob(dependencyGlob, (error, filePaths) => {
				filePaths.forEach((filePath) => {
					addPathToZip(filePath, dependencyZipPath);
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

	function addPathToZip(filePath, relativeZipPath) {
		const fileStats = fileSystem.statSync(filePath);
		const isDirectory = fileStats.isDirectory();

		let relativeFilePath;
		let finalFilePath = buildZipPath(filePath, conan.config.basePath);

		if (relativeZipPath) {
			relativeFilePath = `${relativeZipPath}/${finalFilePath}`;
		} else {
			relativeFilePath = finalFilePath;
		}

		if (!isDirectory) {
			const fileReadStream = fileSystem.createReadStream(filePath);
			lambdaZip.append(fileReadStream, { name: relativeFilePath, stats: fileStats });
		} else {
			relativeFilePath = `${relativeFilePath}/`;
			lambdaZip.append("", { name: relativeFilePath, stats: fileStats });
		}
	}
}
