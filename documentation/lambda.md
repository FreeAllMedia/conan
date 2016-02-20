### Conan AWS Lambda Plugin

AWS Lambda Functions are awesome in theory, and easy to write.. but a *nightmare* to deploy in an automated fashion. The Conan AWS Lambda Plugin strips away all of the complexity and replaces it with an intuitive, easy-to-read-&-write, convention and configuration interface.

#### Function-Based Lambdas

You can write your lambda functions as normal and conan will deploy them as expected.

**myLambdaFunction.js**

``` javascript
export function handler(event, context) {
	var name = event.name;
	context.succeed("Hello, " + name + "!");
}
```

**conan.js**

``` javascript
import lambdaFunction from "./myLambdaFunction.js";

conan.lambda("My Lambda", lambdaFunction, "AwsAmiRoleName");
```

* You can also write lambda functions as a public class method. The plugin takes care of the internal routing:
* The handler method name is customizable.

**myLambdaClass.js**

``` javascript
export class MyLambda {
	constructor(event, context) {
		this.options = {};
		this.hasName = event.name ? true : false;
	}

	handler(event, context) {
		if (this.hasName) {

		}
	}
}
```

**conan.js:**

``` javascript
import LambdaClass from "./myLambdaClass.js";

conan.lambda("My Lambda", LambdaClass, "AwsAmiRoleName");
```

``` javascript
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

const conan = new Conan();
conan.use(ConanAwsLambda);

import lambdaFunction from "./myLambda.js";

conan
	.lambda("My Lambda", lambdaFunction, "AwsAmiRoleName")
		.packages({
			"almaden": "0.x.x",
			"dovima": "0.1.x",
			"incognito": "^0.1.4"
		})
		.dependencies([
			"./**/*.(js|json)"
		]);

conan.deploy((error) => {
	console.log("Deployment OK!");
});
```

#### Conan AWS API Gateway Plugin

### Workflow Overview

``` javascript
import Conan from "conan";
import MyPlugin from "conan-my-plugin";

const conan = new Conan();
conan.use(MyPlugin);

// `conan` is now modified by MyPlugin. Refer to its documentation for functionality.
```

###

## Installation

Conan can be installed as an npm development dependency with a single terminal command:

``` shell
$ npm install conan --save-dev
```

### AWS IAM Roles & Permissions

**Important:** In order for Conan.js to work properly, you must provide an AWS IAM Role with sufficient permissions to:

* Create more IAM Roles and set their permissions
* Full Access For AWS Lambda
* Full Access For AWS API Gateway
* Full Access For AWS S3

### Finding / Using Plugins

1. To find conan plugins, simply use the following npm terminal command:

	``` shell
	$ npm search conan-plugin
	```

2. After you've found a plugin that you want to use, simply install it like you would a normal npm module:

	``` shell
	$ npm install conan-my-plugin
	```

3. In your software, import the plugin, then tell conan to use it:

	``` javascript
	import Conan from "conan";
	import MyPlugin from "conan-my-plugin";

	const conan = new Conan();
	conan.use(MyPlugin);

	// `conan` is now modified by MyPlugin. Refer to its documentation for functionality.
	```
