module.exports = {
	handler: function handler(event, context) {
		var name = event.name;
		context.succeed("Hello, " + name + "!");
	}
};
