```
             __________                       .__
           .'  .v-._.- _____   _____   _____   ) \     _____   _____
          /  .(W--\| .'.---.'. |\./\   |\./|  / | \    |\ /\   |\ /|
__       |  /<M.   '/ / .-. \ \| |\ \  | | | / / \ \   | |\ \  | | |
\ b________/#@|\-----------\ \ \--\\ \-| | |----\ \ \-----\\ \-| | |-.
 >@)######(#( )#H>==========) ) )==\\ \| | |=====\ \ \=====\\ \  | |-->
/_p~~~~~~~~\#@|/-----------/ / /----\\ \ | |------\ \ \-----\\ \ | |-'
         |  \<M'   .\ \ '-' / /| | | \\  | | /     \ \ | | | \\  | |
          \  '(B--/| \ '---' / |/^\|  \'.| |/       \/'./ \|  \'.| |
           '.  '?_.-._'-----'  '---'   ) '.'.       '-------'  ) '.'.  
             '---------               '------' THE DEPLOYER  '------'

```

# Conan.js

Conan.js is a PRE-ALPHA project under heavy development. Please only consider this version as a preview, and not necessarily representative of its final form.

## What is Conan.js?

Conan.js is a plugin-based `deployment system framework`. It comes pre-equipped with plugins for `AWS Lambda` & `AWS Gateway API` to show off how it works and to inspire others to create their own `Conan Plugins`.

## What can Conan.js do out-of-the-box?

### Deploy `AWS Lambdas`:

``` javascript
import conan from "Conan";

const conan = new Conan();

const lambdaName = "MyLambda";
const lambdaFilePath = "./path/to/myLambda.js";
const lambdaRoleName = "MyAWSIAMRoleName";

conan
	.lambda(lambdaName, lambdaFilePath, lambdaRoleName)
		.packages({
			"dovima": "^1.2.4"
		})

.deploy((error) => {
	if (error) { throw error; }
	console.log("Lambda deployment complete!");
});
```

### Deploy `AWS Gateway APIs` (with automatic `AWS Lambda` linking):

``` javascript
import conan from "Conan";

const conan = new Conan();

conan
	.api(apiName)
		.stage("production")
			.get("/myResource/{id}")
				// Automatically link our Lambda and resource method!
				.lambda("MyLambda")

.deploy((error) => {
	if (error) { throw error; }
	console.log("Lambda deployment complete!");
});
```

## What Else Can Conan.js Do?

### Help You Build Your Own Deployment System

Conan.js is a framework for rapid-development of your own deployment systems for practically any platform you can imagine.

#### Plugin Anatomy

A `Conan.js Plugin` should generally consists of at least three elements:

* **Plugin**
	* The plugin module's single responsibility is to alter the `conan` object according to your plugin specifications.

* **Components**
	* A component module is a model-like representation of a resource to be deployed.
	* Components have one or more parameters which can be set by the user of your deployment system.

* **Steps**
	* Steps are state-less functions that carry out single tasks for the deployment.
	* Each receives the results of all previous steps.
	* Steps can be inserted anywhere in the queue, so they don't have to be added in order.


1. One plugin module.
2. One or more component modules.
3. One or more step modules.

``` text
/plugin.js
/components/component.js
/steps/step.js
```

A conan plugin

**`./components/conanServer.js`**

``` javascript
import { ConanComponent } from "conan";
import logInStep from "./steps/logInStep.js";

export default class ConanServer extends ConanComponent {
	initialize(conan, ip, username, password) {
		this.conan = conan;

		// Auto-create chainable parameters
		this.parameters(
			"ip",
			"username",
			"password"
		);

		this
			.ip(ip)
			.username(username)
			.password(password);

		// Add a step to the step queue
		this.conan.steps.add(logInStep, this);
	}
}
```

**`./conanServerPlugin.js`**

``` javascript
import Model from "dovima";
import ConanServer from "./conanServer.js"
import privateData from "incognito";

export default class ConanServerPlugin {
	/**
	 * @constructor
	 * @param  {Conan} Every plugin constructor is passed the main conan object
	 * @return {ConanServerPlugin}
	 */
	constructor (conan) {
		const _ = privateData(this);

		_.conan = conan;

		// Extend conan with our component factory method
		_.conan.server = this.server;

		// Easily make dependent libraries available to all of your steps
		_.conan.steps.libraries({
			"Model": Model
		});
	}

	server(ip, username, password) {
		return new ConanServer(conan, ip, username, password);
	}
}
```

**Does Conan.js only work with Amazon Web Services?**

Conan.js is a generic plugin-based framework for developing `deployment systems` in general. The framework itself is not explicitly written for `AWS` compatibility; it just happened to be the platform we wanted to tackle first.


# Credit

* ASCII art by "VK" @ [RetroJunkie.com](http://www.retrojunkie.com/asciiart/cartchar/conan.htm)
