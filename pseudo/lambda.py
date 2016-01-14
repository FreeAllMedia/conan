def handler(event, context):
	name = event["name"]
	return {
        "message": "Hello, " + name + "!"
    }
