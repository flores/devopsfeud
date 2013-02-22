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
      var current = Incontrol.find({}, {currentanswer:1});
      var currentnumber = '';
      current.forEach(function (bullshit) {
        currentnumber = bullshit.currentanswer;
      });
      currentnumber += 1;
      Incontrol.insert({currentanswer:currentnumber,wrong: 0, currentpoints:0});
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
	  question: "What is an indispensible tool?",
	  number: 1,
	  answers: [
		    {
		      text: "echo oh no why |wall",
		      score: 1000,
		      display: "no"
		    },
		    { 
		      text: "grep",
		      score: 500,
		      display: "no"
		    },
		    {
		      text: "cat",
		      score: 100,
		      display: "no"
		    },
		    {
		      text: "perl",
		      score: 20,
		      display: "no"
		    },
		    {
		      text: "rm -rf /",
		      score: 10,
		      display: "no"
		    },
		    {
		      text: "nc",
		      score: 1,
		      display: "no"
		    },
		    {
		      text: "cd",
		      score: 1,
		      display: "no"
		    }
	  ]	    
	},
	{
	  question: "This is the second question",
	  number: 2,
	  answers: [ 
	    {
	      text: "first ans",
	      score: 100,
	      display: "no"
	    },
	    {
	      text: "second",
	      score: 1,
	      display: "no"
	    }
	  ]
	}
      );

    }
  });
}
