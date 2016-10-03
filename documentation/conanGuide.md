![](../conan-logo.png)
# Overview

Conan.js is a simple deployment system framework. It helps you build custom deployers for anything. Its plugin-based architecture breaks down complex deployment strategies into simple steps which can be run one after the other, or in parallel.

All of the code is 100% tested on a continuous integration, quality control, and dependency management platform to protect against errors and bugs, and to make integration of new features as seamless as possible.

# Deployers Made With Conan.js

* **[Conan AWS  Lambda](https://github.com/FreeAllMedia/conan-aws-lambda)**
	* Programmatically deploy and manage AWS Lambda functions.
	* Takes full advantage of every conan feature while remai. (Great as an example for writing your own deployer)
	* Simple code base with small files.

# Writing Custom Deployers

* Check out the [Conan.js Developer Guide](#developerGuide.md) to learn about writing a deployer, plugin, or u from scratch.

# Changelog

* **0.2.0** - Performance & Naming Optimizations
	* Integrates all [`mrt@0.3.x`](https://github.com/FreeAllMedia/mrt/releases/tag/0.3.0) and [`mrt@0.4.x`](https://github.com/FreeAllMedia/mrt/releases/tag/0.4.0) naming changes.
	* Internal step system extracted into `staircase` which is more stable and can be independently worked on.
* **0.1.0** - First BETA release for public review.

# Contribute to Conan.js

* **If you have a feature request**, please create an issue outlining how you would like the feature to work.
* **If you have a pull-request**, please make sure that all tests are passing with 100% coverage before submitting.
