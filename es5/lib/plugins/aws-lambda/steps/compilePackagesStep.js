"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = compilePackagesStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function compilePackagesStep(conan, context, stepDone) {
	var AWS = context.libraries.AWS;

	var lambda = new AWS.Lambda({
		region: conan.config.region
	});

	var s3 = new AWS.S3({
		region: conan.config.region
	});

	var parameters = {
		FunctionName: "Thaumaturgy",
		InvocationType: "RequestResponse",
		LogType: "Tail",
		Payload: JSON.stringify({
			packages: context.parameters.packages(),
			bucket: context.parameters.bucket(),
			key: context.parameters.key()
		})
	};

	lambda.invoke(parameters, function (error, data) {
		var packageZipReadStream = s3.getObject({
			Bucket: context.parameters.bucket(),
			Key: context.parameters.key()
		}).createReadStream();

		var packageZipFileName = context.parameters.key();
		var packageZipFilePath = context.temporaryDirectoryPath + "/" + packageZipFileName;
		var packageZipWriteStream = _fs2["default"].createWriteStream(packageZipFilePath);

		packageZipWriteStream.on("close", function () {
			stepDone(null, {
				packageZipFilePath: packageZipFilePath
			});
		});

		packageZipReadStream.pipe(packageZipWriteStream);
	});
}

module.exports = exports["default"];