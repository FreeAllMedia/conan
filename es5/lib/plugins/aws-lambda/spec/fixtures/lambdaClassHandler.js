"use strict";

module.exports = {
	handler: function classHandler(event, context) {
		var LambdaClass = require("./lambdaClass.js")["default"];
		var lambdaClass = new LambdaClass(event, context);
		lambdaClass.handler(event, context);
	}
};