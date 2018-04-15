"use strict";
var GameManager = {
    startGame : function(){
        this.startState(GAME_CONST.STATES.BOOT);
    },
    startState: function(state) {
        gameInfo.set("screenState", state);
        gameInfo.get("game").state.start(state);
    },

    restartGameWithSameDifficulty: function() {
       this.startGameWithDifficulty(gameInfo.get(GAME_CONST.DIFFICULTY_LEVEL_KEY))
    },

    startGameWithDifficulty: function(difficultyLevel) {
        console.log('Starting new game with difficultyLevel: ', gameInfo.get(GAME_CONST.DIFFICULTY_LEVEL_KEY))
        gameInfo.set(GAME_CONST.DIFFICULTY_LEVEL_KEY, difficultyLevel)
        kapow.startSoloGame(function (roomDetail) {
            gameInfo.set('room', roomDetail);
            console.log('room received in startSoloGame: ', roomDetail);
            gameInfo.set(GAME_CONST.IS_NEW_GAME, true);
            gameInfo.get("game").state.start(GAME_CONST.STATES.PLAY);
        }, function (error) {
            console.log("startSoloGame Failed : ", error);
        });
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
                "score": null,
                "screenState": null,
                "difficulty_level": null
        });
    }
};