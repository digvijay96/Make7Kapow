"use strict";

(function() {
    var game = new Phaser.Game(500, 600, Phaser.AUTO, 'Make7');

    game.state.add("Boot", boot);
    game.state.add("Loading", loading);
    game.state.add("Menu", menu);
    game.state.add("Play", play);
<<<<<<< Updated upstream
    game.state.add("GameOver", gameOver);
    game.state.start("Boot");

=======
    // game.state.add("GameOver", gameOver);
    gameInfo.set("game",game);
>>>>>>> Stashed changes
}());