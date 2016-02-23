#!/usr/bin/env node

var program = require('commander'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),

    Conan = require('../lib/conan.js'),
    deployer = new Conan(),
    deployerConfig = require('../package.json');

initialize(process.argv);

function initialize (args) {

    'use strict';

    program
        .command('update-readme')
        .description('Update README.md to reflect the latest documentation changes')
        .action(updateReadme);

    program
        .version(deployerConfig.version);

    program
        .parse(args);

    function updateReadme () {
        var dox = require('dox'),
            inputPath = path.join(__dirname, '../lib/conan.js'),
            outputPath = path.join(__dirname, '../README.md');

        fs.readFile(inputPath, 'utf8', fileReady);

        function fileReady(error, data) {
            if (error) { throw error; }

            var parsedData = dox.parseComments(data, {raw: true});

            fs.writeFile(outputPath, parsedData[0].description.full, 'utf8', readmeUpdated);

            function readmeUpdated(error, data) {

                if (error) { throw error; }

                console.log('README.md updated');
            }
            
        }

    }

}