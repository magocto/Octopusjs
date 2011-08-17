Octopus.js
----------

octopus.js is a object composition library that allows you to create object classes with traits/mixins called tentacles. 
It is like a build your own class or object from the all-you-can-code functionality bar.

This creates a class definition that has events, a state-machine, has a view itself, holds other views, and is lockable.
The construct function will be called when our composite class is initialized after all the trait construct functions have been called.

'
	var BuildYourOwnClass = Octopus.spawn(["events", "stateMachine", "view", "viewContainer", "lockable"], {
		construct:function(locked, elementid) {
			this.state("Idle");
			this.setLocked(locked);
			this.view.setEl($("#"+elementid));
		},
		doSomeThisClassStuff:function() {
			if(!this.isLocked()) {
				// do some things
			}
		}
	}
	'

var byo = new BuildYourOwnClass(false, "someElementId");
byo.state("Running");
byo.doSomeThisClassStuff();

NOTE:
as of now all examples are stub code they will be replaced with examples from the jasmine-tests as they are added.



The _8 identifier is a short form to call Octopus.

	 var models = _8.path("myapp.models");
	 var EventTimer = _8.spawn(["events, timer"]);
	 
	 


Tentacles/Traits and Object Composition: 
----------------------------------------


Tentacles/Traits are the selections on the build your own functionality. They are traits/mixins that are the building blocks of a Octopus composite object. They are the tentacles of a Octopus.
The t function take a String id and a object containing the functions to be grafted onto the composite class's prototype. If a construct function (Optional) is defined it will be called when composite class is initialized before the class construct function is called.
	
In this example we have a library that can check out books to students, other libraries, so we want to create a borrower trait.

To create a tentacle for the borrowing functionality.

	Octopus.t("borrower", {
		construct:function() {
			
			this._checkedOut = [];
		},
		
		// all other functions are placed onto the composite objects prototype
		checkout:function(book) {
			this._checkedOut.push(book);
		}
	});
	
	
	Octopus.t("scheduled", {
		setSchedule:function(schedule) {
			this.schedule = schedule;
		}
	})
	

Create the Student composite class definition. You can pass the tentacle list as a comma delimited string or an array of strings.

	var Student = Octopus.spawn("borrower, scheduled, otherStudentTrait", {
		// this will be called after all traits have been initialized 
		construct:function(name, schedule) {
			console.log("create student "+id+" ");
			this.setSchedule(schedule);
			
			// all new students live in redthorn hall no matter what for some reason...
			this.moveIn("redthorn hall");
		},
		// adding student specific functions
		moveIn:function(dorm) {
			this.dorm = dorm;
		}
	});


Create a new student.

	var myStudent = new Student("jethro", {"biology":"104", "welding":"201"});


Adding Backbone Events as a tentacle.

	_8.t("events", Backbone.Events);
	
	var PostOffice = _8.spawn("events, goverment, employer");
	var hollowStation = new PostOffice("898739-872");
	hollowStation.bind("mail", function() {
		// do some mail reading stuff
	});


A simple state-machine tentacle.

	_8.t("stateMachine", {
		construct:function() {
			this._states = {};
			this._currentState = null;
		},
		state:function(id, state) {
			if(state) {
				this._createState(id, state.enter, state.exit);
				return;
			}
			if(this._states[id]) {
				if(this._currentState) 
					this._states[this.currentState].exit.call(this)
				this.currentState = id;
				this._states[id].enter.call(this);
			}
		},
		isState:function(state) {
			return this.currentState == state;
		},
		_createState:function(id, enter, exit) {
			if(!enter) enter = function() {};
			if(!exit) exit = function() {};
			this._states[id] = {enter:enter, exit:exit}
		}
	});
	
	
A color tentacle.	

	_8.t("color", {
		construct:function() {
			this.setColor("none");
		},
		setColor:function(clr) {
			this.color = clr;
		}
	});
	
A SignalLight composite class with color and stateMachine.

	var SignalLight = _8.spawn("stateMachine, color", {
		construct:function(initialState) {
			this.state("on", {enter:function() {
				this.setColor("green");
			}});
			this.state("off", {enter:function() {
				this.setColor("red");
			}});
			this.state(initialState);
		}
	});
	
	var corner1 = new SignalLight("off");
	signalLight.state("on");
	
	

Namespacing:
------------


You can defined create/get/append with Octopus.path. The first argument is the path as a dot-notation String. If the second argument is a object it will be appended to the path.

	Octopus.path("myapp.models", {
		_books:[];
		BookModel:function(title, author) {
			this.title = title;
			this.author = author;
		},
		addBook:function(title, author) {
			this._books.push(new this.Bookmodel(title, Author);
		}
	});

Somewhere else in your app.

	var models = Octopus.path("myapp.models");
	models.addBook("Smashed, Squashed, Splattered, Chewed, Chunked and Spewed", "Lance Carbuncle");






Dependency Injection:
---------------------


Using traits for dependency injection.

	var viewManager = new ViewManager();

	Octopus.t("viewEnabled", {
		construct:function() {
			this.viewManager = viewManager
		}
		render:function() {
			this.viewManager.addView(this);
		},
		remove:function() {
			this.viewManager.removeView(this);
		}
	});
	
Using Octopus.go takes two arguments. The fist is a object in the format of injectName:injectedPath. The second is the anonymous function we want our paths injected into.


	Octopus.go({
	
		// import a path
		"models":"com.testApp.models",
		
		// import a singleton object
		"view":"com.testApp.viewManager",
		
		// import a single function
		"getTime":"com.testApp.utils.getTime",
		
	}, function() {
		  var interaction = new this.models.InteractionModel(this.getTime());
		  this.viewManager.appendInteractionList(interaction);
		
	});

	



                                    
                                                                