# Version 0.0.0 DISCLAIMER:

**This is an active project and example of documentation-driven design. Please do not attempt to use version 0.0.0 of Conan.js.**

# Conan.js The Deployer

## Barbarically Simple Deployment With Node.js

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

## How Conan.js Is Different:

Conan.js does *not* issue shell commands directly, and instead opts to complete all instructions through native Node.js libraries. This approach allows Conan.js to take full advantage of Node's excellent cross-platform capabilities, providing maximum compatibility.

### How It Works:

1. The local conan client is provided with instructions and server credentials from a deploy.coffee or deploy.js file.
2. The local conan client logs into each server asynchronously via ssh, then issues `conan server --port=<default=1984>` to start a remote conan server daemon on the specified port.
3. The local conan client securely connects to the newly-started remote conan server, then issues instructions that are completed on the remote machines, using Node.js libraries, asynchronously of one another.
4. When all instructions have completed, the `conan server` daemon shuts down so no further clients can connect, then the ssh session is closed.

**Note:** The port you designate the servers to be run on must be exposed directly by a firewall, or by a proxy server like Apache or Nginx.

# Installation

You must have [Node.js](http://nodejs.org/download/) and Conan.js installed on each machine that will interact with the deployer (both the machine that issues the deploy command, and each machine that the deployment will occur on):

```shell
$ npm install conan -g
```

# Running Tests

You can run conan's test suite by running the following command from the module directory:

```shell
$ npm test
```

# Using Conan.js

## Initiate Deploy

Start a deployment by passing the path of a Conan.js configuration script to either the command line interface, or the javascript constructor:

**Command Line Interface:**

```shell
$ conan /path/to/deploy.coffee
```
**Javascript Interface**

```javascript
var Conan = require('conan'),
    conan = new Conan('/path/to/deploy.coffee');

    conan.deploy();
```

## Configuration File

**setup.coffee:**

```coffee
appName = 'myApp'

appDirectory = '/var/node/' + appName + '/'

sharedDirectory = appDirectory + 'shared/'
releasesDirectory = appDirectory + 'releases/'
currentDirectory = appDirectory + 'current/'

conan.servers(
    hostname: "server1.somehost.com"
    user: "myuser"
    agent: true
  ,
    hostname: "server2.somehost.com"
    user: "myuser"
    agent: true
)
  
.makeDirectory([
    sharedDirectory 
    releasesDirectory 
    currentDirectory
])
  
.changePermissions(appDirectory + "*",
    read: true
    write: true
    execute: true
)

```

**deploy.coffee:**

```coffee
appName = 'myApp'

gitHost = 'https://github.com/somerepo.git'
gitBranch = 'master'

appDirectory = '/var/node/' + appName + '/'

sharedDirectory = appDirectory + 'shared/'
releasesDirectory = appDirectory + 'releases/'
currentDirectory = appDirectory + 'current/'

credentialsDirectory = sharedDirectory + 'credentials/'

# Using Moment.js to format a directory name for the release
currentReleaseDirectory = releasesDirectory + moment().format('YYYYMMDDHHmmss')

configDirectory = currentReleaseDirectory + 'config/'

conan.servers(
    hostname: "server1.somehost.com"
    user: "myuser"
    agent: true
  ,
    hostname: "server2.somehost.com"
    user: "myuser"
    agent: true
)

.gitClone(gitHost, gitBranch, currentReleaseDirectory)

.softLink(credentialsDirectory + '*', configDirectory)

.removeLink(currentDirectory)

.softLink(currentReleaseDirectory, currentDirectory)

.restartApache()
```

