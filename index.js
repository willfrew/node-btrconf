var path = require('path');
var isObject = require('lodash.isobject');
var defaultsDeep = require('lodash.defaultsdeep');

module.exports.load = function load(conf) {
  var nodeEnv = process.env.NODE_ENV || 'development';
  var raw = isObject(conf) ? conf : requireFile(conf);
  var base = raw.default || {};
  var envSpecific = raw[nodeEnv];
  if (typeof envSpecific === 'undefined') {
    return base;
  } else if (!isObject(envSpecific)) {
    return envSpecific;
  } else {
    return defaultsDeep(envSpecific, base);
  }
}

function requireFile(relFilename) {
  var directory = path.dirname(module.parent.filename);
  var absolutePath = path.resolve(directory, relFilename);
  return require(absolutePath);
}
