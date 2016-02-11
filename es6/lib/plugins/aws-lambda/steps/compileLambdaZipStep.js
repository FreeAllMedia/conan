import archiver from "archiver";
import path from "path";
import fs from "fs";
import unzip from "unzip2";
import inflect from "jargon";
import glob from "glob";
import Async from "flowsync";
import hacher from "hacher";
import { isClass } from "proven";

function buildZipPath(fullPath, basePath) {
	return path.normalize(fullPath).replace(`${path.normalize(basePath)}/`, "");
}

export default function compileLambdaZipStep(conan, context, stepDone) {
	/* eslint-disable new-cap */
	const conanAwsLambda = context.parameters;

	const packageZipFilePath = context.results.packageZipFilePath;

	const handlerFilePath = conanAwsLambda.handler()[1];
	const handlerName = conanAwsLambda.handler()[0];

	const fileSystem = context.fileSystem || fs;

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
		const lambdaModule = require(conanAwsLambda.filePath());
		const isClassLambda = isClass(lambdaModule).result;

		let conanHandlerContent;

		if (isClassLambda) {
			conanHandlerContent = `function requireDefault(fileName) {\n\tvar object = require(fileName);\n\tif (object && object.__esModule) {\n\t\treturn object;\n\t} else {\n\t\treturn { "default": object };\n\t}\n}\n\nvar LambdaClass = requireDefault("./${lambdaFilePath}").default;\n\nmodule.exports = {\n\t${handlerName}: function classHandler(event, context) {\n\t\tvar lambdaClass = new LambdaClass(event, context);\n\t\tlambdaClass.${handlerName}(event, context);\n\t}\n};\n`;
		} else {
			conanHandlerContent = `module.exports = {\n\t${handlerName}: require("./${lambdaFilePath}").${handlerName}\n};\n`;
		}
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
