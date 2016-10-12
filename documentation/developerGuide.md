![](../conan-logo.png)

# Developer Guide

Conan is a generic system that helps break down complex tasks into managable `components`, `properties`, and `steps`, then package them into a portable `plugin` with an easy-to-use chained interface.

## Terminology

* **components**
	* Classes that extend `{ Component } from "conan"`.
	* Represent items that the deployer will need to work with.
	* Can contain sub-components for compound items.
* **properties**
	* Each component has zero or more properties.
	* Properties can be strings, booleans, arrays, objects, integers, and more.
* **steps**
	* Small functions that perform a single action (usually upon or with `components` and their `properties`).
	* Can be scheduled automatically by `components` or the `deployer`.
* **plugin**
	* Defines the interface for the deployer and contains all `components`, `properties`, and `steps` for the deployment.
	* Portable. Can be used multiple times or stubbed into a new object that automatically `.use`

**Additional Terminology:**

* **pseudo.js**
	* An optional file that serves only as a notepad to jot down API ideas for the plugin.
	* None of the code in this file is ever intended to be executed.
	* It's not required or used in any way other than as a guide for the developer.
	* Feel free to skip making a `pseudo.js` if you don't think it's useful.

## Design The Plugin's API

The first step to making a great plugin is to design the API for it. This gives you an idea of what the finished product will look like, and which components / properties you'll need.

*In this guide*, we'll design and develop a plugin for moving multiple local files to multiple remote servers, so the `pseudo.js` file we'll use to guide us looks like this:

``` javascript
// pseudo.js

const myDeployer = new Conan().use(MyPlugin);

myDeployer

.server("127.0.0.1")
	.username("bob")
	.password("12345")
	.directory("~/my-server/") // deployment directory

.server("127.0.0.2")
	.username("bob")
	.password("12345")
	.directory("~/my-server/") // deployment directory

.base("./some/dir/") // local base directory, default to process.cwd()

.file("util/something.js") // single file in base directory

.files("bin/**/*") // multiple files by glob path

.deploy(error => {
	if (error) { throw error; }
	// All done. No return data.
});
```

**Note:** Use your imagination! This is just one way conan can be utilized to break down a complex task into a portable container!

## Create The Plugin File

The plugin file's single responsibility is to define the top-level interface of the deployer.

Here's an example of a bare-bones **plugin.js**:

``` javascript
export default class MyPlugin {
	constructor(deployer) {
		// Here is where you customize the deployer's interface
		// using `.properties` and `.component`
	}
}
```

The next step is to define `properties` and `components` on the deployer.

## List Out Components & Properties

So, which `properties` and `components` get defined where? That's what we want to answer next.

From the `pseudo.js` file, we see that a `server` and `file` component are needed. We can also infer that we'll need a `fileCollection` component to find multiple `files` by glob string.

Each have with their respective `properties`, along with the deployer itself that has a single `base` property.

``` markdown
* deployer
	* base: string
* server
	* hostname: string
	* username: string
	* password: string
	* directory: string
* file
	* path: string
	* content: string
	* name: string
	* base: string
* fileCollection
	* glob: string
	* base: string
	* files: array of files
```

### Component Files

* It's a good idea to have one file per component, though multiple components in a single file *will* work if you import them by name.
* You can put your component files into any directory, but in this example we'll use a directory named `components`.

#### components/server.js

``` javascript
import { Component } from "conan";

export default class Server extends Component {
	initialize() {
		ss
	}
}
```
