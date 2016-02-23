![](./conan-logo.png)

[![npm version](https://img.shields.io/npm/v/conan.svg)](https://www.npmjs.com/package/conan) [![license type](https://img.shields.io/npm/l/conan.svg)](https://github.com/FreeAllMedia/conan.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/conan.svg)](https://www.npmjs.com/package/conan) ![Source: ECMAScript 6](https://img.shields.io/badge/Source-ECMAScript_2015-green.svg)
[![Build Status](https://travis-ci.org/FreeAllMedia/conan.png?branch=master)](https://travis-ci.org/FreeAllMedia/conan) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/conan/badge.svg)](https://coveralls.io/r/FreeAllMedia/conan) [![Code Climate](https://codeclimate.com/github/FreeAllMedia/conan/badges/gpa.svg)](https://codeclimate.com/github/FreeAllMedia/conan) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/conan/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/conan) [![Dependency Status](https://david-dm.org/FreeAllMedia/conan.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/conan?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/conan/dev-status.svg)](https://david-dm.org/FreeAllMedia/conan?theme=shields.io#info=devDependencies)
![node 5.x.x](https://img.shields.io/badge/node-5.x.x-brightgreen.svg) ![node 4.x.x](https://img.shields.io/badge/node-4.x.x-brightgreen.svg) ![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg) ![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)

# Conan: The Deployer

Conan.js is a framework for developing barbarically simple, unobtrusive deployment systems of any kind. Its plugin-based architecture helps to break down complex deployment strategies into simple steps which can be run one after the other or in parallel.

The codebase is 100% tested on a continuous integration, quality control, and dependency management platform to protect against errors and bugs, and to make integration of new features as seamless as possible.

## Usage / Available Plugins

Conan.js doesn't do anything itself except load plugins and provide a framework for developing deployment systems. **Instructions for each plugin are available on their homepages:**

* **[AWS Lambda](https://github.com/FreeAllMedia/conan-aws-lambda)**
	* Deploy lambdas to AWS without changing the way you code.
	* Simplify lambda development and testing with class-based lambdas.
* **[AWS API Gateway](https://github.com/FreeAllMedia/conan-aws-api-gateway)**
	* Easily deploy complicated APIs which route to your lambdas just the way you
	* Refer to Lambdas by name; no need to fumble with Amazon Resource Names.

### Finding / Using Plugins

1. To find conan plugins, simply use the following npm terminal command:

	``` shell
	$ npm search conan-plugin
	```

2. After you've found a plugin that you want to use, simply install it like you would a normal npm module:

	``` shell
	$ npm install conan-my-plugin --save-dev
	```

3. In your script, import the plugin, then tell conan to use it:

	``` javascript
	import Conan from "conan";
	import MyPlugin from "conan-my-plugin";

	const conan = new Conan();
	conan.use(MyPlugin);

	// `conan` is now modified by MyPlugin. Refer to its documentation for functionality.
	```

## Writing Custom Plugins

* Check out the [Conan.js developers guide](./developers.md) to learn about writing a Conan.js Plugin from scratch.

## Additional Plugins

* More plugins will become available as time and developers become available to join the project.
* Please [contact our team lead by clicking here](mailto:fam-operations+conan@gmail.com) to discuss expedition of any plugins or features.

## Dev Team Roadmap

1. Refactor the steps system to use classes instead of functions, for easier testing, portability, and reusability.
2. Improve documentation for plugin developers.
3. Introduce a command line component system so that plugins can get automatic CLIs.

## Changelog

* 0.1.0 - First BETA release for public review.

## How To Contribute

To contribute to the core Conan.js repository, you will need a firm understanding of:

* behavior-driven-development
* linting with `eslint`
* babel & transpiling

In order for a pull request to be accepted:

* All tests must pass.
* All tests must be meaningful.
* There must be 100% coverage for
