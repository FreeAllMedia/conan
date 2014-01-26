/**
 * # Version 0.0.0 DISCLAIMER:
 *
 * **This is an active project and example of documentation-driven design. Please do not attempt to use version 0.0.0 of Conan.js.**
 * 
 * # Conan.js The Deployer
 * 
 * ## Barbarically Simple Code Deployment With Node.js
 * 
 * ```
 *              __________                       .__
 *            .'  .v-._.- _____   _____   _____   ) \     _____   _____
 *           /  .(W--\| .'.---.'. |\./\   |\./|  / | \    |\ /\   |\ /|
 * __       |  /<M.   '/ / .-. \ \| |\ \  | | | / / \ \   | |\ \  | | |
 * \ b________/#@|\-----------\ \ \--\\ \-| | |----\ \ \-----\\ \-| | |-.
 *  >@)######(#( )#H>==========) ) )==\\ \| | |=====\ \ \=====\\ \  | |-->
 * /_p~~~~~~~~\#@|/-----------/ / /----\\ \ | |------\ \ \-----\\ \ | |-'
 *          |  \<M'   .\ \ '-' / /| | | \\  | | /     \ \ | | | \\  | |
 *           \  '(B--/| \ '---' / |/^\|  \'.| |/       \/'./ \|  \'.| |
 *            '.  '?_.-._'-----'  '---'   ) '.'.       '-------'  ) '.'.  
 *              '---------               '------' THE DEPLOYER  '------'
 *              
 * ```
 * ASCII art by "VK" @ [RetroJunkie.com](http://www.retrojunkie.com/asciiart/cartchar/conan.htm)
 *
 * ## Conan.js Is Different
 *
 * Conan.js is unique in that it does *not* issue shell commands directly, and instead opts to complete all instructions through native Node.js libraries. This approach allows Conan.js to take full advantage of Node's excellent cross-platform capabilities, providing maximum compatibility.
 *
 * ### How It Works:
 *
 * 1. The local conan client is provided with instructions and server credentials from a deploy.coffee or deploy.js file.
 * 2. The local conan client logs into each server asynchronously via ssh, then issues `conan server --port=<default=1984>` to start the remote conan server daemon.
 * 3. The local conan client connects to the newly-started remote conan server, then issues instructions to that are completed on the remote machine.
 * 4. When all instructions have completed, the `conan server` daemon shuts down and the ssh session is closed.
 *
 * **Note:** The port you designate the servers to be run on must be exposed directly by a firewall, or by a proxy server like Apache or Nginx.
 * 
 * # Installation
 * 
 * You must have [Node.js](http://nodejs.org/download/) and Conan.js installed on each machine that will interact with the deployer (both the machine that issues the deploy command, and each machine that the deployment will occur on):
 * 
 * ```shell
 * $ npm install conan -g
 * ```
 * 
 * # Running Tests
 *
 * You can run conan's test suite by running the following command from the module directory:
 *
 * ```shell
 * $ npm test
 * ```
 * 
 * # Using Conan.js
 *
 * ## Initiate Deploy
 * 
 * Start a deployment by passing the path of a Conan.js configuration script to either the command line interface, or the javascript constructor:
 *
 * **Command Line Interface:**
 * 
 * ```shell
 * $ conan /path/to/deploy.coffee
 * ```
 * **Conan.js Constructor**
 * 
 * ```javascript
 * var Conan = require('conan'),
 *     conan = new Conan('/path/to/deploy.coffee');
 *
 *     conan.deploy();
 * ```
 *
 * ## Configuration File
 * 
 * **deploy.coffee:**
 * 
 * ```coffee
 * appName = 'myApp'
 * appDirectory = '/var/node/' + appName + '/'
 * sharedDirectory = appDirectory + 'shared/'
 * releasesDirectory = appDirectory + 'releases/'
 * currentDirectory = appDirectory + 'current/'
 * 
 * servers(
 *     hostname: "server1.somehost.com"
 *     user: "myuser"
 *     agent: true
 *   ,
 *     hostname: "server2.somehost.com"
 *     user: "myuser"
 *     agent: true
 * )
 *   
 * .makeDirectory([
 *     sharedDirectory 
 *     releasesDirectory 
 *     currentDirectory
 * ])
 *   
 * .changePermissions(appDirectory + "*",
 *     read: true
 *     write: true
 *     execute: true
 * )
 * 
 * .gitClone('https://github.com/somerepo.git', 'master', currentReleaseDirectory)
 * 
 * .removeLink(currentDirectory)
 * 
 * .softLink(currentReleaseDirectory, currentDirectory)
 * ```
 *
 * @class Conan
 * @constructor Conan
 *
 * @summary Constructor for Conan.js The Deployer
 *
 * @param {Object}       [options]                         Instantiation options for Conan.js
 * @param {boolean}      [options.synchronous=false]       If set to true, all callbacks will be automatically wrapped to create pseudo-synchronous execution, thereby negating the need for more fancy methods of flow control, such as with built-in Async.js.
 * @param {Array}        [options.servers]                 An array of objects containing credentials for logging into the server.
 * @param {string}       [options.servers.Object.hostname] Hostname for the server that is to be logged into.
 * @param {string}       [options.servers.Object.user]     User name that should be used when logging in.
 * @param {string|Array} [options.servers.Object.pem]      Either a string containing the path to a pem key, or an array containing strings that contain paths to pem keys.
 */
