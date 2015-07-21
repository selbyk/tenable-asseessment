"use strict";
/** A class the handles mapping and finding routes to handle exchanges between client and server
 * @class Maxim
 */
{
  let MaximSingleton = null;
  let _properties = new WeakMap();
  const logLevels = ['silent', 'error', 'debug', 'info', 'all'];
  const maximSpecial = Symbol();

  var Maxim = class Maxim {
    constructor() {
      if (MaximSingleton !== null) {
        console.log('Nope, nope, nope!  Maxim is a singleton.');
        console.log('Try: `let logger = Maxim.instance` instead.');
        console.log('Thanks for using my code, though. <3');
        throw new Error('Attempting to construct Singleton with a preexisting instance');
      } else {
        let privateProperties = {
          instance: this,
          logLevel: 'error',
          logLevelEnum: 1,
          logLevelDefault: 'error'
        };
        _properties.set(this, privateProperties);
        MaximSingleton = this;
      }
    }

    static instance() {
      if (MaximSingleton === null) {
        return new Maxim();
      } else {
        return MaximSingleton;
      }
    }

    get logLevelEnum() {
      return _properties.get(MaximSingleton).logLevelEnum;
    }

    get logLevel() {
      return _properties.get(MaximSingleton).logLevel;
    }

    set logLevel(level) {
      console.log('Setting logLevel to: ', level);
      let enumTest = logLevels.indexOf(level);
      if (enumTest === -1) {
        console.log('Invalid log level, using default instead');
        level = _properties.get(MaximSingleton).logLevelDefault;
        enumTest = 1;
      }
      _properties.get(MaximSingleton).logLevel = level;
      _properties.get(MaximSingleton).logLevelEnum = enumTest;
    }

    static thingToArray(thing) {
      let arr = [];
      var type = typeof thing;
      if(type === "object" && !Array.isArray(thing) && thing.hasOwnProperty(0)){
        for(var key in Object.keys(thing)){
          arr.push(thing[key]);
        }
      } else if (Array.isArray(thing)){
        for(var value in thing){
          arr.push(value);
        }
      } else {
        arr.push(thing);
      }
      return arr;
    }

    log( /**/ ) {
      let levelEnum = this.logLevelEnum; // Speed up getting level
      if(levelEnum === 0) { // they want it silent, lets do it quick
        return;
      }
      if (arguments.length > 0) {
        let args, printTest;
        if(arguments[0] === maximSpecial){
          printTest = arguments[1];
          args = arguments[2];
        } else {
          args = Maxim.thingToArray(arguments);//Object.keys(arguments).map(i => [JSON.stringify(arguments[i])]);
          printTest = args.length > 0 ? logLevels.indexOf(args[0]) : -1;
          if (printTest !== -1) {
            args[0] = args[0].toUpperCase() + ': ';
          }
        }
        if (printTest <= levelEnum) {
          console.log.apply(console, args);
        }
      }
    }

    error( /**/ ) {
      let args = Maxim.thingToArray(arguments);
      args.unshift('ERROR: ');
      this.log(maximSpecial, 1, args);
    }

    debug( /**/ ) {
      let args = Maxim.thingToArray(arguments);
      args.unshift('DEBUG: ');
      this.log(maximSpecial, 2, args);
    }

    info( /**/ ) {
      let args = Maxim.thingToArray(arguments);
      args.unshift('INFO: ')
      //console.log(args);
      this.log(maximSpecial, 3, args);
    }
  };
}

module.exports = Maxim.instance();
