"use strict";

var menu = function(game) {
};

menu.prototype = {
    preload: function() {
        this.game.load.spritesheet('cell', 'assets/images/cell.png', 160, 160, 2);
    },

    create: function() {
        this.game.state.start("Play");
    }
}