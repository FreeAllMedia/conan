![](./conan-logo.png)

[![npm version](https://img.shields.io/npm/v/conan.svg)](https://www.npmjs.com/package/conan) [![license type](https://img.shields.io/npm/l/conan.svg)](https://github.com/FreeAllMedia/conan.git/blob/master/LICENSE) [![Build Status](https://travis-ci.org/FreeAllMedia/conan.png?branch=master)](https://travis-ci.org/FreeAllMedia/conan) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/conan/badge.svg)](https://coveralls.io/r/FreeAllMedia/conan) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/conan/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/conan) [![Dependency Status](https://david-dm.org/FreeAllMedia/conan.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/conan?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/conan/dev-status.svg)](https://david-dm.org/FreeAllMedia/conan?theme=shields.io#info=devDependencies)

# Overview

Conan.js helps break down complex tasks into manageable steps that are portable and can be deployed programmatically.

All code is 100% tested on continuous integration, quality control, and dependency management platforms. This helps to protect against bugs and to make integration of new features as seamless as possible.

# Deployers Made With Conan.js

* **[Conan AWS  Lambda](https://github.com/FreeAllMedia/conan-aws-lambda)**
	* Programmatically deploy and manage AWS Lambda functions.
	* Simple code base with small files.
	* Takes full advantage of every conan feature. (Great as an example for writing your own deployer)

# Writing Custom Deployers

* Check out the [Conan.js Developer Guide](#developerGuide.md) to learn about writing code with Conan.

# Changelog

* **0.2.0** - Performance & Naming Optimizations
	* Integrates all [`mrt@0.3.x`](https://github.com/FreeAllMedia/mrt/releases/tag/0.3.0) and [`mrt@0.4.x`](https://github.com/FreeAllMedia/mrt/releases/tag/0.4.0) naming changes.
	* Internal step system extracted into `staircase` which is more stable and can be independently worked on.
* **0.1.0** - First BETA release for public review.

# Contribute to Conan.js

* **If you have a feature request**, please create an issue outlining how you would like the feature to work.
* **If you have a pull-request**, please make sure that all tests are passing with 100% coverage before submitting.
