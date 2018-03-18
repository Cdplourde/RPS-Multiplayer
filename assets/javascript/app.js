// ************** GLOBAL VARIABLES ************** 

var userPlayer = 0;
var numPlayers = 0;
var activePlayers = 0;
var activePlayer = false;

// initialize firebase
var config = {
    apiKey: "AIzaSyAoC9KuPYiBZEvkBd8R7uftEPMOxEMFCxM",
    authDomain: "rockpaperscissors-204dc.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-204dc.firebaseio.com",
    projectId: "rockpaperscissors-204dc",
    storageBucket: "rockpaperscissors-204dc.appspot.com",
    messagingSenderId: "151308153526"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// ************** FUNCTIONS ************** 

//sets player number and adds player to database
function setPlayer(num) {
    userPlayer = num;
    database.ref("players/" + num).set({
        name: userName,
        player: num,
        wins: 0,
        losses: 0,
        choice: "null",
        message: "null"
    });
    //makes promise to remove player from database on disconnect
    database.ref("players/" + num).onDisconnect().remove();
}

// ************** DATABASE EVENTS ************** 

// Update player cards when a player joins
database.ref("players").on("child_added", function(snapshot) {
    $(".player" + snapshot.val().player + "-card-text").text(snapshot.val().name);
    numPlayers++;
    if (userPlayer === 1) {
        $(".section-a form").hide();
        $("#greeting").text("Hi " + userName + "! You are Player " + userPlayer)
        $("#greeting").show();  
    }
    else if (userPlayer === 2) {
        $(".section-a form").hide();
        $("#greeting").text("Hi " + userName + "! You are Player " + userPlayer)
        $("#greeting").show();  
    }
    else if (userPlayer === 0 && numPlayers === 2) {
        $(".section-a form").hide();
        $("#greeting").text("Oh no! The lobby is full!")
        $("#greeting").show();          
    }
}) 
// Update player cards when a player leaves
database.ref("players").on("child_removed", function(snapshot) {
    $(".player" + snapshot.val().player + "-card-text").text("Waiting for player " + snapshot.val().player);
    numPlayers--;
    if (userPlayer === 0 && numPlayers === 1) {
        $("#greeting").hide();
        $(".section-a form").show();
    }
})  

// ************** CLICK EVENTS ************** 

// 'Start button' click event
$(document).on("click", "#btn-start", function() {
    event.preventDefault();     
    //grab name input
    if ($("#name-input").val().trim() != "") {
        activePlayer = true;
        userName = $("#name-input").val().trim();
    }
    //grab database snapshot
    database.ref().once("value", function(snapshot) {
        // If player 1 doesn't exist, add player to database
        if (!snapshot.child("players").hasChild("1")) {
            setPlayer(1);
        }
        //If player 1 exists, but player 2 doesn't, add player
        else if (!snapshot.child("players").hasChild("2")) {
            setPlayer(2);
        }
        else {}
    });
});