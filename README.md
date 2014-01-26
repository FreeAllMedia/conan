# Conan.js

## Barbarically simple asynchronous code deployment with Node.js

Asynchronous code deployment library. Easily triggered via revision control systems such as Git, Mercurial, or Subversion with a built-in WebHook server.

```text
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

# Version 0.0.0 DISCLAIMER:

**This is not yet working software. This is an active project and example of documentation-driven design. This disclaimer will be removed upon the release of version 0.0.1. Until that time, please do not attempt to run version 0.0.0 of Conan.js.

# Installation

First, ensure that you have [Node.js](http://nodejs.org/download/) and Conan.js installed on each machine that will interact with the deployer (both the machine that issues the deploy command, as well as the machines that the deployment will occur on):

    $ npm install conan -g

# Running Tests

You can run conan's test suite by running the following from the module directory:

    $ npm test

# Examples

~~Barbaric~~ **Synchronous Deployment Script:**

    var serverCredentials = [{
            hostname: 'server1.somehost.com',
            user: 'myuser',
            pem: '~/.ssh/keys/somekey.key'
        }],

        gitCredentials = {
            host: 'https://github.com/somerepo.git',
            branch: 'master'
        },

        appName = 'myApp',

        deploymentDirectory = '/var/node/' + appName,

        currentDirectory = '/var/node/' + appName + '/current',
        releasesDirectory = '/var/node/' + appName + '/releases',
        sharedDirectory = '/var/node/' + appName + '/shared',

        Conan = require('conan'),
        
        conan = new Conan({
            synchronous: true,
            servers: serverCredentials
        });

    conan.logIn();
    
    conan.makeDirectory(sharedDirectory);
    conan.makeDirectory(releasesDirectory);
    conan.makeDirectory(currentDirectory);
    
    conan.changePermissions('/var/node/' + appName + '/*', {
        read: true,
        write: true,
        execute: true
    });

    conan.gitLatest

    conan.gitCloneRepo(gitCredentials.host, releasesDirectory);

    

**Asynchronous Deployment Script:**

    var serverCredentials = [{
            hostname: 'server1.somehost.com',
            user: 'myuser',
            pem: '~/.ssh/keys/somekey.key'
        }],

        appName = 'myApp',

        deploymentDirectory = '/var/node/' + appName,
        
        deploymentSteps = [
            logIn,
            setupDirectories,
            setupPermissions,
            cloneCodeRelease,
            copyToCurrent,
            
        ],

        Conan = require('conan'),
        
        conan = new Conan({
            servers: serverCredentials
        });

    conan.async.series(deploymentSteps, deploymentComplete);

    function logIn(callback) {
        conan.login(loggedIn);
        function loggedIn(error, data) {
            if (error) { callback(error, data); }
            callback(null, data);
        }
    }

    function setupDirectories(callback) {
        var directories = [
            '/var/node/' + appName + '/current',
            '/var/node/' + appName + '/shared',
            '/var/node/' + appName + '/releases',
        ];

        conan.async.map(directories, conan.makeDirectory, callback);
    }

    function setupPermissions(callback) {
        conan.changePermissions('/var/node/' + appName + '/*', {
            read: true,
            write: true,
            execute: true
        }, callback);
    }

    function cloneCodeRelease(callback) {
        conan.cloneGitRepo()
    }

    function deploymentComplete(error, data) {
        conan.logOut();
    }
