// Global Variables
var userName;

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

database.ref().on("value", function(snapshot) {
    if (snapshot.child("players/1").exists()) {
        console.log("hi");
        $(".player1-card-text").text(snapshot.child("players/1/name").val())
    }
    if (snapshot.child("players/2").exists()) {
        $(".player2-card-text").text(snapshot.child("players/2/name").val())
    };
});

// 'Start button' click event
$(document).on("click", "#btn-start", function() {
    event.preventDefault();     
    //grab name input
    userName = $("#name-input").val();

    database.ref().once("value", function(snapshot) {
        // If player 1 doesn't exist, add player
        if (!snapshot.child("players").hasChild("1")) {
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
            //reset player1 object with new values
            userPlayer = 2;
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
        else {
            alert("The room is currently full!");
        }
    })
});







