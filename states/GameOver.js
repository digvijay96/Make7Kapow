"use strict";

var gameOver = function(game) {
};

gameOver.prototype = {
    preload: function() {
        this.load.image('won', 'assets/you-won.png');
        this.load.image('lost', 'assets/you-lose.png');
    },

    create: function() {
        if(gameInfo.get('won') == true) {
            this.game.add.image(100, 100, 'won');
        } else {
            this.game.add.image(100, 100, 'lost');
        }
    }
};