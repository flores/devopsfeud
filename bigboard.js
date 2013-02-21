Questions = new Meteor.Collection("questions");

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
    var pie= Questions.find({question:"What is an indispensible tool?"}, {answers: 1, _id:0});
    var cake = '';
    // OMG why
    pie.forEach(function (answer) {
      cake = answer.answers;
    });
    console.log(cake);
    return cake;
  };

  Template.admin.answers = function () {
//    console.log(Questions.find({}, {answers: {sort: {score: -1, text: 1}}}));
//    console.log(Questions.find({}, {sort: {score: -1, text: 1}}));
    var pie= Questions.find({question:"What is an indispensible tool?"}, {answers: 1, _id:0});
    var cake = '';
    // OMG why
    pie.forEach(function (answer) {
      cake = answer.answers;
    });
    console.log(cake);
    return cake;
  };

  Template.admin.selected_answer = function () {
//    var answer = Questions.findOne( {answers: {text: Session.get("selected_answer")}});
    var answer = Questions.findOne({'answers.text':Session.get("display_answer")});
    return answer && answer.text;
  };

  Template.bigboard.question_points = function () {
    console.log("i got here");
    var qscore = Questions.find({question:"What is an indispensible tool?", 'answers.display': "yes"}, {'answers.score': 1, _id: 0});
    var tscore = 0;
    qscore.forEach (function (each_score) {
      console.log(each_score);
      tscore += each_score.score;
    });
    console.log(tscore);
    return tscore;
  };

  Template.admin.selected = function () {
    return Session.equals("display_answer", this._id) ? "selected" : '';
  };

  Template.admin.events({
    'click input.display': function () {
      console.log(Questions.update(Session.get("display_answer"), {$set: {'answers.display': "yes"}}));
      Questions.update(Session.get("display_answer"), {$set: {'answers.display': "yes"}});
      console.log("i got here");
    }
  });

  Template.admin.events({
    'click': function () {
      Session.set("display_answer", this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("i got here");
    console.log(Questions.find().count());
    if (Questions.find().count() === 0) {
      Questions.insert(
	{
	  question: "What is an indispensible tool?",
	  answers: [
		    { 
		      text: "grep",
		      score: 50,
		      display: "no"
		    },
		    {
		      text: "cat",
		      score: 10,
		      display: "no"
		    },
		    {
		      text: "perl",
		      score: 20,
		      display: "no"
		    },
		    {
		      text: "rm -rf /",
		      score: 100,
		      display: "no"
		    },
		    {
		      text: "nc",
		      score: 100,
		      display: "no"
		    },
		    {
		      text: "cd",
		      score: 1,
		      display: "no"
		    },
		    {
		      text: "echo oh no why |wall",
		      score: 1000,
		      display: "no"
		    }
	  ]	    
	}
      );

    }
  });
}
