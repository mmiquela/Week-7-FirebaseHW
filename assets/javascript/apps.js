
 // FIREBASE //

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

// THEME //

var theme = new Audio("assets7/sounds7/mysterytrain.m4a");

var theme = new Audio("assets7/sounds7/mysterytrain.m4a");
    theme.play();

// DATA GLOBAL VARIABLE//

var data;

  // Firebase Pull New Data //

  database.ref().on("value", function(snapshot) {
  
  // Collect Firebase Data //

  data = snapshot.val();

  // Update DOM //

  refreshTable();

});

// SUBMIT BUTTON //

$("#addTrainButton").on('click', function(){

// COLLECT VALUES to HTML //

  var trainName = $("#nameInput").val().trim();
  var trainDestination = $("#destinationInput").val().trim();
  var trainFirstArrivalTime = $("#firstArrivalInput").val().trim();
  var trainFreq = $("#frequencyInput").val().trim();

// USER INPUT WARNINGS //

  if(trainName == "" || trainName == null){
    alert("Please enter a Train Name!");
    return false;
  }
  if(trainDestination == "" || trainDestination == null){
    alert("Please enter a Train Destination!");
    return false;
  }
  if(trainFirstArrivalTime == "" || trainFirstArrivalTime == null){
    alert("Please enter a First Arrival Time!");
    return false;
  }
  if(trainFreq == "" || trainFreq == null || trainFreq < 1){
    alert("Please enter an arrival frequency (in minutes)!" + "\n" + "It must be an integer greater than zero.");
    return false;
  }

// FIRST ARRIVAL TIME in 24:00 //

    // Check Digits //

  if(trainFirstArrivalTime.length != 5 || trainFirstArrivalTime.substring(2,3) != ":"){
    alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;
  }
    // Check //

  else if( isNaN(parseInt(trainFirstArrivalTime.substring(0, 2))) || isNaN(parseInt(trainFirstArrivalTime.substring(3))) ){
    alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;
  }
    // Check 00:00 to 23:00 //

  else if( parseInt(trainFirstArrivalTime.substring(0, 2)) < 0 || parseInt(trainFirstArrivalTime.substring(0, 2)) > 23 ){
    alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;
  }
    // Check 00:00 to 00:59 //

  else if( parseInt(trainFirstArrivalTime.substring(3)) < 0 || parseInt(trainFirstArrivalTime.substring(3)) > 59 ){
    alert("Please use Military Time! \n" + "Example: 01:00 or 13:00");
    return false;   
  }

// COLLECT DATE CLICK //

  var today = new Date();
  var thisMonth = today.getMonth() + 1;
  var thisDate = today.getDate();
  var thisYear = today.getFullYear();

// DATE STRING //

  var dateString = "";
  var dateString = dateString.concat(thisMonth, "/", thisDate, "/", thisYear);

// DATE & TIME STORAGE //

  var trainFirstArrival = dateString.concat(" ", trainFirstArrivalTime);

// PUSH NEW to FIREBASE //

  database.ref().push({
    name: trainName,
    destination: trainDestination,
    firstArrival: trainFirstArrival,
    frequency: trainFreq
  });

// CLEAR INPUT //

  $("#nameInput").val("");
  $("#destinationInput").val("");
  $("#firstArrivalInput").val("");
  $("#frequencyInput").val("");

  // Prevent Default Refresh //

  return false;
});

// UPDATE DOM //

function refreshTable(){

  // Clear Old Data //

  $('.table-body-row').empty();

// FIREBASE to HTML //

  $.each(data, function(key, value){

// COLLECT VARIABLE //

    var trainName = value.name;
    var trainDestination = value.destination;
    var trainFreq = value.frequency;

    var trainFirstArrivalTime = value.firstArrival;
    
// VARIABLE CALCULATIONS //

    var trainNextDeparture;
    var trainMinutesAway;

// MOMENT //

    var convertedDate = moment(new Date(trainFirstArrivalTime));
    
// MINUTES AWAY //

    var minuteDiffFirstArrivalToNow = moment(convertedDate).diff( moment(), "minutes")*(-1);

      // Check for New Train Times //
      
      if(minuteDiffFirstArrivalToNow <= 0){

        // Current Departure //

        trainMinutesAway = moment(convertedDate).diff( moment(), "minutes");

        // Next Depature Time //

        trainNextDepartureDate = convertedDate;

      }

      else{

        // Next Train Departure //

        trainMinutesAway = trainFreq - (minuteDiffFirstArrivalToNow % trainFreq);

        // Next Departure Time //

        var trainNextDepartureDate = moment().add(trainMinutesAway, 'minutes');
      }

// AM/PM //

    trainNextDeparture = trainNextDepartureDate.format("hh:mm A");

// APPEND HTML w/ FIREBASE //

    var newRow = $('<tr>');
    newRow.addClass("table-body-row");

// NEW DATA from FIREBASE //

    var trainNameTd = $('<td>');
    var destinationTd = $('<td>');
    var frequencyTd = $('<td>');
    var nextDepartureTd = $('<td>');
    var minutesAwayTd = $('<td>');

    // Data Text to HTML //

    trainNameTd.text(trainName);
    destinationTd.text(trainDestination);
    frequencyTd.text(trainFreq);
    nextDepartureTd.text(trainNextDeparture);
    minutesAwayTd.text(trainMinutesAway);

    // New Row Data Text to HTML //

    newRow.append(trainNameTd);
    newRow.append(destinationTd);
    newRow.append(frequencyTd);
    newRow.append(nextDepartureTd);
    newRow.append(minutesAwayTd);

    // New Row to HTML //

    $('.table').append(newRow);

  });
}

// Refresh Page Each Minute //

var counter = setInterval(refreshTable, 60*1000);
// Update the Current Time every second
var timeStep = setInterval(currentTime, 1000);

function currentTime(){
  var timeNow = moment().format("hh:mm:ss A");
  $("#current-time").text(timeNow);

  // Refresh the Page every minute, on the minute
  var secondsNow = moment().format("ss");

  if(secondsNow == "00"){
    refreshTable();
  }

}