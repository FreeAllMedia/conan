"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var lambdaClient = {
	getFunction: _sinon2["default"].spy(function (params, callback) {
		var returnData = {
			Configuration: {},
			Code: {}
		};
		callback(null, returnData);
	})
};

function newLambdaClient() {
	return lambdaClient;
}

var AWS = {
	Lambda: _sinon2["default"].spy(newLambdaClient)
};
exports.AWS = AWS;