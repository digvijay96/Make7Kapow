"use strict";

var gameOver = function() {
};

gameOver.prototype = {
    preload: function() {
        gameInfo.set("screenState",GAME_CONST.STATES.GAMEOVER);
        this.load.image('leaderboardButton', 'assets/images/leader.png');
        this.load.image('resetButton', 'assets/images/reset.png');
    },

    create: function() {
        this.endSoloGame();
        this.postScoreIfWon();

        var background = this.add.image(gameInfo.get("game").world.centerX, gameInfo.get("game").world.centerY, 'bgColor');
        background.anchor.setTo(0.5);
        this.resultLabel = this.game.add.text(gameInfo.get("game").world.centerX, 394, '', {
            fontSize: '140px',
            fill: '#d85353'
        });
        this.resultLabel.anchor.setTo(0.5);

        this.scoreHeading = this.game.add.text(gameInfo.get("game").world.centerX, 722, 'SCORE', {
            fontSize: '90px',
            fill: '#d95a65'
        });
        this.scoreHeading.anchor.setTo(0.5);
        this.scoreLabel = this.game.add.text(gameInfo.get("game").world.centerX, 828, '', {
            fontSize: '120px',
            fill: '#9a97a6'
        });
        this.scoreLabel.anchor.setTo(0.5);

        this.highscoreHeading = this.game.add.text(gameInfo.get("game").world.centerX, 1028, 'HIGH SCORE', {
            fontSize: '90px',
            fill: '#d95a65'
        });
        this.highscoreHeading.anchor.setTo(0.5);
        this.highscoreLabel = this.game.add.text(gameInfo.get("game").world.centerX, 1140, '', {
            fontSize: '120px',
            fill: '#9a97a6'
        });
        this.highscoreLabel.anchor.setTo(0.5);

        var leaderboardButton = this.add.image(328, 1482, 'leaderboardButton');
        leaderboardButton.anchor.setTo(0.5);
        leaderboardButton.inputEnabled = true;
        leaderboardButton.events.onInputUp.add(function() {
            var parameters = {'metric':'score','interval':'daily'};
            kapow.boards.displayScoreboard(parameters);
        }, this);

        var resetButton = this.add.image(752, 1482, 'resetButton');
        resetButton.anchor.setTo(0.5);
        resetButton.inputEnabled = true;
        resetButton.events.onInputUp.add(function() {
            gameInfo.get("game").state.start(GAME_CONST.STATES.MENU);
        }, this);

        this.fetchHighscore();

        this.updateResultText();

        var backButton = this.add.image(94, 91, 'back');
        backButton.anchor.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputUp.add(function() {
            kapowClientController.handleBackButton();
        }, this);

    },

    fetchHighscore: function () {
        kapowGameStore.get("highScore", function(highScore){
            console.log("In success of fetchHighscore",highScore);
            this.updateHighscore(highScore);
        }.bind(this));
    },

    updateHighscore: function(highscore) {
        if(highscore != null && highscore != undefined) {
            console.log("In updateHighScore ",highscore);
            this.highscoreLabel.text = highscore;
        } else {
            console.log("In else of updateHighscore")
            if(gameInfo.get('won') == true && gameInfo.get("score") != null) {
                this.highscoreLabel.text = gameInfo.get("score");
            } else {
                this.highscoreLabel.text = "-";
            }
        }
    },

    updateResultText: function() {

        if(gameInfo.won == true) {
            this.resultLabel.text = "YOU WIN";
            this.scoreLabel.text = gameInfo.get('score');

        } else {
            this.resultLabel.text = "YOU LOST";
            this.scoreLabel.text = "-";
        }
    },

    endSoloGame: function() {
        kapow.endSoloGame(function(){
            console.log("End solo game success");
        }, function(){
            console.log("End solo game failure");
        });
        // nullify room and empty gameInfo
    },

    postScoreIfWon: function() {
           if(gameInfo.get('won') == true && gameInfo.get("score") != null) {
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