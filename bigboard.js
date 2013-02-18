Questions = new Meteor.Collection("questions");

if (Meteor.isClient) {
  Template.bigboard.answers = function () {
//    console.log(Questions.find({}, {answers: {sort: {score: -1, text: 1}}}));
    console.log(Questions.find({}, {sort: {score: -1, text: 1}}));
    return Questions.find({}, {sort: {score: -1, text: 1}});
  };

  Template.bigboard.selected_answer = function () {
//    var answer = Questions.findOne( {answers: {text: Session.get("selected_answer")}});
    var answer = Questions.findOne(Session.get("selected_answer"));
    return answer && answer.text;
  };

  Template.answer.selected = function () {
    return Session.equals("selected_answer", this._id) ? "selected" : '';
  };

  Template.bigboard.events({
    'click input.display': function () {
      Questions.update(Session.get("selected_answer"), {$set: {display: true}});
    }
  });

  Template.answer.events({
    'click': function () {
      Session.set("selected_answer", this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("i got here");
    console.log(Questions.find().count());
    if (Questions.find().count() === 0) {
      Questions.insert(
//	{
//	  question: "What is an indispensible tool?",
//	  answers:
	  [
	    
		    { 
		      text: "grep",
		      score: 50,
		      display: false
		    },
		    {
		      text: "cat",
		      score: 10,
		      display: false
		    },
		    {
		      text: "perl",
		      score: 20,
		      display: false
		    },
		    {
		      text: "rm -rf /",
		      score: 100,
		      display: false
		    }
	  ]	    
//	}
      );

    }
  });
}
