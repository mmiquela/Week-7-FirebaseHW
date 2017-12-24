//Steps to complete
// 1. Initialize Firebase.
// 2. Create button to add Train Schedule - then update the html + update the database.
// 3. Create a way to retrieve train schedule from the train database.
// 4. Create a way to calculate the next arrival time.
// 5. Create a way to calculate the next arrival time in minutes.

// 1. Initialize Firebase.
  var config = {
    apiKey: "AIzaSyAnqyYb2LVBcR0-iZ0lixj20ru4HQY3x4g",
    authDomain: "traintime-dadb1.firebaseapp.com",
    databaseURL: "https://traintime-dadb1.firebaseio.com",
    projectId: "traintime-dadb1",
    storageBucket: "traintime-dadb1.appspot.com",
    messagingSenderId: "808261435771"
  };
  firebase.initializeApp(config);

var database = firebase.database();
// //DATA Global Variable
//   var data;
//   //Firebase pull New Data
//   database.ref().on("value",function(snapshot){
//   	data = snapshot.val();
//   	refreshTable();
//   })
// 2. Button for Train Schedule.
$("#add-schedule-btn").on("click", function(){
	event.preventDefault();
	//Grabs user input
	var trnName = $("#train-name-input").val().trim();
	var trnDestination = $("#destination-input").val().trim();
	var trnFirsttraintime = $("#first-train-time-input").val().trim();
	var trnFrequency = $("#frequency-input").val().trim();


	// USER INPUT WARNINGS //

  if(trnName == "" || trnName == null){
    alert("Please enter a Train Name!");
    return false;
  }
  if(trnDestination == "" || trnDestination == null){
    alert("Please enter a Train Destination!");
    return false;
  }
  if(trnFirsttraintime == "" || trnFirsttraintime == null){
    alert("Please enter a First Arrival Time!");
    return false;
  }
  if(trnFrequency == "" || trnFrequency == null || trnFrequency < 1){
    alert("Please enter an arrival frequency (in minutes)!" + "\n" + "It must be an integer greater than zero.");
    return false;
  }


// FIRST ARRIVAL TIME in 24:00 //

    // Check Digits //

  if(trnFirsttraintime.length != 5 || trnFirsttraintime.substring(2,3) != ":"){
    alert(" rule 1 violation Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;
  }
    // Check 

  else if( isNaN(parseInt(trnFirsttraintime.substring(0, 2))) || isNaN(parseInt(trnFirsttraintime.substring(3))) ){
    alert(" rule 2 violation  Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;
  }
    // Check 00:00 to 23:00 //

  else if( parseInt(trnFirsttraintime.substring(0, 2)) < 0 || parseInt(trnFirsttraintime.substring(0, 2)) > 23 ){
    alert("rule 3 violation Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;
  }
    // Check 00:00 to 00:59 //

  else if( parseInt(trnFirsttraintime.substring(3)) < 0 || parseInt(trnFirsttraintime.substring(3)) > 59 ){
    alert("rule 4 violation Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;   
  }

    //COLLECT date click
    var today = new Date();
    var thisMonth = today.getMonth()+1
    var thisDate = today.getDate();
    var thisYear = today.getFullYear();
    var dateString = "";
    var dateString = dateString.concat(thisMonth,"/", thisDate, "/", thisYear)

    //Date and Time Storage
    var trainFirstArrival = dateString.concat("",trnFirsttraintime);
	//Creates local "temporary" object for holding employee data
	var newTrn = {
		name : trnName,
		destination : trnDestination,
		firsttraintime : trainFirstArrival,
		frequency : trnFrequency
	};
	//Uploads employee data to the database.
	database.ref().push(newTrn);
	//Logs everything to console.
	console.log(newTrn.name);
	console.log(newTrn.destination);
	console.log(newTrn.firsttraintime);
	console.log(newTrn.frequency);

	alert('Train Schedule added!');

	//Clears all of the text-boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-time-input").val("");
	$("#frequency-input").val("");
});

//3. Create Firebase event for adding employee to the database and a row in the html when a user 
//adds an entry 

database.ref().on("child_added",function(childSnapshot,prevChildKey){
	console.log(childSnapshot.val());

//store everything in a variable
var trnName = childSnapshot.val().name;
var trnDestination = childSnapshot.val().destination;
var trnFirsttraintime = childSnapshot.val().firsttraintime;
var trnFrequency = childSnapshot.val().frequency;

//Train Information
console.log(trnName);
console.log(trnDestination);
console.log(trnFirsttraintime);
console.log(trnFrequency);

//Moment
var convertedDate= moment(new Date(trnFirsttraintime));
console.log("This is the" + convertedDate);
//Minutes Away
var minuteDiffFirstArrivaltoNow = moment(convertedDate).diff(moment(),"minutes") * (-1);
console.log("Now this is the " + minuteDiffFirstArrivaltoNow);
if (minuteDiffFirstArrivaltoNow <= 0){
	trainMinutesAway = moment(convertedDate).diff(moment(),"minutes");
//Next Departure time
trainNextDepartureDate = convertedDate;
} else {
	trainMinutesAway = trnFrequency - (minuteDiffFirstArrivaltoNow % trnFrequency);
	var trainNextDepartureDate = moment().add(trainMinutesAway,'minutes');
}
//AM PM
trainNextDeparture = trainNextDepartureDate.format("hh:mm A");

// //Prettify the Next Arrival time
// var trnNextArrival = moment.unix(trnFirsttraintime,"X").format("HH:mm");
// //Calculate Next train time in minutes
// var trnMinutesAway = moment().diff(moment.unix(trnFirsttraintime,"X"),"minutes");
// console.log(trnMinutesAway);

//Add each train's data into the table(front-end)
$("#train-table >tbody").append("<tr><td>" + trnName + "</td><td>" + trnDestination + "</td><td>" + trnFrequency + "</td><td>" + trainNextDeparture + "</td><td>" + trainMinutesAway + "</td></tr>" );
});
