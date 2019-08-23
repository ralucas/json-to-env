#!/usr/bin/env node

var jsonToEnv = require('./lib');
var pkg = require('./package.json');

var args = process.argv.slice(2);

var OPTIONS = {
  version: {
    commands: ['--version', '-V'],
    text: 'Returns the version',
    out: function() {
      process.stdout.write('Version: ' + pkg.version + '\n');
      process.exit(0);
    }
  },
  help: {
    commands: ['--help', '-h'],
    text: 'Returns how to use json-to-env',
    out: function() {
      return printUsage();
    }
  },
  verbose: {
    commands: ['--verbose', '-v'],
    text: 'Runs it in verbose'
  },
  key: {
    commands: ['--key', '-k'],
    text: 'Specify a key to be converted (can be an object or string)'
  }

};

function printUsage() {
  var options = OPTIONS;
  var usageString = 'Using json-to-env\n\n\t' +
    'json-to-env <inputfile.json> <outputfile.config> <options>\n\n';
  for (var key in options) {
    usageString += key + '\n\t' + 
      options[key].commands.join(', ') + '\n\t' +
      options[key].text + '\n';
  }
  process.stdout.write(usageString);
  process.exit(0);
}

function getOptions(optionArr, optionalCmds) {
  // Check for any options
  var options = OPTIONS;
  var opts = optionArr.filter(function(arg) {
    if ((/\=/).test(arg)) {
      arg = arg.split('=')[0];
    }
    return ~optionalCmds.indexOf(arg);
  }).map(function(o) {
    var obj = {};
    var value = '';
    if ((/\=/).test(o)) {
      value = o.split('=')[1];
      o = o.split('=')[0];
    }
    if ( o ) {
      for (var m in options) {
        if ( ~options[m].commands.indexOf(o) ) {
          obj[m] = options[m];
          if (value) {
            obj[m].value = value;
          }
          return obj;
        }
      } 
    }      
  });
  // Run any functions from options here and exit
  opts.forEach(function(cmd) {
    if ( cmd ) {
      for (var k in cmd) {
        if ( cmd[k].out) {
          cmd[k].out();
        }
      }
    }
  });

  return opts;
}

function getOptionsCommands(opts) {
  var optionalCmds = [];
  for (var k in opts) {
    optionalCmds = optionalCmds.concat(opts[k].commands);
  }

  return optionalCmds;
}

function parseArgs(args) {
  var out = {};

  var optCmds = getOptionsCommands(OPTIONS);

  if ( (/^[\-]/).test(args[0]) ) {
    process.stderr.write('Please put option arguments at the end\n' + printUsage());
  }

  out.input = args.shift();
  out.output = args.shift();

  opts = getOptions(args, optCmds);
  if ( opts.length ) {
    opts.forEach(function(opt) {
      var key = Object.keys(opt);
      out[key[0]] = opt[key[0]];
    });
  }
  return out; 
}
if ( !args.length ) {
  process.stdout.write(printUsage());
  return process.exit(0);
}

var config = parseArgs(args);

if (config.help) {
  process.stdout.write(printUsage());
  return process.exit(0);
}

if (config.version) {
  var pkg = require('package.json');
  process.stdout.write('json-to-env version: ' + pkg.version);
  return process.exit(0);
}

if (config.verbose) {
  process.stdout.write('Running verbose mode\nStarting...\n');
}

module.exports = jsonToEnv(config);


