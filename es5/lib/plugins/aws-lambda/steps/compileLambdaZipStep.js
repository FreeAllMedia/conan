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

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function compileLambdaZipStep(conan, context, stepDone) {
	/* eslint-disable new-cap */
	var conanAwsLambda = context.parameters;

	var packageZipFilePath = context.results.packageZipFilePath;

	var handlerFilePath = conanAwsLambda.handler()[1];

	if (_fs2["default"].existsSync(handlerFilePath)) {
		conanAwsLambda.dependencies(conanAwsLambda.filePath());
		conanAwsLambda.filePath(handlerFilePath);
	}

	var lambdaFilePath = conanAwsLambda.filePath();
	var lambdaDirectory = _path2["default"].dirname(lambdaFilePath);
	var lambdaFileName = _path2["default"].basename(lambdaFilePath);
	var lambdaReadStream = _fs2["default"].createReadStream(lambdaFilePath);

	var lambdaZipFileName = (0, _jargon2["default"])(conanAwsLambda.name()).snake.toString();
	var lambdaZipFilePath = context.temporaryDirectoryPath + "/" + lambdaZipFileName + ".zip";
	var lambdaZipWriteStream = _fs2["default"].createWriteStream(lambdaZipFilePath);

	var dependencyGlobOrGlobs = conanAwsLambda.dependencies();

	var lambdaZip = (0, _archiver2["default"])("zip", {});
	lambdaZip.append(lambdaReadStream, { name: lambdaFileName });

	_flowsync2["default"].series([appendDependencies, appendPackages], function () {
		stepDone(null, {
			lambdaZipFilePath: lambdaZipFilePath
		});
	});

	function appendDependencies(done) {
		if (dependencyGlobOrGlobs) {
			if (dependencyGlobOrGlobs.constructor === Array) {
				var dependencyGlobs = dependencyGlobOrGlobs;
				_flowsync2["default"].mapParallel(dependencyGlobs, appendGlobFiles, done);
			} else {
				var dependencyGlob = dependencyGlobOrGlobs;
				appendGlobFiles(dependencyGlob, done);
			}
		} else {
			done();
		}

		function appendGlobFiles(globString, callback) {
			(0, _glob2["default"])(globString, function (error, filePaths) {
				filePaths.forEach(function (filePath) {
					addPathToZip(filePath);
				});
				callback();
			});
		}
	}

	function appendPackages(done) {
		if (packageZipFilePath) {
			_fs2["default"].createReadStream(packageZipFilePath).pipe(_unzip22["default"].Parse()).on("entry", function (entry) {
				var isDirectory = entry.path.slice(-1) === "/";
				if (!isDirectory) {
					lambdaZip.append(entry, { name: "node_modules/" + entry.path });
				}
			}).on("close", function () {
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
		var fileStats = _fs2["default"].statSync(filePath);
		var isDirectory = fileStats.isDirectory();
		var relativeFilePath = _path2["default"].relative(lambdaDirectory, filePath);
		if (!isDirectory) {
			var fileReadStream = _fs2["default"].createReadStream(filePath);
			lambdaZip.append(fileReadStream, { name: relativeFilePath, stats: fileStats });
		} else {
			relativeFilePath = relativeFilePath + "/";
			lambdaZip.append("", { name: relativeFilePath, stats: fileStats });
		}
	}
}

module.exports = exports["default"];