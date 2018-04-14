"use strict";

var gameOver = function() {
};

gameOver.prototype = {
    preload: function() {
        gameInfo.set("screenState",GAME_CONST.STATES.GAMEOVER);
        this.load.image('won', 'assets/you-won.png');
        this.load.image('lost', 'assets/you-lose.png');
        this.load.image('cell', 'assets/play-button.png');

    },

    create: function() {
        this.endSoloGame();
        this.postScoreIfWon();

        var playImage = gameInfo.get("game").add.image(this.game.world.centerX, this.game.world.centerY, 'cell');
        playImage.anchor.setTo(0.5);
        playImage.scale.setTo(4);

        playImage.inputEnabled = true;
        playImage.events.onInputDown.add(this.listener, this);
    },

     listener: function() {
        var parameters = {'metric':'score','interval':'daily'};
          kapow.boards.displayScoreboard(parameters)
       // this.game.state.start("Play");
    },

    endSoloGame: function() {
        kapow.endSoloGame(function(){
            console.log("End solo game success");
        }, function(){
            console.log("End solo game failure");
        });
    },

    postScoreIfWon: function() {
           if(gameInfo.get('won') == true) {
                this.checkIfHighScoreAndSave();
                kapow.invokeRPC('postScore', {"score": gameInfo.get("score")}, function() {
                    console.log("Success Posting Score");
            }, function(error) {
                console.log("Failure Posting score", error);
            });
                gameInfo.get("game").add.image(100, 100, 'won');
            } else {
                gameInfo.get("game").add.image(100, 100, 'lost');
            }
    },

    checkIfHighScoreAndSave: function(){
        kapowGameStore.get("highScore", function(highScore){
            if (!highScore) {
                  kapowGameStore.set("highScore", gameInfo.get("score"));
            console.log("HighScore initialized",kapowGameStore.get("highScore"));
            } else if(highScore < gameInfo.get("score")) {
                kapowGameStore.set("highScore", gameInfo.get("score"));
                console.log("HighScore updated",kapowGameStore.get("highScore"));
            }
        });
    }
};