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
        this.load.image('help', 'assets/images/help.png');
        this.load.image('instructions', 'assets/images/instructions.png')
        this.load.audio('tileDrop', 'assets/audio/TileDrop.mp3');
        this.load.audio('winning', 'assets/audio/Winning.mp3');
    },

    create: function() {
    },


    onLoadComplete: function() {
        console.log("Changing state to menu");
        this.tileDrop = this.game.add.audio('tileDrop');
        this.winning = this.game.add.audio('winning');
        this.game.sound.setDecodedCallback([this.tileDrop,this.winning], this._start, this);
    },

    _start: function() {
        this.ready = true;
        var isNewGame = gameInfo.get(GAME_CONST.IS_NEW_GAME)
            if (isNewGame != null && isNewGame != undefined && isNewGame == false ) {
                this.game.state.start(GAME_CONST.STATES.PLAY);
            } else {
                this.game.state.start(GAME_CONST.STATES.MENU);
            }
    },

    createBackground: function() {
        console.log("BG");
        var background = this.add.image(this.game.world.centerX, this.game.world.centerY, 'background');
        background.anchor.setTo(0.5);

        var scoreHeading = this.game.add.text(gameInfo.get("game").world.centerX, 624, 'AGGREGO', {
            fontSize: '140px',
            fill: '#db6d76'
        });
        scoreHeading.anchor.setTo(0.5);
    },

    createLoader: function() {
        console.log("Loader");
        this.progressBackground = this.add.sprite(this.game.world.centerX-332, this.game.world.centerY + 346, "progressBackground");
        this.progressBar = this.add.sprite(this.game.world.centerX-332, this.game.world.centerY + 346, "progressBar");
        this.load.setPreloadSprite(this.progressBar);
    }
};