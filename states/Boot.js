"use strict";

var boot = function(game) {
};

boot.prototype = {
    preload: function() {
        gameInfo.set("screenState",GAME_CONST.STATES.BOOT);
        this.load.crossOrigin = 'anonymous';
        this.load.image('background', 'assets/images/background.png');
        this.load.image("progressBackground", "assets/images/bar.png");
        this.load.image("progressBar", "assets/images/loading-bar.png");
    },

    create: function() {
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        this.input.maxPointers = 1;
        this.state.start(GAME_CONST.STATES.LOADING);
    }
};