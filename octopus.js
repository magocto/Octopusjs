/*!
 * Octupus.js v0.1
 * A object composition and namespacing library
 * http://octopusjs.org
 *
 * Copyright (c) 2011 Jason "Magocto" Bennett
 * Octopus may be freely distributed under the MIT license.
 * 
 * Dependencies:
 * Underscore.js
 * http://documentcloud.github.com/underscore/
 * 
 * 
 * @author Jason Bennett
 * @function
 */
(function() {	
	var root = this;
	var oldOctopus = root.Octopus;
	
	
	/*
	 * @constructor 
	 * 
	 * @namespace Reference to Octopus, _8 is a shortcut
	 */
	
	var Octopus, _8;
	if (typeof exports !== 'undefined') {
		Octopus = _8 = exports
	} else {
		Octopus = root._8 = root.Octopus = {};
	}
	
	
	Octopus.VERSION = "0.1";

	Octopus._traits = {};


	/* @param {String} name
	 * @param {Object) proto
	 */
	Octopus.t =  function(name, proto) {
		if(!name) throw "Octopus.t Invalid name"
		if(!proto) return this._traits[id];
		var construct = proto.construct;
		delete proto.construct;
		this._traits[name] = new OctoTrait(proto, construct);		
	}
	
	// check to see if a trait has been added
	Octopus.hasT = function(name) {
		return (this._traits[name]);
	}
	Octopus._paths = {};
	
	// create object blueprint
	Octopus.spawn = function(traits, proto) {
		// create the a new base class each time so we can alter the prototype at will

		if(!proto) proto = {};
	 	
		var fn = this._getBaseObj(proto.construct);
	
		_.each( getTraitList(traits), function(id) {
			var t;
			if(t = Octopus._traits[id]) {
				fn.prototype._traits.push(id);
				if(t.init) fn.prototype._inits.push(t.init);
				_.extend(fn.prototype, t.proto);
			}  
		});
		delete proto.construct;
		_.extend(fn.prototype, proto);

		return fn;
	}
	Octopus._getBaseObj = function(construct) {
		var fn = function () {
			 var self = this;
	        _.each(this._inits, function(init) {
				init.apply(self);
	        });
	
			// fire the object constructor after all tentacles have been initialized
	        this._useConstructor.apply(this, arguments);
		}
		fn.prototype._traits = [];
		fn.prototype._inits = new Array();
		fn.prototype._useConstructor = (_.isFunction(construct)) ? construct : function() {};
		fn.prototype.hasT = function(name) {
			return _.indexOf(this._traits, name) != -1;
		}
		return fn;
	}
	
	// a package system
	Octopus.path = function(p, addon) {
		if(!_.isString(p)) throw "Octopus space path must be a String";
		return  Octopus._getPathObj(Octopus._paths, p.split("."), addon);
	}
	
	Octopus._getPathObj = function(parent, parts, addon) {
		
		var name = parts.shift();
		var	current = parent[name];

		// create a new package if the one we are looking for is not there
		if (!current) 
			parent[name] = current = {};
			
		// continue traversing if we are not at the bottom
		if(parts.length) 
			return Octopus._getPathObj(current, parts, addon);
			
		// at the last path extend if needed
		if (addon) 
			_.extend(current, addon);
			
		return current;
	}
	
	Octopus.noConflict =  function() {
		root.Octopus = root._8 = oldOctopus;
		return Octopus;
	}
	
	// extend the Octopus namespace
	Octopus.learn = function(ext) {
		_.each(_.functions(ext), function(name){
			Octopus[name] = ext[name];
	    });
	};
	
	// run a anynomous function
	Octopus.go = function(imports, action) {
		var scope = (function() {});
		_.each(imports, function(p, name) {
			scope[name] = Octopus.path(p);
		});
		if(_.isFunction(action)) action.apply(scope, Array.prototype.slice.call(arguments, 2))
	}
	
	// a little fly weight obj to hold traits
	var OctoTrait = function(proto, init) {
		this.proto = (!proto) ? {} : proto;
		this.init = init;
	}
	
	var getTraitList = function(traits) {
		if(_.isArray(traits)) return traits;
		if(_.isString(traits)) return _.map(traits.split(","), function(t) {return trim(t)});
		return [];
	} 
	
	var trim = function(str) {
		return str.replace(/^\s*([\S\s]*?)\s*$/, '$1');
	}

})();