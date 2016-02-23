![](../conan-logo.png)

# Conan AWS Lambda

This plugin makes deploying AWS Lambda functions easy and intuitive. It was built from the ground-up to be completely unobtrusive and unopinionated about how your lambda code is written. In other words: you tell Conan AWS Lambda how to deploy your lambdas, but it doesn't tell you how to code.

## Installation

Conan can be installed as an npm development dependency with a single terminal command:

``` shell
$ npm install conan --save-dev
```

## Configuration

### AWS IAM Roles & Permissions

**Important:** In order for Conan AWS Lambda to work properly, you must provide an AWS IAM Role with sufficient permissions for:

* Creating more IAM Roles and set their permissions
* Full Access For AWS Lambda
* Full Access For AWS API Gateway
* Full Access For AWS S3

## Basic Hello World

In this example, we'll deploy a simple "Hello, World!" lambda.

**lambdas/helloWorld.js**

``` javascript
module.exports = function helloWorld(event, context) {
	context.succeed("Hello, " + event.name + "!");
}
```

**conan.js**

``` javascript
import conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan();
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("HelloWorld")
		.filePath(`lambdas/helloWorld.js`)
		.role("MyAmiRoleName");

conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

## Including Dependencies

In this example, we'll include extra file in addition to our lambda function, controlling their base and eventual zip paths:

**conan.js**

``` javascript
import conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan();
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("AccountCreate")
		.handler(`lambdas/accountCreate.js`)
			.role("AWSLambda")
		.dependencies(`{lib|node_modules}/**/*`)
		.dependencies(`../shared_modules/someModule/**/*`, {
			basePath: `../shared_modules/`,
			zipPath: `node_modules/`
		});

conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

## Including Packages

A common issue with using AWS Lambda is that native/static code (such as bundled C++ code), must be compiled directly on either an EC2 instance or within a lambda function itself, in order for the files to build against the correct processor architecture.

Conan AWS Lambda solves this issue by using `Akiro.js` to build dependent packages directly on AWS Lambda (in parallel), then send them back to be put into your lambda .zip file automatically. Additionally, `Akiro.js` caches your builds locally so that you only have to compile any version of a package once.

**conan.js**

``` javascript
import conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan();
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("AccountCreate")
		.handler(`lambdas/accountCreate.js`)
			.role("AWSLambda")
		.packages({
			"incognito": "^0.0.16",
			"dovima": "0.2.x"
		});

conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```
