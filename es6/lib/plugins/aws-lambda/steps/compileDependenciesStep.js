import temp from "temp";
import fs from "fs";

export default function compileDependenciesStep(conan, context, stepDone) {
	const AWS = context.libraries.AWS;

	const lambda = new AWS.Lambda({
		region: conan.config.region
	});

	const s3 = new AWS.S3({
		region: conan.config.region
	});

	const parameters = {
		FunctionName: "Thaumaturgy",
		InvocationType: "RequestResponse",
		LogType: "Tail",
		Payload: JSON.stringify({
			packages: context.parameters.packages(),
			bucket: context.parameters.bucket(),
			key: context.parameters.key()
		})
	};

	lambda.invoke(parameters, (error, data) => {
		const dependencyZipReadStream = s3.getObject({
			Bucket: context.parameters.bucket(),
			Key: context.parameters.key(),
		}).createReadStream();

		const dependencyZipFileName = context.parameters.key();
		const dependencyZipFilePath = `${context.temporaryDirectoryPath}/${dependencyZipFileName}`;
		const dependencyZipWriteStream = fs.createWriteStream(dependencyZipFilePath);

		dependencyZipWriteStream.on("close", () => {
			stepDone(null, {
				dependencyZipFilePath: dependencyZipFilePath
			});
		});

		dependencyZipReadStream.pipe(dependencyZipWriteStream);
	});
}
