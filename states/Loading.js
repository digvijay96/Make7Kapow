"use strict";

var loading = function() {
};

loading.prototype = {
    preload: function() {
        gameInfo.set("screenState",GAME_CONST.STATES.LOADING);
        gameInfo.get("game").load.image('cell', 'assets/play-button.png');
    },

    create: function() {
        var playImage = gameInfo.get("game").add.image(this.game.world.centerX, this.game.world.centerY, 'cell');
        playImage.anchor.setTo(0.5);
        playImage.scale.setTo(4);

        playImage.inputEnabled = true;
        playImage.events.onInputDown.add(this.listener, this);
    },

    listener: function() {
        kapow.startSoloGame(function (roomDetail) {
            gameInfo.set('room', roomDetail)
            gameInfo.get("game").state.start(GAME_CONST.STATES.PLAY);
            console.log('room received in onLOAD: ', roomDetail)
        }, function (error) {
            console.log("startSoloGame Failed : ", error);
        });
    }
}