module.exports = function Conan(options) {

    'use strict';

    /* Authentication Functions */

    /**
     * Log into remote server.
     *
     * @method  logIn
     * @param {Function(Object)} callback Standard Node.js-style callback, called when operation has completed.
     */
    function logIn(callback) {}

    /**
     * Log out of remote server.
     *
     * @method  logOut
     * @param {Function(Object)} callback Standard Node.js-style callback, called when operation has completed.
     */
    function logOut(callback) {}

    /* File System Functions */

    function softLink(fromPath, toPath, callback) {}

    /**
     * Hard link a file to another path on the filesystem. *Does not work with directories*.
     *
     * @method  hardLink
     * @param  {[type]}   fromPath [description]
     * @param  {[type]}   toPath   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function hardLink(fromPath, toPath, callback) {}

    /**
     * Remove a file or link from the filesystem.
     *
     * @method  remove
     * @param  {string}   path     path to the file or directory
     * @param  {Function(Object, Array)} callback Standard Node.js-style callback, called when operation has completed. Data returned is an array containing absolute paths to each file that was deleted. 
     */
    function remove(path, callback) {}

    /**
     * Remove a file or link from the filesystem recursively.
     *
     * **WARNING:** This function ALWAYS runs with **recursive** and **force** enabled.
     *
     * **NOTE:** An error will be raised if you attempt to pass "/" as the path.
     *
     * @method  removeRecursively
     * @param  {string}   path     path to the file or directory
     * @param  {Function(Object, Array)} callback Standard Node.js-style callback, called when operation has completed. Data returned is an array containing absolute paths to each file that was deleted. 
     */
    function removeRecursively(path, callback) {}

    /**
     * Make a blank file at the specified path
     *
     * @method  makeFile
     * @param  {string}   filePath
     * @param {Function(Object)} callback Standard error-only Node.js-style callback, called when operation has completed.
     *
     * @example
     *
     *     conan.makeFile('/var/node/current/file.txt', fileReady);
     *
     *     function fileReady(error) {
     *         if (error) { throw error; }
     *         // File was created.
     *     }
     */
    function makeFile(filePath, callback) {}

    /**
     * Change the working directory of the remote terminal.
     *
     * @method  changeWorkingDirectory
     * @param  {string}   directoryPath
     * @param {Function(Object, string)} callback Standard Node.js-style callback, called when operation has completed. Returns the new current working directory string as callback data.
     *
     * @example
     *
     * **Absolute Path:**
     * 
     *     conan.changeWorkingDirectory('/var/node/current', directoryChanged);
     *
     *     function directoryChanged(error, currentWorkingDirectory) {
     *         if (error) { throw error; }
     *         console.log(currentWorkingDirectory); // '/var/node/current/'
     *     }
     *
     * @example
     *
     * **Relative Path:**
     * 
     *     conan.changeWorkingDirectory('~/somedir', directoryChanged);
     *
     *     function directoryChanged(error, currentWorkingDirectory) {
     *         if (error) { throw error; }
     *         console.log(currentWorkingDirectory); // '/home/myuser/somedir/'
     *     }
     */
    function changeWorkingDirectory(directoryPath, callback) {}

    /**
     * Make a directory at a specified path, automatically creating all missing parent directories.
     *
     * @method  makeDirectory
     * @param  {string}   directoryPath
     * @param {Function(Object, Object)} callback Standard Node.js-style callback, called when operation has completed.
     */
    function makeDirectory(directoryPath, callback) {}

    /**
     * Set Owner, Group, and Other permissions for a file or directory.
     *
     * @method changePermissions
     * @param {string}   path     Path to the file or directory to change permissions on.
     * @param {Object}   options
     * @param {string}   [options.scope="all"] Must be 'all', 'group', 'owner', or 'other'. Defaults to 'all'.
     * @param {boolean}  options.read
     * @param {boolean}  options.write
     * @param {boolean}  options.execute
     * @param {Function(Object, Object)} callback Standard Node.js-style callback, called when operation has completed.
     */
    function changePermissions(path, options, callback) {}

    /**
     * Run a command on the remote server.
     *
     * @method command
     * @param {string}   commandString Command name and arguments, such as "git status", or "rake do-something --trace"
     * @param {Function(Object, Object)} callback Standard Node.js-style callback, called when operation has completed.
     */
    function command(commandString, callback) {}

};