"use strict";

var loading = function(game) {
};

loading.prototype = {
    preload: function() {
        this.game.load.image('cell', 'assets/play-button.png');
    },

    create: function() {
        var playImage = this.game.add.image(100, 100, 'cell');
        playImage.inputEnabled = true;
        playImage.events.onInputDown.add(this.listener, this);
    },

    listener: function() {
        this.game.state.start("Play");
    }
}