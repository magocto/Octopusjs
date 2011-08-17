    )                                              
 ( /(           )                                  
 )\())       ( /(               (          (       
((_)\    (   )\()) (   `  )    ))\  (      )\  (   
  ((_)   )\ (_))/  )\  /(/(   /((_) )\    ((_) )\  
 / _ \  ((_)| |_  ((_)((_)_\ (_))( ((_)     ! ((_) 
| (_) |/ _| |  _|/ _ \| '_ \)| || |(_-< _  | |(_-< 
 \___/ \__|  \__|\___/| .__/  \_,_|/__/(_)_/ |/__/ 
                      |_|                |__/      
  

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

#================== NOTE ======================#
as of now all examples are stub code they will be replaced with examples from the jasmine-tests as they are added.



The _8 identifier is a short form to call Octopus.

	 var models = _8.path("myapp.models");
	 var EventTimer = _8.spawn(["events, timer"]);
	 
	 

*----------------------------------------------------------------------------------*
*  Tentacles/Traits and Object Composition:                                        *
*----------------------------------------------------------------------------------*


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
	
	

    
*----------------------------------------------------------------------------------*
*  Namespacing:                                                                    *
*----------------------------------------------------------------------------------*


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





*----------------------------------------------------------------------------------*
*  Dependency Injection:                                                           *
*----------------------------------------------------------------------------------*


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

	







====================================================================================
                                                                                
                                                                                
                                                   OOO8$ZZI.                    
                                                MOD8OZZ$O7Z7I.                  
                                              .OZZZZZZO77$OZ8Z.                 
                                              ZZOZZ$$Z$7$ZZ7O$D.                
                                            .OOZZZ7$ZO7I7$ZO7ZZ.                
                                            OO$Z$$$7??$$7$$Z$.=.                
                                I8++O$=.   .7=OZZI7O7$$$ZOO8OI?.                
                            .~I?7+:,OO+I$  OOO$7Z7$Z$O$ZZZDZ$7..                
                            ?:?~87N...$+:.DZ87$Z77+I=ZO8O$7ZZO..                
                           .D=,=8,.   .+?.ZO7$$$8ZZ$Z+7OOOI~=.                  
                           ~7?=8Z   7=+??$7$Z$ZO77$O$7$ZZ77I..                  
             ..            $+7O$O   .... .7$$$O$$N$7O7ZZ7+M.,:8~.O..            
           ~IIZ7$+.        .N?O7O8.     .ZZOZ$87ZOD$OZI?.,?$~+=~=+IZ            
         +I7IZODZO7,       .:$+?ZZN.  .8=OOOZ$OZODDD+,.$.=+O=~+788~~..          
        $777D.   .$I        ?IO$8IO$$7Z~I7I8Z$$$ON8??DD8+:7I$8ZDO++?+.          
        =I$$Z.   ..7?.      .+NDZ8I7Z+Z?Z$Z8ZOZ$$$,?NN8~:,OD88DI~$??~. .        
        ?77777,,   .O8..    .8OO8$$O$?I7$88IO?$8$78::D88I=IODOZOO+?,7$?.,..     
        .=IO7ZO$Z$$$787ZDOZOZDOOD$~$I7ZZD$,77+~$8IOOMNZ8D$D=8ZOZ?D.N$+I$,I=.    
         .=I?+I77OOOZ7$7I7+Z78O$~DZ?+O7ZZO87Z7==88$Z8N8OZ7OZ7OOZ. .I7,.?=7+.    
     .      ~M+$IIII+?77+$8$88$O7IOZOZ$D7$7$?+Z7I8DDODM8Z8$OZM.   .77..OII..    
        ..II..   ...,=MMOM$Z$$7Z8DN87$OO87Z7ID?7OZZZO?Z7N877M      +?OO=???.    
      .Z==~.:7           .MZ$NN.IZO=$I7I7I7$ODZI8$~Z8Z$OIZDNIM...N$88$I==I.     
    .+=~~?Z7I~     .....~,Z?$7D7?7~I?$IZ?I?~Z?7OI?8,$DZ$7$7IDZ7?$IIOIO:=~..     
   .D=,=8. I+.   ..I8ZO$ZI7O$77I$Z$$,7$$7Z7$:8ZOIIOI$777II8O$~7ZI77::I8Z.       
   D?~$8..?Z...DODOO77Z$D7Z$IOZD8$.ZI+$O88Z:7+Z77?7+DIZZ77I7ZO77.?~Z,.          
 ..?IZD~,?..O88DI=?:7OZ$8D$$$OOZ787O7Z8$ZZ$7Z?7?Z8?D$?I$$ZN7MM8M.               
 .8+:$88OZOZ$Z$$7Z~7$7??=IMMMM8OZO$?IDZ?7$$88877?+$Z7$7$$D.                     
 .7I~8D87ZIZZ$??=NI,.        ..M?87$O?D7I?MM~78O8$??OZ$O$O.                     
  .7~I=87+II+N~.          .N    M8?8I+$$?IM. MMOI?DOOI7Z?DOZ8Z$$Z$Z...          
   .O?:+$Z.                ?I.  .$,7II:78M.    MMMI78D$$$N?Z~7$I$II+O$..        
                           .:~.. M87$I?7?M.     .:MM:Z887IOD8....:M877DM.       
                           .+7.  .MZ77?D$M.         ZM$ZOI7ZOO$DDDM$?ZZ$.       
                           I,I.    7O$OZ7$.           M$?Z$8O77IZ?7+I7Z7.       
                         .:?=?     .8$+???.           .M=$ZZNI$$:7$I7$?~        
                         .,I??     .D87O$$.              ?O+I7$$OZOIOO.         
                         ..?,II.....8$~O$8.                 ..+MMMM.            
                         .+I,+$D$=O$7ZZ8I.                                      
                           =$:O+ZOI$?II.M                                       
                            ?8.,:I:I.ON~                                        
                              IM=$M~M+.                                         
                                                                