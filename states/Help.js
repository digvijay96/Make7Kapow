"use strict";

var help = function(game) {
};

help.prototype = {
    preload: function() {
        gameInfo.set("screenState",GAME_CONST.STATES.HELP);
        this.load.crossOrigin = 'anonymous';
    },

    create: function() {

        var instructions = this.add.image(gameInfo.get("game").world.centerX, gameInfo.get("game").world.centerY, 'instructions');
        instructions.anchor.setTo(0.5);

        var backButton = this.add.image(94, 91, 'back');
        backButton.anchor.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputUp.add(function() {
            kapowClientController.handleBackButton();
        }, this);

    }
};