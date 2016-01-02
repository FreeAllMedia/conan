import temp from "temp";
import fs from "fs";

export default function compilePackagesStep(conan, context, stepDone) {
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
		const packageZipReadStream = s3.getObject({
			Bucket: context.parameters.bucket(),
			Key: context.parameters.key(),
		}).createReadStream();

		const packageZipFileName = context.parameters.key();
		const packageZipFilePath = `${context.temporaryDirectoryPath}/${packageZipFileName}`;
		const packageZipWriteStream = fs.createWriteStream(packageZipFilePath);

		packageZipWriteStream.on("close", () => {
			stepDone(null, {
				packageZipFilePath: packageZipFilePath
			});
		});

		packageZipReadStream.pipe(packageZipWriteStream);
	});
}
