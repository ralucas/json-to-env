'use strict';
var path = require('path');
var fs = require('fs');

function log(opts, output) {
  if ( opts.verbose ) {
    process.stdout.write(output);
  }
}

function isCamelCase(str) {
  return !!str.match(/^[a-z]+[A-Z]/)
}

function camelToSnakeCase(str) {
  if ( isCamelCase(str) ) {
    return str.replace(/[A-Z]/g, '\_$&');
  }
  return str;
}

function build(obj, key, writableStream, config) {
  if (typeof obj == 'string') {
    var exportString = 'export ' + camelToSnakeCase(key).toUpperCase() + '="' + obj + '"\n';
    log(config, 'Writing: ' + exportString + '\n');
    writableStream.write(exportString);
  } else {
    for (var k in obj) {
      if (typeof obj[k] == 'string') {
        var prefix = key ? key.toUpperCase() + '_' : '';
        var exportString = 'export ' + prefix + camelToSnakeCase(k).toUpperCase() + '="' + obj[k] + '"\n';
        log(config, 'Writing: ' + exportString + '\n');
        writableStream.write(exportString);
      } else if ( typeof obj[k] == 'object' ) {
        build(obj[k], k, writableStream, config);
      }
    }
  }
}

module.exports = function jsonToEnv(config) {
  var inputFile = config.input;
  var outputFile = config.output;

  var optionKey = config.key ? config.key.value : null; 

  if ( !(/\.json/).test(inputFile) ) {
    return process.stdout.write('Requires json input file\n');
  }

  if ( !outputFile ) {
    return process.stdout.write('Requires output file\n');
  }

  var jsonFile = path.resolve(inputFile);
  var envFile = path.resolve(outputFile);
  log(config, 'Input file: ' + jsonFile + '\n');
  log(config, 'Output file: ' + envFile + '\n');

  // TODO: Validate json file first
  var json = require(jsonFile);

  var inputObj = optionKey ? json[optionKey] : json;

  var stream = fs.createWriteStream(envFile);

  build(inputObj, optionKey, stream, config);

  log(config, 'Done\n');
  // TODO: Close fd
  return;
};
