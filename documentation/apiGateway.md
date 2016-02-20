![](../conan-logo.png)

## AWS API Gateway Plugin

### Overview

The Conan AWS Api Gateway Plugin provides a way to completely automate the creation and management of AWS API Gateways Objects with a intuitive, [express](https://github.com/strongloop/express)-like interface.

Additionally, it supports extremely simple automatic integration with AWS Lambda functions and other cool features like automatic CORS configuration, request & response mappings, and alias support.

### Configuration

In order for the Conan API Gateway Plugin to work, you will need to provide it with an AWS region to operate in.

The `ConanApiGatewayPlugin` module is currently located as a named export of the main `conan` module. The following example shows how to import and instantiate conan with the Conan Api Gateway Plugin:

``` javascript
import Conan, { ConanApiGatewayPlugin } from "conan";

const conan = new Conan({
	region: "us-east-1"
});

conan.use(ConanApiGatewayPlugin);
```

3. APIs
4. Stages
5. Routes
	1. Methods & Resources
  2. Lambda Integration
	  1. Aliases
	3. Request Parameter Mapping
	  1. Paths
	  2. Headers
	  3. Query Strings
	4. Response Mapping
	5. Status Codes
	6. Response Headers (CORS/Cross-Domain Support)
