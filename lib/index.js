'use strict';
var path = require('path');
var fs = require('fs');

function log(opts, output) {
  if ( opts.verbose ) {
    process.stdout.write(output);
  }
}

module.exports = function jsonToEnv(config) {
  var inputFile = config.input;
  var outputFile = config.output;

  if ( !/\.json/.test(inputFile) ) {
    return process.stdout.write('Requires json input file\n');
  }

  if ( !outputFile ) {
    return process.stdout.write('Requires output file\n');
  }

  var jsonFile = path.resolve(inputFile);
  var envFile = path.resolve(outputFile);
  log(config, 'Input file: ' + jsonFile + '\n');
  log(config, 'Output file: ' + envFile + '\n');

  var json = require(jsonFile);

  var stream = fs.createWriteStream(envFile);

  function camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, '\_$&');
  }

  for (var key in json) {
    if (typeof json[key] == 'string') {
      var exportString = 'export ' + camelToSnakeCase(key).toUpperCase() + '=' + json[key] + '\n';
      log(config, 'Writing: ' + exportString + '\n');
      stream.write(exportString);
    }
  }
  log(config, 'Done\n');
  // TODO: Close fd
  return;
};
