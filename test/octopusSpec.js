_8.t("test1", {
	construct:function() { 
		this._counter = 0; 
	},
	add:function() {
		this._counter++;
	},
	count:function() {
		return this._counter;
	}
});

var literal = {
	on:function() { return "on" },
	off:function() { return "off"}
}
_8.t("literal1", literal);


describe("Octopus.path", function() {
	it("Should create a object", function() {
		_8.path("test.mypackage", {someFunc:function() { return "works"}});
				
		expect(_8.path("test.mypackage").someFunc()).toEqual("works");
		expect(_8.path("test.mypackage")).toBeDefined();
		expect(_8.path("test.mypackage")).not.toBeNull();
		
		expect(_8.path("test")).toBeDefined();
		expect(_8.path("test")).not.toBeNull();
		
		expect(_8.path("test").mypackage).toBeDefined();
		expect(_8.path("test").mypackage).not.toBeNull();
		
		expect(_8._paths.test.mypackage).toBeDefined();
		expect(_8._paths.test.mypackage).not.toBeNull();
		expect(_8._paths.test.mypackage.someFunc()).toEqual("works");
	});
});

describe("Octopus.t and Octopus.hasT", function() {
	it("It should have traits", function() {
		expect(_8.hasT("test1")).toBeTruthy();
		expect(_8.hasT("literal1")).toBeTruthy();
		expect(_8.hasT("mangos")).toBeFalsy();
	});
});

describe("Octopus.spawn", function() {
	it("Trait list should except arrays and comma delimited strings", function() {
		var c1 = _8.spawn(["test1", "literal1"], {});
		var c2 = _8.spawn("test1 , literal1", {});
		
		expect(c1).not.toBeNull();
		expect(c1).toBeDefined();
		expect(_.isFunction(c1)).toBeTruthy();
		
		expect(c2).not.toBeNull();
		expect(c2).toBeDefined();
		expect(_.isFunction(c2)).toBeTruthy();
	});
	
	it("It should use the constructor provided", function() {		
		var c1 = _8.spawn(["test1", "literal"], {construct:function(a1, a2) {
			this.a1 = a1;
			this.a2 = a2;
		}});
		spyOn(c1.prototype, '_useConstructor').andCallThrough();
		
		var t = new c1("arg1", "arg2");

		
		expect(c1.prototype._useConstructor).toHaveBeenCalled();
		expect(c1.prototype._useConstructor).toHaveBeenCalledWith('arg1', 'arg2');
		expect(t.a1).toEqual("arg1");
		expect(t.a2).toEqual("arg2");
	});
	
	it("It should have correct traits", function() {
		var c1 = _8.spawn(["test1", "literal1"], {});
		var t = new c1("arg1", "arg2");
 
		var t2 = new c1();
		expect(t.hasT("test1")).toBeTruthy();
		expect(t.hasT("literal1")).toBeTruthy();
		expect(t.hasT("mangos")).toBeFalsy();
		
	});
	
	it("It should have trait abilitys", function() {
		var c1 = _8.spawn(["test1", "literal1"], {});
		var t = new c1("arg1", "arg2");
		var t2 = new c1();
		
		expect(t._counter).not.toBeNull();
		expect(t._counter).toBeDefined();
		expect(t._counter).toEqual(0);
		expect(t.count()).toEqual(0);
		
		t.add();
		expect(t.count()).toEqual(1);
		expect(t2.count()).toEqual(0);
		expect(t2.on()).toEqual("on");
	});
	
	it("Traits should be init when constructor is called", function() {		
		var c1 = _8.spawn(["test1", "literal"], {construct:function() {
			this.add();
		}});
		var t = new c1();
		expect(t.count()).toEqual(1);

	});
	
	it("It should should add methods in the spawn object", function() {		
		var c1 = _8.spawn("test1 ,literal", {
			doStuff:function() {
				return "stuff done"
			}
		}, function() {
			this.add();
		});
		var t = new c1();
		expect(t.doStuff()).toEqual("stuff done");

	});
	
});
describe("Octopus.spawnSingle", function() {
	
	it("should create an inited object", function() {
		var obj = {
				construct:function(config) {
					this.config = config;
					this.doThings();
				},
				doThings:function() {
					
				},
				getConfiged:function() {
					return this.config.isConfiged
				}
			};
			var config = {
				isConfiged:true
			}
			spyOn(obj, "construct").andCallThrough();
			spyOn(obj, "doThings");

			var initedObj = _8.spawnSingle("", obj, config);

			
			expect(initedObj).not.toBeNull();
			
			expect(initedObj.getConfiged()).toBeTruthy();
			expect(initedObj._useConstructor).toHaveBeenCalled();
			expect(initedObj.doThings).toHaveBeenCalled();
	});

});


describe("Octopus.go", function() {
	beforeEach(function() {
		 _8.path("test.go", {
			 someFunc:function() { return "works"}
		 });
	})
	
	
	
	it("it should inject a function", function() {
		var p = _8.path("test.go");
		
		spyOn(p, 'someFunc').andCallThrough();
		
		_8.go({"injectedFunc":"test.go.someFunc"}, function() {
			this.injectedFunc();

		});
		
		expect(p.someFunc).toHaveBeenCalled();
	});
	
	it("it should inject a path", function() {
		var p = _8.path("test.go");

		
		spyOn(p, 'someFunc').andCallThrough()
		
		_8.go({"injectedScope":"test.go"}, function() {
			this.injectedScope.someFunc();
		});
		
		expect(p.someFunc).toHaveBeenCalled()
	});
	
	it("path changes should remain after go", function() {
		var p = _8.path("test.go");
		
		_8.go({"injectedScope":"test.go"}, function() {
			this.injectedScope.newFunc = function() {
				return "new func";
			};
		});
		
		expect(_8.path("test.go").newFunc()).toEqual("new func");
	});
	
});

describe("Octopus.learn", function() {
	it("It should extend the octopus namespace", function() {
		_8.learn({
			return5:function() {return 5}
		})
		expect(Octopus.return5).toBeDefined();
		expect(Octopus.return5).not.toBeNull();
		expect(_.isFunction(Octopus.return5)).toBeTruthy();
		expect(_8.return5()).toEqual(5);
	});
});
