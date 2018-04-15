"use strict";

var menu = function(game) {
};

menu.prototype = {
    preload: function() {
  		gameInfo.set("screenState",GAME_CONST.STATES.MENU);
    },

    create: function() {
        console.log("Menu state");
        var background = gameInfo.get("game").add.image(this.game.world.centerX, this.game.world.centerY, 'background');
        background.anchor.setTo(0.5);
        var easyButton = gameInfo.get("game").add.image(this.game.world.centerX, 1004, 'easy');
        easyButton.anchor.setTo(0.5);
        var mediumButton = gameInfo.get("game").add.image(this.game.world.centerX, 1184, 'medium');
        mediumButton.anchor.setTo(0.5);
        var hardButton = gameInfo.get("game").add.image(this.game.world.centerX, 1364, 'hard');
        hardButton.anchor.setTo(0.5);
        var leaderboardButton = gameInfo.get("game").add.image(this.game.world.centerX, 1544, 'leaderboard');
        leaderboardButton.anchor.setTo(0.5);

        easyButton.inputEnabled = true;
        easyButton.events.onInputUp.add(function() {
            this.startGameWithDifficultyLevel(GAME_CONST.DIFFICULTY_LEVEL.EASY);
        }, this);

        mediumButton.inputEnabled = true;
        mediumButton.events.onInputUp.add(function() {
            this.startGameWithDifficultyLevel(GAME_CONST.DIFFICULTY_LEVEL.MEDIUM);
        }, this);

        hardButton.inputEnabled = true;
        hardButton.events.onInputUp.add(function() {
            this.startGameWithDifficultyLevel(GAME_CONST.DIFFICULTY_LEVEL.HARD);
        }, this);

        leaderboardButton.inputEnabled = true;
        leaderboardButton.events.onInputUp.add(function() {
            var parameters = {'metric':'score','interval':'daily'};
            kapow.boards.displayScoreboard(parameters);
        }, this);

        var backButton = this.add.image(94, 91, 'back');
        backButton.anchor.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputUp.add(function() {
            kapowClientController.handleBackButton();
        }, this);

    },

    startGameWithDifficultyLevel: function(difficultyLevel) {
    	GameManager.startGameWithDifficulty(difficultyLevel);
    }
};