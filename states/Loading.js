"use strict";

var loading = function() {
};

loading.prototype = {
    preload: function() {
        gameInfo.set("screenState",GAME_CONST.STATES.LOADING);
        this.createBackground();
        this.createLoader();
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.crossOrigin = "anonymous";
        this.load.image('easy', 'assets/images/easy.png');
        this.load.image('medium', 'assets/images/medium.png');
        this.load.image('hard', 'assets/images/hard.png');
        this.load.image('leaderboard', 'assets/images/leaderboard.png');
        this.load.image('back', 'assets/images/back.png');
    },

    create: function() {
    },


    onLoadComplete: function() {
        console.log("Changing state to menu");
        this.game.state.start(GAME_CONST.STATES.MENU);
    },

    createBackground: function() {
        console.log("BG");
        var background = this.add.image(this.game.world.centerX, this.game.world.centerY, 'background');
        background.anchor.setTo(0.5);
    },

    createLoader: function() {
        console.log("Loader");
        this.progressBackground = this.add.sprite(this.game.world.centerX-332, this.game.world.centerY + 346, "progressBackground");
        this.progressBar = this.add.sprite(this.game.world.centerX-332, this.game.world.centerY + 346, "progressBar");
        this.load.setPreloadSprite(this.progressBar);

    }
};