//Initialize Firebase
var config = {
    apiKey: "AIzaSyBPNKnn35gqWPwz6hZGoQXAeeLTEMree0I",
    authDomain: "train-scheduler-9a8de.firebaseapp.com",
    databaseURL: "https://train-scheduler-9a8de.firebaseio.com",
    projectId: "train-scheduler-9a8de",
    storageBucket: "train-scheduler-9a8de.appspot.com",
    messagingSenderId: "17599582323"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var name = "";
  var destination = "";
  var firstTrain = "";
  var frequency = "";

$(document).ready(function(){

	//Whenever the page loads or the values in the database change
	// the following function will run
	database.ref().on("value", function(snapshot){

		$("#train").html(snapshot.val().name);
		$("#destination").html(snapshot.val().destination);
		$("#time").html(snapshot.val().time);
		//$("#frequency").html(snapshot.val().frequency);

	}, function(errorObject){
		console.log("The READ failed: " + errorObject.code);
	});

	//Whenever the #add-button button is clicked, the function will run
	$("#add-button").on("click", function(event){

		event.preventDefault();

		//Grabs the values from the users input and stores them into variables
		var aName = $("#train").val().trim();
		var aDestination = $("#destination").val().trim();
		var aFirstTrain = moment($("#time").val(), "HH:mm").subtract(10, "years").format("X");
		var aFrequency = $("#frequency").val().trim();

		database.ref().push({
			name: aName,
			destination: aDestination,
			firstTrain: aFirstTrain,
			frequency: aFrequency,
		});

		$("#train").val("");
		$("#destination").val("");
		$("#time").val("");
		$("#frequency").val("");
	});

	database.ref().on("child_added", function(childSnapshot, prevChildKey) {

		var bName = childSnapshot.val().name;
		var bDestination = childSnapshot.val().destination;
		var bFirstTrain = childSnapshot.val().firstTrain;
		var bFrequency = childSnapshot.val().frequency;

		var differenceTimes = moment().diff(moment.unix(bFirstTrain), "minutes");
		var bRemainder = moment().diff(moment.unix(bFirstTrain), "minutes") % bFrequency ;
		var bMinAway = bFrequency - bRemainder;
		var bNextArrival = moment().add(bMinAway, "m").format("hh:mm A");

		console.log(differenceTimes);
		console.log(bNextArrival);
		console.log(bMinAway);

		$("#train-info").append(
			"<tr><td>" + bName + "</td><td>" + bDestination + "</td><td>" + bFrequency + "</td><td>" + 
			bNextArrival + "</td><td>" + bMinAway + "</td></tr>");
	});

});
