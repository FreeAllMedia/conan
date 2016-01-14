exports.handler = function handler(event, context) {
	var name = event.params.path.id;
	context.succeed("Hello, " + name + "!");
};
