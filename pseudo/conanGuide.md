## Conan Guide

### Overview

This guide aims to provide you with everything you need to know to understand and use Conan: The Deployer.

It's dividing into sections for the AWS Lambda Plugin, AWS API Gateway Plugin, and finally a Developer's Guide for those interested in developing their own Conan.js plugins.

### What is Conan?

Conan: The Deployer is a framework for designing and running un-opinionated custom deployment systems to any hosting platform.

It is fundamentally designed on a very simple plugin-based architecture to allow maximum flexibility for deployment system developers and those that will end up using their systems.

Internally, Conan.js manages the workflow of deployment into small, easy-to-test-and-maintain "steps", which can work together to completely automate even the most tedious of hosting platforms.

Currently, Conan.js has two built-in plugins for demonstrating deployment of both AWS Lambda functions, and AWS API Gateway stacks. Both of these plugins will eventually be put into stand-alone packages; effort permitting.

### Workflow Overview

``` javascript
import Conan from "conan";
import MyPlugin from "conan-my-plugin";

const conan = new Conan();
conan.use(MyPlugin);

// `conan` is now modified by MyPlugin. Refer to its documentation for functionality.
```

### Installation

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
