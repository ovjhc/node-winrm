'use strict';

exports.factory = function (winRM, credential) {
  // instance recreated at each call of default, this is a factory not a singleton
  var instance = {};

  instance.payload = {
    host: winRM,
    credential: credential
  };

  instance.edge = require('edge');

  instance.psfunc = instance.edge.func({
    assemblyFile: 'C:\\Program Files\\WindowsPowerShell\\Modules\\Functor4PS\\lib\\Functor.Automation.dll',
    typeName: 'Functor.Automation.Startup',
    methodName: 'Invoke' // This must be Func<object,Task<object>>
  });

  instance.callps = function (script, payload, callback) {
    try {
      console.log("Winrm script follows");
      console.log(script);
      payload.script = script;
      instance.psfunc(payload, function (err, result) {
        console.log("Winrm result follows");
        console.log(result);
        callback(err, result);
      });
    } catch (err) {
      callback(err, null);
    }
  };

  instance.testps = function (cb) {
    instance.callps("'PowerShell test succeeded'", instance.payload, cb);
  };

  return instance;
};
