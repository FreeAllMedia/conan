![](../conan-logo.png)

# Custom Conan Plugins

Creating a Conan Plugin is very simple, involving just a few steps:

1. Create a Class
2. Create a Component
3. Create Steps for the Component
4. Publish with the conan-plugin keyword

## Step 1: Create a Class

Conan's plugin system is as simple as it gets. Start by creating a normal class with a constructor that accepts `conan` as its sole argument.

``` javascript
class CustomConanPlugin {
	constructor(conan) {
		this.conan = conan;
	}
}
```

## Step 2: Add a Conan Component

Conan components handle

## First Things To Know
