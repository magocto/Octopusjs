/* Octupus.js v0.1

An object composition and namespacing library

http://octopusjs.org (Comming soon)

Copyright (c) 2011 Jason "Magocto" Bennett

Octopus may be freely distributed under the MIT license.

Dependencies:
<a href="http://documentcloud.github.com/underscore/">Underscore.js</a>
*/
(function() {	
	var root = this;
	var oldOctopus = root.Octopus;
	
	
	// Base setup
	// --------------
	
	// Octopus namespace and _8 shortcut
	var Octopus, _8;
	
	// Export for either node or window
	if (typeof exports !== 'undefined') {
		Octopus = _8 = exports;
	} else {
		Octopus = root._8 = root.Octopus = {};
	}
	
	// version
	Octopus.VERSION = "0.1.0";

	// Tentacles/Traits
	// ----------
	// mixed in objects to provide multiple inheritance.
	
	// a holder tentacle/traits
	Octopus._traits = {};

	// a function to add an trait<br />params
	// 
	/* 
	 * name (String) a string identifier 
	 * proto (Object) a object literal to hold our functionality
	 */
	Octopus.t =  function(name, proto) {
		if(!name) { throw "Octopus.t Invalid name"; }
		if (!proto) { return this._traits[id];  }
		// if the tentacle has a construct function separate it to use when the main object constructor is called
		var construct = proto.construct;
		delete proto.construct;
		this._traits[name] = new OctoTrait(proto, construct);		
	};
	// check to see if a trait has been added<br /> params
	/* 
	 *  name (String) a string identifier
	 */
	Octopus.hasT = function(name) {
		return (this._traits[name]);
	};
	

	// Object Composition 
	// ----------
	// create object blueprint<br />params
	/*
	 * traits (String|Array[String]) a list of tentacles to add
	 * proto: (object) add on to the composite objects prototype. 
	 */
	// returns composite class definition
	Octopus.spawn = function(traits, proto) {
	
		if (!proto) { proto = {}; }
	 	
		// if the proto object has a construct function defined add it as our final constructor after all tentacle constructors have been called
		var fn = this._getBaseObj(proto.construct);
	
		_.each( getTraitList(traits), function(id) {
			var t = Octopus._traits[id];
			if(t) {
				fn.prototype._traits.push(id);
				if (t.init) { fn.prototype._inits.push(t.init); }
				_.extend(fn.prototype, t.proto);
			}  
		});
		
		// remove the construct function before the other methods are added to the composite objects prototype
		delete proto.construct;
		_.extend(fn.prototype, proto);
	
		// return the composite object blueprint
		return fn;
	};

	// create and initialize <br />params
	/* 
	 * traits (String) or (Array[String]) a list of tentacles to add
	 * proto: (Object) add on to the composite objects prototype. 
	 * config: (Object) pass config object to newly constructed object
	 */
	Octopus.spawnSingle = function(traits, proto, config) {
		var clz = Octopus.spawn(traits, proto);
		return new clz(config);
	};
	
	// create a new base class to graft traits on
	Octopus._getBaseObj = function(construct) {
		var fn = function () {
			 var self = this;
	        _.each(this._inits, function(init) {
				init.apply(self);
	        });
	
			// fire the object constructor after all tentacles have been initialized
	        this._useConstructor.apply(this, arguments);
		};
		fn.prototype._traits = [];
		fn.prototype._inits = [];
		fn.prototype._useConstructor = (_.isFunction(construct)) ? construct : function() {};
		fn.prototype.hasT = function(name) {
			return _.indexOf(this._traits, name) != -1;
		};
		return fn;
	};
	
	// Namespacing
	// ------------
	// a object to hold our namespaces
	Octopus._paths = {};
	//create, get, or append a namespace
	/* 
	 * p {String} a dot delimited path
	 * addon {Object} object to be added to path
	*/
	Octopus.path = function(p, addon) {
		if (!_.isString(p)) { throw "Octopus space path must be a String"; }
		return  Octopus._getPathObj(Octopus._paths, p.split("."), addon);
	};
	
	
	// recurse though namespace and get/create/append 
	Octopus._getPathObj = function(parent, parts, addon) {
		
		var name = parts.shift();
		var	current = parent[name];

		// create a new path object if needed
		if (!current) {
			parent[name] = current = {};
		}
			
		// continue traversing the path
		if (parts.length) {
			return Octopus._getPathObj(current, parts, addon);
		}
			
		// do any appending
		if (addon) {
			_.extend(current, addon);
		}
		  
		// always return an object	
		return current;
	};
	

	
	// Dependency Injection
	// --------
	// run a anonymous function with Octopus.paths imported into the function scope
	//
	/*
	 * imports (Object) a object in the form of importname:importpath
	 * action (Function) a function to run in injected scope
	 */
	Octopus.go = function(imports, action) {
		// create a empty function to hold scope
		var scope = (function() {});
		
		// attach all the import paths to the scope
		_.each(imports, function(p, name) {
			scope[name] = Octopus.path(p);
		});
		// run the anonymous function in the scope
		if (_.isFunction(action)) {
			action.apply(scope, Array.prototype.slice.call(arguments, 2));
		}
	};
	
	// Utils
	// ---------
	
	// a noCoflict so we can play nicely with other octopi
	Octopus.noConflict =  function() {
		root.Octopus = root._8 = oldOctopus;
		return Octopus;
	};
	
	// extend the Octopus namespace and add functionality to Octopus itself
	Octopus.learn = function(ext) {
		_.each(_.functions(ext), function(name){
			Octopus[name] = ext[name];
	    });
	};
	
	// Helpers
	// ---------
	
	// a little fly weight obj to hold traits
	var OctoTrait = function(proto, init) {
		this.proto = (!proto) ? {} : proto;
		this.init = init;
	};
	
	// returns an array of trait ids from either a comma delimited string or an array of strings
	var getTraitList = function(traits) {
		if (_.isArray(traits)) {
			return traits;
		}
		if (_.isString(traits)) {
			return _.map(traits.split(","), function(t){
				return trim(t);
			});
		}
		return [];
	};
	
	// string trim
	var trim = function(str) {
		return str.replace(/^\s*([\S\s]*?)\s*$/, '$1');
	};

})();