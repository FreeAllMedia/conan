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

## Design The Plugin's API

The first step to making a great plugin is to design the API for it. This gives you an idea of what the finished product will look like, and which components / properties you'll need.

*In this guide*, we'll design and develop a plugin for moving multiple local files to multiple remote servers, so the `pseudo.js` file we'll use to guide us looks like this:

``` javascript
// pseudo.js

new Conan().use(MyPlugin)

.server("127.0.0.1")
	.username("bob")
	.password("12345")
	.directory("~/my-server/")

.server("127.0.0.2")
	.username("bob")
	.password("12345")
	.directory("~/my-server/")

.base("./some/dir/")

.file("util/something.js")

.files("bin/**/*")
.files("lib/**/*")

.deploy(error => {
	if (error) { throw error; }
	// All done. No return data.
});
```

**Note:** Use your imagination! This is just one way conan can be utilized to break down a complex task into a portable container!

## Defining Components

From the `pseudo.js` file, we see that a `server` and `file` component are needed, each with their respective `properties`. We also need a `fileCollection` component to find multiple `files` by glob string.

The idea is to ensure that every `component`, `property`, and `step` has a single responsibility so that they remain small and managable units of code. By that logic, we can break out each component in our example with it's properties in a list like this:

* **deployer**
	* **base**: string
* **server**
	* **hostname**: string
	* **username**: string
	* **password**: string
	* **directory**: string
* **file**
	* **path**: string
	* **content**: string
	* **name**: string
	* **base**: string
* **fileCollection**
	* **glob**: string
	* **base**: string
	* **files**: array of files

### Component Files

* It's a good idea to have one file per component, though multiple components in a single file *will* work if you import them by name.
* You can put your component files into any directory, but in this example we'll use a directory named `components`.

#### components/server.js

``` javascript
import { Component } from "conan";

export default class Server extends Component {
	initialize() {
		
	}
}
```
