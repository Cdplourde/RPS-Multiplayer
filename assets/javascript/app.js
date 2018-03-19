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

//shows instruction and buttons for each player
function startGame() {
    $("#instruction").show();
    if (userPlayer === 1) {
        $(".player1-card-text").after("<button>Rock</button>");
        $(".player1-card-text").after("<button>Paper</button>");
        $(".player1-card-text").after("<button>Scissors</button>");
    }   
    if (userPlayer === 2) {
        $(".player2-card-text").after("<button>Rock</button>");
        $(".player2-card-text").after("<button>Paper</button>");
        $(".player2-card-text").after("<button>Scissors</button>");
    }   
}

function continueGame() {
    setTimeout(function() {
        $("#card1 h2").remove();
        $("#card2 h2").remove();
        $("#card3 h2").remove();

        if (userPlayer === 1) {
            $(".player1-card-text").after("<button>Rock</button>");
            $(".player1-card-text").after("<button>Paper</button>");
            $(".player1-card-text").after("<button>Scissors</button>");
        }   
        if (userPlayer === 2) {
            console.log("hi");
            $(".player2-card-text").after("<button>Rock</button>");
            $(".player2-card-text").after("<button>Paper</button>");
            $(".player2-card-text").after("<button>Scissors</button>");
        }   
    }, 3000);
}

//removes instruction and buttons
function endGame() {
    $("#instruction").hide();
    if (userPlayer === 1) {
        $("#card1 button").remove();
        $("#card1").css({"border-color": "black", "box-shadow": "none"});
        $("#card3").css({"border-color": "black", "box-shadow": "none"});
        database.ref("players/1/choice").set("null");
    }   
    if (userPlayer === 2) {
        $("#card3 button").remove();
        $("#card1").css({"border-color": "black", "box-shadow": "none"});
        $("#card3").css({"border-color": "black", "box-shadow": "none"});
        database.ref("players/2/choice").set("null");
    }   
}

//determine winner of round 
function determineWinner(p1choice, p2choice) {
    //revert choice border css. hide instruction and choice buttons
    $("#card1").css({"border-color": "black", "box-shadow": "none"});
    $("#card3").css({"border-color": "black", "box-shadow": "none"});
    $("#card1 button, #card3 button").remove();
    $("#instruction").hide();
    var winner
    database.ref("players").once("value", function(snapshot) {
        if (snapshot.child("1").exists() && snapshot.child("2").exists()) {
            //win conditions for player 1
            if ((p1choice === "Rock" && p2choice === "Scissors") || (p1choice === "Paper" && p2choice === "Rock") || (p1choice === "Scissors" && p2choice === "Paper")) {
                //grab name of winner
                winner = snapshot.child("1/name").val();
                //grab win/loss values of each player
                var p1Wins = snapshot.child("1/wins").val();
                var p2Losses = snapshot.child("2/losses").val();
                //update win/loss counts in database
                database.ref("players/1/wins").set(p1Wins + 1);
                database.ref("players/2/losses").set(p2Losses + 1);

                $("#p1wins").text(p1Wins + 1);
                $("#p2losses").text(p2Losses + 1);

                $("#card1").append("<h2>" + p1choice + "</h2>");
                $("#card3").append("<h2>" + p2choice + "</h2>");
                $("#card2").append("<h2>" + snapshot.child("1/name").val() +" wins!</h2>")
                continueGame();
            }
            //tie condition
            else if (p1choice === p2choice) {
                $("#card1").append("<h2>" + p1choice + "</h2>");
                $("#card3").append("<h2>" + p2choice + "</h2>");
                $("#card2").append("<h2>Tie!</h2>")
                continueGame();
            }     
            //lose condition, ensure players are still playing
            else if (snapshot.child("1").exists() && snapshot.child("2").exists()) {
                winner = snapshot.child("2/name").val();
                var p2Wins = snapshot.child("2/wins").val();
                var p1Losses = snapshot.child("1/losses").val();
                //update win/loss counts in database
                database.ref("players/2/wins").set(p2Wins + 1);
                database.ref("players/1/losses").set(p1Losses + 1);

                $("#p2wins").text(p2Wins);
                $("#p1losses").text(p1Losses);

                $("#card1").append("<h2>" + p1choice + "</h2>");
                $("#card3").append("<h2>" + p2choice + "</h2>");
                $("#card2").append("<h2>" + snapshot.child("2/name").val() + " wins!</h2>")
                continueGame();
            }   
            //show winner reset player choices
            setTimeout(function() {
                //grab new snapshot to ensure player did not leave during timeout
                database.ref("players").once("value", function(snap) {
                    if (snap.child("1").exists()) {
                        database.ref("players/1/choice").set("null");
                    }
                    if (snap.child("2").exists()) {
                        database.ref("players/2/choice").set("null");      
                    }       
                    //stop borders from changing
                    $("#card1").css({"border-color": "black", "box-shadow": "none"});
                    $("#card3").css({"border-color": "black", "box-shadow": "none"});             
                })
            }, 3000);
        }
    });

}

