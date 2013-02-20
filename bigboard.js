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
    console.log(Questions.find({}, {sort: {score: -1, text: 1}}));
    return Questions.find({}, {sort: {score: -1, text: 1}});
  };

  Template.admin.answers = function () {
//    console.log(Questions.find({}, {answers: {sort: {score: -1, text: 1}}}));
    console.log(Questions.find({}, {sort: {score: -1, text: 1}}));
    return Questions.find({}, {sort: {score: -1, text: 1}});
  };

  Template.admin.selected_answer = function () {
//    var answer = Questions.findOne( {answers: {text: Session.get("selected_answer")}});
    var answer = Questions.findOne(Session.get("display_answer"));
    return answer && answer.text;
  };

  Template.admin.selected = function () {
    return Session.equals("display_answer", this._id) ? "selected" : '';
  };

  Template.admin.events({
    'click input.display': function () {
      console.log(Questions.update(Session.get("display_answer"), {$set: {display: "yes"}}));
      Questions.update(Session.get("display_answer"), {$set: {display: "yes"}});
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
//      Questions.insert(
//	{
//	  question: "What is an indispensible tool?",
//	  answers:
	    
		    Questions.insert({ 
		      text: "grep",
		      score: 50,
		      display: "no"
		    });
		    Questions.insert({
		      text: "cat",
		      score: 10,
		      display: "no"
		    });
		    Questions.insert({
		      text: "perl",
		      score: 20,
		      display: "no"
		    });
		    Questions.insert({
		      text: "rm -rf /",
		      score: 100,
		      display: "no"
		    });
		    Questions.insert({
		      text: "nc",
		      score: 100,
		      display: "no"
		    });
		    Questions.insert({
		      text: "cd",
		      score: 1,
		      display: "no"
		    });
		    Questions.insert({
		      text: "node -e 'console.log(fuck dave)'",
		      score: 1000,
		      display: "no"
		    });
//	  ]	    
//	}
//      );

    }
  });
}
