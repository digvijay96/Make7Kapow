"use strict";
var GameManager = {
    startGame : function(){
        this.startState(GAME_CONST.STATES.BOOT);
    },
    startState: function(state) {
        gameInfo.set("screenState", state);
        gameInfo.get("game").state.start(state);
    },
    resetGameState: function() {
        this._resetRoom();
        GameManager.startState(GAME_CONST.STATES.MENU);
    },
    _resetRoom: function() {
        kapow.unloadRoom(function () {
            console.log('Room Successfully Unloaded');
        }, function () {
            console.log('Room Unloading Failed');
        });
        gameInfo.setBulk({
                "room": null,
                "gameType": null,
                "won": false,
                "game": null,
                "score": null,
                "screenState": null,
                "difficulty_level": null
        });
    }
};