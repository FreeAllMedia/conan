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

ASCII art by "VK" @ [RetroJunkie.com](http://www.retrojunkie.com/asciiart/cartchar/conan.htm)

# CONAN: The Deployer

Conan.js is a barbarically-simple solution for writing, testing, and deploying AWS Lambdas across multiple apis, stages, and regions.

If you don't like the way something in Conan.js works, you can easily use its plugin system to alter, extend, or remove whatever  functionality you like.

## Features

**Command-Line Component w/ Generator: (PHASE 2)**

* `deploy`

* `api.list`
* `api.create`
* `api.delete`

* `stage.list`
* `stage create`
* `stage delete`
* `resource list`
* `resource create`
* `resource delete`
* `method list`
* `method create`
* `method delete`

* `lambda list`
* `lambda create`
* `lambda delete`


**PHASE 3:**

* `conan key list`
* `conan key create`
* `conan key delete`
* `conan domain list`
* `conan domain create`
* `conan domain delete`
* `conan mapping list`
* `conan mapping create`
* `conan mapping delete`


**Simple ES5 & ES6 Library Integration: (PHASE 1)**

``` javascript
import Conan from "conan";

const conan = new Conan(configFromFile);
conan.deploy(callback);
```

**Plugin-based Architecture:**

  * All core features of Conan.js are made with the same plugin system that's available to you.
  * Easily extend Conan.js to support integration with any 3rd-party library.

**Simple and Highly Flexible Configuration System**

  * Many levels of control: project-level, resource-level, and lambda-level granularity.
  * Mix and match whatever works for you. One large file? No problem. Many smaller files? You got it.

**Non-Intrusive Design**

  * We don't want Conan.js to change your code, or ours. We just want it to deploy what we all write reliably.
  *

**Highly Tested**

## Getting Started

Conan.js manages three aspects of a Lambda-based application which we'll go over in this section:

1. Deployment and management of Lambda Functions
2. Deployment and management of Gateway APIs
3. Creation and management of associated IAM roles and permissions

### Deployment and Management of Lambda Functions

A lot goes into the deployment of an AWS Lambda function that may not be apparent when you first read about them:

* You'll need a way to package your code, plus all of its dependencies into a .zip file that you upload to S3.
* If any of your dependencies depend upon native libraries (Such as `mysql2`, or `phantomjs`), you will need to compile thier native code on AWS hardware for compatibility, then download the compiled versions of those dependencies and package them into your .zip file that is uploaded to S3. (Yes, really.)
* You have to name your files in such a way that you can easily roll back to a prior version in case bad code gets deployed accidentally.1

### Deployment and management of Gateway APIs

### Creation and management of associated IAM roles and permissions

##

``` javascript
import Conan from "conan";

import conanConfig from "./conan.json";
const conan = new Conan(conanConfig);

conan.
```
