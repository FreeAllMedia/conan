import archiver from "archiver";
import stream from "stream";
import path from "path";
import fs from "fs";
import unzip from "unzip2";
import inflect from "jargon";

export default function compileLambdaZipStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;

	const dependencyZipFilePath = context.results.dependencyZipFilePath;

	const lambdaFilepath = conanAwsLambda.filePath();
	const lambdaFilename = path.basename(lambdaFilepath);
	const lambdaReadStream = fs.createReadStream(lambdaFilepath);

	const lambdaZip = archiver("zip", {});
	lambdaZip.append(lambdaReadStream, {name: lambdaFilename});

	fs.createReadStream(dependencyZipFilePath)
		.pipe(unzip.Parse())
		.on("entry", (entry) => {
			const isDirectory = entry.path.slice(-1) === "/";
			if (!isDirectory) {
				lambdaZip.append(entry, {name: entry.path});
			}
		})
		.on("close", () => {
			const lambdaZipFileName = inflect(conanAwsLambda.name()).snake.toString();
			const lambdaZipFilePath = `${context.temporaryDirectoryPath}/${lambdaZipFileName}.zip`;
			const lambdaZipWriteStream = fs.createWriteStream(lambdaZipFilePath);

			lambdaZipWriteStream.on("close", () => {
				stepDone(null, {
					lambdaZipFilePath: lambdaZipFilePath
				});
			})

			lambdaZip.pipe(lambdaZipWriteStream);
			lambdaZip.finalize();
		});
}
