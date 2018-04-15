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
        this.setupUIElementsAndHandlers()
        this.endSoloGame();
        this.postScores();
        this.updateResultText();
        this.fetchHighscore();
    },

    setupUIElementsAndHandlers: function() {
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
        this.highscoreLabel = this.game.add.text(gameInfo.get("game").world.centerX, 1140, '-', {
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

        var backButton = this.add.image(94, 91, 'back');
        backButton.anchor.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputUp.add(function() {
            kapowClientController.handleBackButton();
        }, this);
    },

    updateResultText: function() {
        if(gameInfo.get('won') == true) {
            this.resultLabel.text = "YOU WIN";
            this.scoreLabel.text = gameInfo.get('score');

        } else {
            this.resultLabel.text = "YOU LOST";
            this.scoreLabel.text = "-";
        }
    },

    updateHighscore: function(highscore) {
        if(highscore != null && highscore != undefined && highscore != NaN) {
            console.log("In updateHighScore ",highscore);
            this.highscoreLabel.text = highscore;
        } else {
            this.highscoreLabel.text = "-";
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

    postScores: function() {
       if(gameInfo.get('won') == true && gameInfo.get("score") != null) {
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

    didUserWin: function() {
        var didUserWin = gameInfo.get('won');
        if (didUserWin != null && didUserWin != undefined) {
            return didUserWin;
        }
        return false;
    },

    fetchHighscore: function () {
        kapowGameStore.get("highScore", function(highScore){
            console.log("In success of fetchHighscore",highScore);
            if (this.didUserWin() == true ) {
                var actualHighScore = gameInfo.get("score");
                if(highScore == null || highScore == undefined) {
                    console.log('High not found in gameStore for user win: null')
                    kapowGameStore.set("highScore", gameInfo.get("score"));

                } else {
                    console.log('High score found in gameStore for user win: ', highScore)
                    if (parseInt(gameInfo.get("score")) < parseInt(highScore)) {
                        console.log('Updating highScore in gameStore to: ', gameInfo.get("score"))
                        kapowGameStore.set("highScore", gameInfo.get("score"));

                    } else {
                        console.log("using gameStore highScore for UI:",highScore)
                        actualHighScore = highScore;
                    }
                }
                this.updateHighscore(actualHighScore);
            } else {
                this.updateHighscore(highScore);
            }
        }.bind(this), function() {
            console.log("Failed to fetch highScore from gameStore")
            if (this.didUserWin() == true) {
                this.updateHighscore(gameInfo.get('score'));
            } else {
                this.updateHighscore();
            }
        }.bind(this));
    },
};