// ************** DATABASE EVENTS ************** 

// Update player cards when a player joins
database.ref("players").on("child_added", function(snapshot) {
    $(".player" + snapshot.val().player + "-card-text").text(snapshot.val().name);
    if (snapshot.val().player === 1) {
        $("#card1").append("<p class='scores' id='p1win'>Wins: <span id='p1wins'>" + snapshot.val().wins + "</span></p>");
        $("#card1").append("<p class='scores' id='p1lose'>Losses: <span id='p1losses'>" + snapshot.val().losses + "</span></p>");
    }
    if (snapshot.val().player === 2) {
        $("#card3").append("<p class='scores' id='p2win'>Wins: <span id='p2wins'>" + snapshot.val().wins + "</span></p>");
        $("#card3").append("<p class='scores' id='p2lose'>Losses: <span id='p2losses'>" + snapshot.val().losses + "</span></p>");
    }
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
    if (numPlayers === 2 && activePlayer) {
        startGame();
    }
});
// Update player cards when a player leaves
database.ref("players").on("child_removed", function(snapshot) {
    if (snapshot.val().player === 1) {
        $(".player1-card-text").text("Waiting for player 1"); 
        $("#card1 .scores").remove();
    }
    if (snapshot.val().player === 2) {
        $(".player2-card-text").text("Waiting for player 2"); 
        $("#card3 .scores").remove();     
    }
    numPlayers--;
    if (userPlayer === 0 && numPlayers === 1) {
        $("#greeting").hide();
        $(".section-a form").show();
    }
    if (activePlayer) {
        endGame();
    }
});

// When player 1 makes a choice
database.ref("players/1/choice").on("value", function(snapshot) {
    database.ref("players/2/choice").once("value", function(snap) {
        //if only player that has chosen, highlight player card and hide their buttons
        if (numPlayers === 2 && snap.val() === "null" && snap.exists() && snapshot.exists()) {
            $("#card1").css({"outline": "none", "border-color": "#9ecaed", "box-shadow": "0 0 10px #9ecaed"});
            $("#card1 button").remove();
        }
        //if both players have chosen, determine winner
        else if (snapshot.val() !== "null" && snap.val() !== "null" && snap.exists()) {
            determineWinner(snapshot.val(), snap.val());
        }
    })
});

// When player 2 makes a choice
database.ref("players/2/choice").on("value", function(snapshot) {
    database.ref("players/1/choice").once("value", function(snap) {
        //if only player that has chosen, highlight player card and hide their buttons
        if (numPlayers === 2 && snap.val() === "null" && snap.exists() && snapshot.exists()) {
            $("#card3").css({"outline": "none", "border-color": "#9ecaed", "box-shadow": "0 0 10px #9ecaed"});
        }
        //if both players hace chosen, determine winner
        else if(snapshot.val() !== "null" && snap.val() !== "null" && snap.exists() && snapshot.exists()) {
            determineWinner(snap.val(), snapshot.val());
        }
    });
});

// ************** CLICK EVENTS ************** 

// 'Play!' button click event
$(document).on("click", "#btn-start", function() {
    event.preventDefault();     
    //grab name input
    if ($("#name-input").val().trim() !== "") {
        activePlayer = true;
        userName = $("#name-input").val().trim();
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
    }
});

$(document).on("click", "#card3 button", function() {
    database.ref("players/2/choice").set($(this).text())
});

$(document).on("click", "#card1 button", function() {
    database.ref("players/1/choice").set($(this).text())
});