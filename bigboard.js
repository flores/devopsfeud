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
    var pie= Questions.find({question:"What is an indispensible tool?"}, {answers: 1});
    var cake = '';
    // OMG why
    pie.forEach(function (answer) {
      cake = answer.answers;
    });
    console.log(cake);
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
    var pie= Questions.find({question:"What is an indispensible tool?"}, {sort : {'answers.score': -1}});
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
    var answerset = Questions.find({question:"What is an indispensible tool?"}, {answers: 1}); 
    console.log(answerset);
    var tscore = 0;
    answerset.forEach(function (set) {
      set.answers.forEach (function (answer) {
        if (answer.display == 'yes') {
	  console.log(answer.score);
	  tscore += answer.score;
        }
      });
    });
    console.log(tscore);
    return tscore;
  };

  Template.admin.selected = function () {
//    console.log("display_answer", this.text);
    return Session.equals("display_answer", this.text) ? "selected" : '';
  };

  Template.admin.events({
    'click input.display': function () {
      var id;
      Questions.find({question:"What is an indispensible tool?"}).forEach( function (set) {
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
      Incontrol.insert({incontrol: "EdgeCast"});
    }
  });
  Template.admin.events({
    'click input.facebook_incontrol': function () {
      Incontrol.insert({incontrol: "Facebook"});
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
      Incontrol.insert({ wrong: 0});
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
	}
      );

    }
  });
}
