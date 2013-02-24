Questions = new Meteor.Collection("questions");
EC_score = new Meteor.Collection("ec_score");
FB_score = new Meteor.Collection("fb_score");
Incontrol = new Meteor.Collection("incontrol");

if (Meteor.isClient) {
  Meteor.Router.add({
    '/': 'bigboard',
    '/bigboard': 'bigboard',

    '/admin': 'admin',

/*
    '/posts/:id': function(id) {
      Session.set('postId', id);
      return 'post';
    }
*/
  });

  Template.bigboard.answers = function () {
//    console.log(Questions.find({}, {answers: {sort: {score: -1, text: 1}}}));
//    console.log(Questions.find({}, {sort: {score: -1, text: 1}}));
//    return Questions.find({question:"What is an indispensible tool?"}, {sort: {'answers.score': -1, 'answers.text': 1}});
    var current = Incontrol.find({}, {currentanswer:1});
    var currentnumber = '';
    current.forEach(function (bullshit) {
      currentnumber = bullshit.currentanswer;
    });
    var pie= Questions.find({number: currentnumber}, {answers: 1});
    var cake = '';
    // OMG why
    pie.forEach(function (answer) {
      cake = answer.answers;
    });
    console.log(cake);
    return cake;
  };

  Template.bigboard.current_question = function () {
    var current = Incontrol.find({}, {currentanswer:1});
    var currentnumber = '';
    var cake='';
    current.forEach(function (bullshit) {
      currentnumber = bullshit.currentanswer;
    });
    console.log("current number", currentnumber);
    var pie= Questions.find({number: currentnumber});
    pie.forEach(function (set) {
      console.log("current", set.question);
      cake = set.question;
    });
    return cake;
  };

  Template.bigboard.edgecast_points = function () {
    var score = EC_score.find({}, {score: 1});
    var teamscore;
    score.forEach(function (set) {
      teamscore = set.score;
    });
    console.log("ec score",teamscore);
    return teamscore;
  };
  
  Template.bigboard.facebook_points = function () {
    var score = FB_score.find({}, {score: 1});
    var teamscore;
    score.forEach(function (set) {
      teamscore = set.score;
    });
    console.log("ec score",teamscore);
    return teamscore;
  };

  Template.bigboard.who_is_incontrol = function () {
    var incontrolset = Incontrol.find({});
    var incontrol;
    incontrolset.forEach(function (set) {
      incontrol = set.incontrol;
    });
    return incontrol;
  }

  Template.admin.answers = function () {
//    console.log(Questions.find({}, {answers: {sort: {score: -1, text: 1}}}));
//    console.log(Questions.find({}, {sort: {score: -1, text: 1}}));
    var current = Incontrol.find({}, {currentanswer:1});
    var currentnumber = '';
    current.forEach(function (bullshit) {
      currentnumber = bullshit.currentanswer;
    });
    var pie= Questions.find({number: currentnumber}, {answers: 1});
    var cake = '';
    // OMG why
    pie.forEach(function (answer) {
      cake = answer.answers;
    });
    console.log(cake);
    return cake;
  };

  Template.admin.selected_answer = function () {
    return Session.get("display_answer");
  };

  Template.bigboard.question_points = function () {
    var current = Incontrol.find({}, {currentanswer:1});
    var currentnumber = '';
    current.forEach(function (bullshit) {
      currentnumber = bullshit.currentanswer;
    });
    var answerset= Questions.find({number: currentnumber}, {answers: 1});
    //var answerset = Questions.find({question:"What is an indispensible tool?"}, {answers: 1}); 
    var tscore = 0;
    answerset.forEach(function (set) {
      set.answers.forEach (function (answer) {
        if (answer.display == 'yes') {
	  tscore += answer.score;
        }
      });
    });
    //if (tscore > 0) {
      //Incontrol.insert({currentpoints: tscore});
    //}
    return tscore;
  };

  Template.admin.selected = function () {
//    console.log("display_answer", this.text);
    return Session.equals("display_answer", this.text) ? "selected" : '';
  };

  Template.admin.events({
    'click input.display': function () {
      var id;
      var current = Incontrol.find({}, {currentanswer:1});
      var currentnumber = '';
      current.forEach(function (bullshit) {
        currentnumber = bullshit.currentanswer;
      });
      Questions.find({number: currentnumber}).forEach( function (set) {
	id = set._id;
	set.answers.forEach( function (answer) {
	  if (answer.text == Session.get("display_answer")) {
	    answer.display = "yes";
	  }
	});
        Questions.update(id, set);
      });
      console.log("i got here");
    }
  });
  Template.admin.events({
    'click input.edgecast_incontrol': function () {
      var current = Incontrol.find({});
      var currentnumber = '';
      var myid='';
      current.forEach(function (bullshit) {
        myid=bullshit._id;
	bullshit.incontrol="EdgeCast";
        Incontrol.update( myid, bullshit);
      });
    }
  });
  Template.admin.events({
    'click input.facebook_incontrol': function () {
      var current = Incontrol.find({});
      var currentnumber = '';
      current.forEach(function (bullshit) {
        myid=bullshit._id;
	bullshit.incontrol="Facebook";
        Incontrol.update( myid, bullshit);
      });
    }
  });

  Template.admin.events({
    'click input.edgecast_getspoints': function () {
      var oldscore = EC_score.find({}, {score: 1});
      var points;
      var score;
      var current = Incontrol.find({}, {currentanswer:1});
      var currentnumber = '';
      current.forEach(function (bullshit) {
        currentnumber = bullshit.currentanswer;
      });
      var answerset = Questions.find({number: currentnumber}, {answers: 1}); 
      var tscore = 0;
      answerset.forEach(function (set) {
        set.answers.forEach (function (answer) {
          if (answer.display == 'yes') {
	    tscore += answer.score;
          }
        });
      });
      oldscore.forEach(function (teamset) {
        score = teamset.score;
      });
      score += tscore;
      EC_score.insert({ score: score });
    }
  });
  Template.admin.events({
    'click input.facebook_getspoints': function () {
      var oldscore = FB_score.find({}, {score: 1});
      var points;
      var score;
      var current = Incontrol.find({}, {currentanswer:1});
      var currentnumber = '';
      current.forEach(function (bullshit) {
        currentnumber = bullshit.currentanswer;
      });
      var answerset = Questions.find({number: currentnumber}, {answers: 1}); 
      var tscore = 0;
      answerset.forEach(function (set) {
        set.answers.forEach (function (answer) {
          if (answer.display == 'yes') {
	    tscore += answer.score;
          }
        });
      });
      oldscore.forEach(function (teamset) {
        score = teamset.score;
      });
      score += tscore;
      FB_score.insert({ score: score });
    }
  });
 
  Template.admin.events({
      'click input.next_question': function() {
      var current = Incontrol.find({});
      var currentid = '';
      current.forEach(function (bullshit) {
        bullshit.currentanswer += 1;
	bullshit.currentpoints = 0;
	bullshit.incontrol = '';
	id = bullshit._id;
        Incontrol.update(id, bullshit);
      });
      }
  });
  Template.admin.events({
    'click': function () {
      Session.set("display_answer", this.text);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("i got here");
    console.log(Questions.find().count());
    if (Incontrol.find().count() == 0) {
      Incontrol.insert({ currentanswer: 1, wrong: 0, currentpoints: 0});
    }
    if (EC_score.find().count() == 0) {
      EC_score.insert({ score: 0, wrong: 0});
    }
    if (FB_score.find().count() == 0) {
      FB_score.insert({ score: 0, wrong: 0});
    }
    if (Questions.find().count() == 0) {
      Questions.insert(
	{
	  question: "Name an indispensible UNIX utility",
	  number: 1,
	  answers: [
		    {
		      text: "grep",
		      score: 13,
		      display: "no"
		    },
		    { 
		      text: "ls",
		      score: 5,
		      display: "no"
		    },
		    {
		      text: "awk",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "lsof",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "ssh",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "strace",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "vi/vim",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "less",
		      score: 2,
		      display: "no"
		    },
		    {
		      text: "netcat",
		      score: 2,
		      display: "no"
		    },
		    {
		      text: "rm -rf",
		      score: 2,
		      display: "no"
		    }
	  ]	    
	});
      Questions.insert(
	{
	  question: "Name something that wakes you up at night",
	  number: 2,
	  answers: [
		    {
		      text: "PagerDuty",
		      score: 9,
		      display: "no"
		    },
		    { 
		      text: "pager/phone",
		      score: 8,
		      display: "no"
		    },
		    {
		      text: "cat/dog/pets",
		      score: 6,
		      display: "no"
		    },
		    {
		      text: "Nagios",
		      score: 6,
		      display: "no"
		    },
		    {
		      text: "family",
		      score: 5,
		      display: "no"
		    },
		    {
		      text: "bladder/restroom",
		      score: 4,
		      display: "no"
		    },
		    {
		      text: "NOC",
		      score: 3,
		      display: "no"
		    }
	  ]	    
	});
      Questions.insert(
	{
	  question: "Name a reason your build is slow",
	  number: 3,
	  answers: [
		    {
		      text: "underpowered build server",
		      score: 8,
		      display: "no"
		    },
		    { 
		      text: "too many tests",
		      score: 6,
		      display: "no"
		    },
		    {
		      text: "Dev/poorly written code",
		      score: 5,
		      display: "no"
		    },
		    {
		      text: "Too many dependencies",
		      score: 4,
		      display: "no"
		    },
		    {
		      text: "gcc",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "jvm (Java/Scala)",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "large codebase/monolithic app",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "it is not slow",
		      score: 1,
		      display: "no"
		    }

	  ]	    
	});
      Questions.insert(
	{
	  question: "______ Driven Development",
	  number: 4,
	  answers: [
		    {
		      text: "Test",
		      score: 16,
		      display: "no"
		    },
		    {
		      text: "Anger/Hate",
		      score: 7,
		      display: "no"
		    },
		    { 
		      text: "Behavior",
		      score: 4,
		      display: "no"
		    },
		    {
		      text: "Asshole",
		      score: 2,
		      display: "no"
		    },
		    {
		      text: "Beer",
		      score: 2,
		      display: "no"
		    },
		    {
		      text: "README",
		      score: 2,
		      display: "no"
		    },
		    {
		      text: "Compromise",
		      score: 1,
		      display: "no"
		    },
		    {
		      text: "Hug",
		      score: 1,
		      display: "no"
		    }
	  ]	    
	});
      Questions.insert(
	{
	  question: "Name a SCaLE organizer or DevOps Day planner",
	  number: 5,
	  answers: [
		    {
		      text: "Ilan Rabinovitch",
		      score: 10,
		      display: "no"
		    },
		    { 
		      text: "Brandon Burton",
		      score: 4,
		      display: "no"
		    },
		    {
		      text: "Do not know anyone",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "Gareth",
		      score: 3,
		      display: "no"
		    },
		    {
		      text: "John 'Whatcha Talkin Bout' Willis",
		      score: 2,
		      display: "no"
		    }
	  ]	    
	});
      Questions.insert(
	{
	  question: "______ As A Service",
	  number: 6,
	  answers: [ 
	    {
	      text: "Software",
	      score: 19,
	      display: "no"
	    },
	    {
	      text: "Infrastructure",
	      score: 14,
	      display: "no"
	    },
	    {
	      text: "Platform",
	      score: 5,
	      display: "no"
	    },
	    {
	      text: "Service",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "Rage/Sarcasm/another emotion",
	      score: 2,
	      display: "no"
	    },
	    {
	      text: "Hugs",
	      score: 1,
	      display: "no"
	    }
	  ]
	});
      Questions.insert(
	{
	  question: "Something you have only one of",
	  number: 7,
	  answers: [ 
	    {
	      text: "life",
	      score: 6,
	      display: "no"
	    },
	    {
	      text: "spouse",
	      score: 5,
	      display: "no"
	    },
	    {
	      text: "brain",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "cell phone",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "me",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "nose",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "availability zone",
	      score: 1,
	      display: "no"
	    },
	    {
	      text: "/dev/house",
	      score: 1,
	      display: "no"
	    }
	  ]
	});
      Questions.insert(
	{
	  question: "What do SysAdmins spend most of their time doing?",
	  number: 8,
	  answers: [ 
	    {
	      text: "Fire fighting",
	      score: 5,
	      display: "no"
	    },
	    {
	      text: "drinking",
	      score: 4,
	      display: "no"
	    },
	    {
	      text: "fixing Dev screwups",
	      score: 4,
	      display: "no"
	    },
	    {
	      text: "yak shaving",
	      score: 4,
	      display: "no"
	    },
	    {
	      text: "being lazy",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "cat videos",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "scripting",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "games",
	      score: 2,
	      display: "no"
	    },
	    {
	      text: "porn",
	      score: 2,
	      display: "no"
	    },
	    {
	      text: "administering systems",
	      score: 1,
	      display: "no"
	    }
	  ]
	});
      Questions.insert(
	{
	  question: "Something you might hear asked at a post-mortem",
	  number: 9,
	  answers: [ 
	    {
	      text: "Who's fault is it?",
	      score: 7,
	      display: "no"
	    },
	    {
	      text: "How can we prevent this in the future?",
	      score: 5,
	      display: "no"
	    },
	    {
	      text: "fuck",
	      score: 3,
	      display: "no"
	    },
	    {
	      text: "How did this get past QA?",
	      score: 2,
	      display: "no"
	    }
	  ]
	});
      Questions.insert(
	{
	  question: "Name something you might find in your logs",
	  number: 10,
	  answers: [ 
	    {
	      text: "errors",
	      score: 11,
	      display: "no"
	    },
	    {
	      text: "exceptions",
	      score: 4,
	      display: "no"
	    },
	    {
	      text: "Chinese",
	      score: 2,
	      display: "no"
	    },
	    {
	      text: "Romanians",
	      score: 2,
	      display: "no"
	    },
	    {
	      text: "warnings",
	      score: 2,
	      display: "no"
	    },
	    {
	      text: "porn",
	      score: 1,
	      display: "no"
	    },
	    {
	      text: "Russians",
	      score: 1,
	      display: "no"
	    }
	  ]	    
	});
    }
  });
}
