"use strict";

(function() {
    var game = new Phaser.Game(1080, 1920, Phaser.AUTO, 'aggrego');

    game.state.add("Boot", boot);
    game.state.add("Loading", loading);
    game.state.add("Menu", menu);
    game.state.add("Play", play);
    game.state.add("GameOver", gameOver);
    gameInfo.set("game",game);
}());