"use strict";

function KapowClientController() {
}

var kapowClientController = function() {
};

KapowClientController.prototype.handleOnLoad = function(room) {
    console.log("Loading Player Info");
    kapow.getUserInfo(function (user) {
        console.log("Client getUserInfoSuccess - User: " + JSON.stringify(user));
        gameInfo.set("playerData", user.player);
        console.log("Game about to be started.");
        GameManager.startGame();
    }, function (error) {
        console.log("Client getUserInfo failure", error);
    });
};

KapowClientController.prototype.handleBackButton = function() {
    console.log("Backbutton pressed");
    var screenState = gameInfo.get("screenState");
    console.log("Screenstate is ",screenState);
    switch(screenState) {
        case GAME_CONST.STATES.PLAY : {
            console.log("Resetting game state");
            GameManager.resetGameState();
            break;
        }
        case GAME_CONST.STATES.GAMEOVER : {
            console.log("Resetting game state");
            GameManager.resetGameState();
            break;
        }
        default : {
            console.log("Calling kapow.close")
            kapow.close();
            break;
        }
    }
};

var kapowClientController = new KapowClientController();