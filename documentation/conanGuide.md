![](../conan-logo.png)
# Overview

Conan.js is a behind-the-scenes framework for developing barbarically simple deployment systems of any kind. Its plugin-based architecture helps to break down complex deployment strategies into simple steps which can be run one after the other, or in parallel.

The codebase is 100% tested on a continuous integration, quality control, and dependency management platform to protect against errors and bugs, and to make integration of new features as seamless as possible.

## Available Plugins

**To learn more** about each plugin, click on the following links to be brought directly to their homepage:

* **[AWS Lambda](https://github.com/FreeAllMedia/conan-aws-lambda)**
	* Deploy lambdas to AWS without changing the way you code.
	* Simplify lambda development and testing with class-based lambdas.
* **[AWS API Gateway](https://github.com/FreeAllMedia/conan-aws-api-gateway)**
	* Easily deploy complicated APIs which route to your lambdas just the way you
	* Refer to Lambdas by name; no need to fumble with Amazon Resource Names.

## Writing Custom Plugins

* Check out the [Conan.js developers guide](#) to learn about writing a Conan.js Plugin from scratch.

## Additional Plugins

* More plugins will become available as time and developers become available to join the project.
* Please [contact our team lead by clicking here](mailto:fam-operations+conan@gmail.com) to discuss expedition of any plugins or features.

## Dev Team Roadmap

1. Refactor the steps system to use classes instead of functions, for easier testing, portability, and reusability.
2. Improve documentation for plugin developers.
3. Introduce a command line component system so that plugins can get automatic CLIs.

## Changelog

* 0.2.0 - Optimizations
	* Internal step system extracted into `staircase`, which can now be independently improved upon.
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
