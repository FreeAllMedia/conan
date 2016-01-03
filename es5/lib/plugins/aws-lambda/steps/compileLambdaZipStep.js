"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = compileLambdaZipStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _archiver = require("archiver");

var _archiver2 = _interopRequireDefault(_archiver);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _unzip2 = require("unzip2");

var _unzip22 = _interopRequireDefault(_unzip2);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function compileLambdaZipStep(conan, context, stepDone) {
	/* eslint-disable new-cap */
	var conanAwsLambda = context.parameters;

	var packageZipFilePath = context.results.packageZipFilePath;

	var lambdaFilepath = conanAwsLambda.filePath();
	var lambdaDirectory = _path2["default"].dirname(lambdaFilepath);
	var lambdaFilename = _path2["default"].basename(lambdaFilepath);
	var lambdaReadStream = _fs2["default"].createReadStream(lambdaFilepath);

	var dependencyGlobOrGlobs = conanAwsLambda.dependencies();

	var lambdaZip = (0, _archiver2["default"])("zip", {});
	lambdaZip.append(lambdaReadStream, { name: lambdaFilename });

	function appendGlobFiles(globString) {
		(0, _glob2["default"])(globString, function (error, filePaths) {
			filePaths.forEach(function (filePath) {
				var fileReadStream = _fs2["default"].createReadStream(filePath);
				var relativeFilePath = _path2["default"].relative(lambdaDirectory, filePath);
				lambdaZip.append(fileReadStream, { name: relativeFilePath });
			});
		});
	}

	if (dependencyGlobOrGlobs.constructor === Array) {
		var dependencyGlobs = dependencyGlobOrGlobs;
		dependencyGlobs.forEach(function (dependencyGlob) {
			appendGlobFiles(dependencyGlob);
		});
	} else {
		var dependencyGlob = dependencyGlobOrGlobs;
		appendGlobFiles(dependencyGlob);
	}

	//lambdaZip.append();

	_fs2["default"].createReadStream(packageZipFilePath).pipe(_unzip22["default"].Parse()).on("entry", function (entry) {
		var isDirectory = entry.path.slice(-1) === "/";
		if (!isDirectory) {
			lambdaZip.append(entry, { name: "node_modules/" + entry.path });
		}
	}).on("close", function () {
		var lambdaZipFileName = (0, _jargon2["default"])(conanAwsLambda.name()).snake.toString();
		var lambdaZipFilePath = context.temporaryDirectoryPath + "/" + lambdaZipFileName + ".zip";
		var lambdaZipWriteStream = _fs2["default"].createWriteStream(lambdaZipFilePath);

		lambdaZipWriteStream.on("close", function () {
			stepDone(null, {
				lambdaZipFilePath: lambdaZipFilePath
			});
		});

		lambdaZip.pipe(lambdaZipWriteStream);
		lambdaZip.finalize();
	});
}

module.exports = exports["default"];