[![](./conan-logo.png)](./README.md)

# Custom Conan Plugins

Creating your own Conan Plugin is very simple, involving only a few steps:

1. **[Design The Plugin Interface](#1designtheplugininterface)**
2. **[Create a Plugin Constructor](#2createapluginconstructor)**
3. **[Add Components](#3addcomponents)**
4. **[Add Steps To Components](#4addstepstocomponents)**
5. **[Create Each Deployment Step](#5createeachdeploymentstep)**
6. **[Publish Your Plugin](#6publishyourplugin)**

## Basic Conan Plugin Anatomy

While you can use any directory structure you'd like with conan plugins, here is a bare-bones example that we'll use throughout this document:

``` shell
$ tree my-conan-plugin/
my-conan-plugin/
├── lib
│   ├── component.js
│   └── plugin.js
├── package.json
└── README.md
```

## 1. Design The Plugin Interface

Ultimately, your plugin is going to be used in someone's `conan.js` file (or equivalent), so it's a good idea to begin designing your plugin there.

For this example, we're going to design an interface for logging into a posix-based server on port 8000, then:

1. Change directory to `~/myApp`
2. Clone a git repository to `~/myApp/releases/${currentDate}`
3. Remove the current soft link to the previous release.
4. Create a new soft link to the new current release.

**conan.js**:

``` javascript
const conan = new Conan({});

conan.posixServer("my.staging.server").port(8000);
conan.posixServer("my.production.server").port(8000);

conan.components.posixServer.forEach(server => {
	server
		.changeDirectory("~/myApp/")
		.gitClone("https://github.com/MyCompany/my-conan-plugin.git", "releases/2016-02-10")
		.remove("./current")
		.softLink("releases/2016-02-10", "current");
});

conan.deploy(error => {
	if (error) { throw error; }
	// Deployment is complete
});
```

## 2: Create a Plugin Constructor

Conan's plugin system is as simple and un-opinionated as it gets. You start by creating a normal constructor that accepts the current instance of `conan` as its sole argument. This can be done with classic es5 constructors, or the es6 `class` keyword as well:

**/lib/plugin.js**:

``` javascript
// ES5
module.exports = function PosixServerPlugin(conan) {
	this.conan = conan;
}
```

``` javascript
// ES6
export default class PosixServerPlugin {
	constructor(conan) {
		this.conan = conan;
	}
}
```

## 3: Add Components

`Components` designate parts of a plugin's interface, and the `deployment steps` to be run. For example, let's setup the `posixServer` component and add it to conan in `plugin.js`:

**/lib/component.js**

``` javascript
import { ConanComponent } from "conan";

class PosixServer extends ConanComponent {
	constructor(hostName, conan) {
		this.conan = conan;

		// Each designated parameter will be given its own
		// getter/setter function on the component instance:
		this.parameters(
			"hostName",
			"port"
		);

		// this.hostName() was created by this.parameters()
		this.hostName(hostName);
	}
}
```

**/lib/plugin.js**

``` javascript
import PosixServer from "./component.js";

export default class CustomConanPlugin {
	constructor(conan) {
		// This will create conan.posixServer, which
		// will return an instance of PosixServer
		conan.addComponent("posixServer", PosixServer);
	}
}
```

## 4: Add Steps To Components

**/lib/component.js**

``` javascript
import { ConanComponent } from "conan";

import loginToServer from "./steps/loginToServer.js";
import changeDirectory from "./steps/changeDirectory.js";
import gitClone from "./steps/gitClone.js";
import remove from "./steps/remove.js";
import softLink from "./steps/softLink.js";

class PosixServer extends ConanComponent {
	constructor(hostName, conan) {
		this.conan = conan;

		// Each designated parameter will be given its own
		// getter/setter function on the component instance:
		this.parameters(
			"hostName",
			"port"
		);

		// this.hostName() was created by this.parameters()
		this.hostName(hostName);

		// Add default steps here
		this.conan.steps.add(loginToServer, {
			server: this
		});

		this.changeDirectory();

		this.stepParameters = {
			server: this
		};
	}

	changeDirectory(directoryPath) {
		this.stepParameters.directoryPath = directoryPath;
		this.conan.steps.add(changeDirectory, this.stepParameters);
	}

	gitClone(gitRepoUri, localDirectoryPath) {
		this.stepParameters.gitRepoUri = gitRepoUri;
		this.stepParameters.localDirectoryPath = localDirectoryPath;
		this.conan.steps.add(gitClone, this.stepParameters);
	}

	remove(filePath) {
		this.stepParameters.filePath = filePath;
		this.conan.steps.add(remove, this.stepParameters);
	}

	softLink(fromFilePath, toFilePath) {
		this.stepParameters.fromFilePath = fromFilePath;
		this.stepParameters.toFilePath = toFilePath;
		this.conan.steps.add(softLink, this.stepParameters);
	}
}
```

# 5: Create Each Deployment Step

Each step is a single function that automatically receives exactly three arguments:

* **conan** - This is the instance of conan you're using.
* **context** - An object with three properties:
    * **context.parameters** - The parameters sent in by your plugin.
    * **context.libraries** - Libraries you can setup to be available to every step.
    * **context.results** - An aggregate of each result value passed back by each step.
* **stepDone** - The callback for when the step has completed. Accepts an error as the first argument, and an object as the second which is aggregated into `context.results`;

For example, here is the complete step for the above example's `loginToServer` step:

**./lib/steps/loginToServer.js**:

``` javascript
import SSH from "simple-ssh";

export default function loginToServer(conan, context, stepDone) {
	const server = context.parameters.server;

	const hostName = server.hostName();
	const userName = server.username();
	const password = server.password();
	const port = server.port();

	const ssh = new SSH({
		host: hostName,
		user: userName,
		pass: password,
		port: port
	}).on("ready", () => {
		stepDone(null, {
			ssh: ssh
		});
	});
}
```

**Note:** Any property you set on the return value object of stepDone will be aggregated onto `context.results`, and any duplicate values set will overwrite the previous.

# 6: Publish Your Plugin

After your steps and components are completed, you'll want to publish your plugin some place where others can find it. To do this, just add the keyword `conan-plugin` to your package.json file and publish as you would normally to `npm`. Voila! Your plugin is published and ready to be shared with others!

``` javascript
{
  "name": "my-conan-plugin",
  "version": "0.0.1",
  "description": "Deploy to posix-based web servers with ease!",
  "main": "lib/plugin.js",
  "scripts": {},
  "repository": {
    "type": "git",
    "url": "https://github.com/MyCompany/my-conan-plugin.git"
  },
  "keywords": [
    "conan-plugin",
		"posix",
		"server",
		"deploy"
  ],
  "author": "My Company, LLC",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/MyCompany/my-conan-plugin/issues"
  },
  "homepage": "https://github.com/MyCompany/my-conan-plugin",
  "dependencies": {},
  "devDependencies": { }
}

```
