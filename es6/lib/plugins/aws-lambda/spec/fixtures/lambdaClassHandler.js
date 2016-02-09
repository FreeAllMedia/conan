function requireDefault(fileName) {
	var object = require(fileName);
	if (object && object.__esModule) {
		return object;
	} else {
		return { "default": object };
	}
}

var LambdaClass = requireDefault("./lambdaClass.js");

module.exports = {
	handler: function classHandler(event, context) {
		var lambdaClass = new LambdaClass(event, context);
		lambdaClass.handler(event, context);
	}
};
