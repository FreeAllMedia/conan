# Conan.js [![npm version](https://img.shields.io/npm/v/conan.svg)](https://www.npmjs.com/package/conan) [![license type](https://img.shields.io/npm/l/conan.svg)](https://github.com/FreeAllMedia/conan.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/conan.svg)](https://www.npmjs.com/package/conan) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

It cuts fries. It dices onions.

```javascript
import Conan from "conan";

const conan = new Conan;
conan.saySomething(); // will output "Something"
```

# Quality and Compatibility

[![Build Status](https://travis-ci.org/FreeAllMedia/conan.png?branch=master)](https://travis-ci.org/FreeAllMedia/conan) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/conan/badge.svg)](https://coveralls.io/r/FreeAllMedia/conan) [![Code Climate](https://codeclimate.com/github/FreeAllMedia/conan/badges/gpa.svg)](https://codeclimate.com/github/FreeAllMedia/conan)  [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/conan/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/conan)  [![Dependency Status](https://david-dm.org/FreeAllMedia/conan.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/conan?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/conan/dev-status.svg)](https://david-dm.org/FreeAllMedia/conan?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)



*If your platform is not listed above, you can test your local environment for compatibility by copying and pasting the following commands into your terminal:*

```
npm install conan
cd node_modules/conan
gulp test-local
```

# Installation

Copy and paste the following command into your terminal to install Conan:

```
npm install conan --save
```

## Import / Require

```
// ES6
import conan from "conan";
```

```
// ES5
var conan = require("conan");
```

```
// Require.js
define(["require"] , function (require) {
    var conan = require("conan");
});
```

# Getting Started

## More insights

In order to say something, you should know that `conan()` ... (add your test here)

# How to Contribute

See something that could use improvement? Have a great feature idea? We listen!

You can submit your ideas through our [issues system](https://github.com/FreeAllMedia/conan/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

We always aim to be friendly and helpful.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using Conan.js on a platform we aren't automatically testing for.

```
npm test
```
