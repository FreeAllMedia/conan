/**
 * # Conan.js
 * 
 * ## Barbarically simple deployment with Node.js
 *
 * (A)synchronous code deployment library. Easily triggered via revision control systems such as Git, Mercurial, or Subversion with a built-in WebHook server.
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
 * # Version 0.0.0 DISCLAIMER:
 *
 * **This is not yet working software. This is an active project and example of documentation-driven design. This disclaimer will be removed upon the release of version 0.0.1. Until that time, please do not attempt to run version 0.0.0 of Conan.js.**
 * 
 * # Installation
 * 
 * First, ensure that you have [Node.js](http://nodejs.org/download/) and Conan.js installed on each machine that will interact with the deployer (both the machine that issues the deploy command, as well as the machines that the deployment will occur on):
 * 
 *     $ npm install conan -g
 *
 * # Running Tests
 *
 * You can run conan's test suite by running the following from the module directory:
 * 
 *     $ npm test
 *
 * # Examples
 *
 * **Synchronous Deployment Script:**
 *
 * ```javascript
 * var serverCredentials = [{
 *         hostname: 'server1.somehost.com',
 *         user: 'myuser',
 *         pem: '~/.ssh/keys/somekey.key'
 *     }],
 *
 *     gitCredentials = {
 *         host: 'https://github.com/somerepo.git',
 *         branch: 'master'
 *     },
 *
 *     appName = 'myApp',
 * 
 *     deploymentDirectory = '/var/node/' + appName,
 *
 *     currentDirectory = '/var/node/' + appName + '/current',
 *     releasesDirectory = '/var/node/' + appName + '/releases',
 *     sharedDirectory = '/var/node/' + appName + '/shared',
 *
 *     Conan = require('conan'),
 *         
 *     conan = new Conan({
 *         servers: serverCredentials
 *     });
 *
 * conan.logIn();
 *     
 * conan.makeDirectory(sharedDirectory);
 * conan.makeDirectory(releasesDirectory);
 * conan.makeDirectory(currentDirectory);
 *     
 * conan.changePermissions('/var/node/' + appName + '/*', {
 *     read: true,
 *     write: true,
 *     execute: true
 * });
 *
 * conan.gitLatest
 * 
 * conan.gitCloneRepo(gitCredentials.host, releasesDirectory);
 * ```
 *     
 * 
 * **Asynchronous Deployment Script:**
 *
 * ```javascript
 * var serverCredentials = [{
 *         hostname: 'server1.somehost.com',
 *         user: 'myuser',
 *         pem: '~/.ssh/keys/somekey.key'
 *     }],
 * 
 *     appName = 'myApp',
 * 
 *     deploymentDirectory = '/var/node/' + appName,
 *     
 *     deploymentSteps = [
 *         logIn,
 *         setupDirectories,
 *         setupPermissions,
 *         cloneCodeRelease,
 *         copyToCurrent,
 *         
 *     ],
 * 
 *     Conan = require('conan'),
 *     
 *     conan = new Conan({
 *         servers: serverCredentials
 *     });
 * 
 * conan.async.series(deploymentSteps, deploymentComplete);
 * 
 * function logIn(callback) {
 *     conan.login(loggedIn);
 *     function loggedIn(error, data) {
 *         if (error) { callback(error, data); }
 *         callback(null, data);
 *     }
 * }
 * 
 * function setupDirectories(callback) {
 *     var directories = [
 *         '/var/node/' + appName + '/current',
 *         '/var/node/' + appName + '/shared',
 *         '/var/node/' + appName + '/releases',
 *     ];
 * 
 *     conan.async.map(directories, conan.makeDirectory, callback);
 * }
 * 
 * function setupPermissions(callback) {
 *     conan.changePermissions('/var/node/' + appName + '/*', {
 *         read: true,
 *         write: true,
 *         execute: true
 *     }, callback);
 * }
 * 
 * function cloneCodeRelease(callback) {
 *     conan.cloneGitRepo()
 * }
 * 
 * function deploymentComplete(error, data) {
 *     conan.logOut();
 * }
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