"use strict";

var loading = function() {
};

loading.prototype = {
    preload: function() {
        gameInfo.get("game").load.image('cell', 'assets/play-button.png');
    },

    create: function() {
        var playImage = gameInfo.get("game").add.image(100, 100, 'cell');
        playImage.inputEnabled = true;
        playImage.events.onInputDown.add(this.listener, this);
    },

    listener: function() {
             kapow.startSoloGame(function (roomDetail) {
            gameInfo.get("game").state.start(GAME_CONST.STATES.PLAY);
        }, function (error) {
            console.log("startSoloGame Failed : ", error);
        });
       // this.game.state.start("Play");
    }
}