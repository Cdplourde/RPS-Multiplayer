// Global Variables
var userName;
var userPlayer;
var activePlayer = false;

var player1 = {
    name: "",
    wins: 0,
    losses: 0,
    ties: 0
};

var player2 = {
    name: "",
    wins: 0,
    losses: 0,
    ties: 0
};

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
  var player1Ref = database.ref("players/1");
  var player2Ref = database.ref("players/2");


//EVENTS
//Set what player user is on load
// database.ref().once("value", function(snapshot) {
  
// });

database.ref().on("value", function(snapshot) {
    //change player 1 card text to player1 name
    if (snapshot.child("players/1").exists()) {
        $(".player1-card-text").text(snapshot.child("players/1/name").val());
    }
    //when player 1 leaves change card text to waiting for player 1
    else {
        $(".player1-card-text").text("Waiting for Player 1");
    }
    //change player 2 card text to player2 name
    if (snapshot.child("players/2").exists()) {
        $(".player2-card-text").text(snapshot.child("players/2/name").val());
    }
    //when player 2 leaves change card text to waiting for player 2
    else {
        $(".player2-card-text").text("Waiting for Player 2");
    }
    //when the user is an active player, hide the name entry form and show what player they are
    if (activePlayer) {
        $(".section-a form").hide();
        $("h3").text("Hi " + userName + "! You are Player " + userPlayer)
        $("h3").show();        
    }
    //when the lobby is full and the user is not an active player, hide the form and display a message
    if (!activePlayer && snapshot.child("players/1").exists() && snapshot.child("players/2").exists()) {
        $(".section-a form").hide();
        $("h3").text("This room is full!")
        $("h3").show();
    }
    //when a player drops out, allow new players to join in
    if (!activePlayer && (!snapshot.child("players/1").exists() || !snapshot.child("players/2").exists())) {
        $("h3").hide();
        $(".section-a form").show();
    }
});

// 'Start button' click event
$(document).on("click", "#btn-start", function() {
    event.preventDefault();     
    //grab name input
    if ($("#name-input").val().trim() != "") {
        activePlayer = true;
        userName = $("#name-input").val().trim();

        database.ref().once("value", function(snapshot) {
            // If player 1 doesn't exist, add player
            if (!snapshot.child("players").hasChild("1")) {
                userPlayer = 1;
                //reset player1 object with new values
                player1.name = userName;
                player1.wins = 0;
                player1.losses = 0;
                player1.ties = 0;
                //set player1 in database
                player1Ref.set({
                    name: player1.name,
                    wins: player1.wins,
                    losses: player1.losses,
                    ties: player1.ties
                });
                // remove player 1 from database on disconnect
                database.ref("players/1").onDisconnect().remove();
            } 
            // If player 2 doesn't exist, add player
            else if (!snapshot.child("players").hasChild("2")) {
                userPlayer = 2;
                //reset player1 object with new values
                player2.name = userName;
                player2.wins = 0;
                player2.losses = 0;
                player2.ties = 0;
                //set player2 in database
                player2Ref.set({
                    name: player2.name,
                    wins: player2.wins,
                    losses: player2.losses,
                    ties: player2.ties
                });
                //remove player 2 from database on disconnect
                database.ref("players/2").onDisconnect().remove();
            }
            // Tell player that the room is full
            else {}
        })        
    }

});