"use strict";

var boot = function(game) {
};

boot.prototype = {
    preload: function() {
        gameInfo.set("screenState",GAME_CONST.STATES.BOOT);
        this.game.load.image("background", "assets/background.png");
    },

    create: function() {
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        this.input.maxPointers = 1;
        this.state.start(GAME_CONST.STATES.LOADING);
    }
}