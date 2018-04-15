"use strict";

var play = function() {
};

play.prototype = {

    preload: function() {

        gameInfo.set("screenState",GAME_CONST.STATES.PLAY);
        // Math.seedrandom('45');

        this.load.image('board', 'assets/images/base.png');
        this.load.image('1', 'assets/images/1.png');
        this.load.image('2', 'assets/images/2.png');
        this.load.image('3', 'assets/images/3.png');
        this.load.image('4', 'assets/images/4.png');
        this.load.image('5', 'assets/images/5.png');
        this.load.image('6', 'assets/images/6.png');
        this.load.image('7', 'assets/images/7.png');
        this.load.image('highlighter', 'assets/images/highlighter.png');

        this.cellsArray = [];

        this.highlighter = null;
        this.scoreLabel = null;

        this.tileArray = ['1', '2', '3', '4'];

        this.newTilePositionX = this.world.centerX;
        this.newTilePositionY = 1632;

        this.directions = [[1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0], [-1, -1]];
        this.cellFrames = [[347, 542], [543, 542], [739, 542], [249, 710], [445, 710], [641, 710], [837, 710],
            [152, 876], [348, 876], [544, 876], [737, 876], [931, 876], [249, 1043], [445, 1043], [641, 1043], [834, 1043],
            [347, 1210], [543, 1210], [739, 1210]];
        this.cellIndices = [[-2,-2],[0,-2],[2,-2],[-3,-1],[-1,-1],[1,-1],[3,-1],[-4,0],[-2,0],[0,0],[2,0],[4,0],[-3,1],[-1,1],[1,1],[3,1],[-2,2],[0,2],[2,2]];
        this.cellsArraySize = 19;
        this.numberSeven = 7;
        this.visitedCells = [];
        this.cellIndicesToBeMerged = [];
        this.numberOfMoves = 0;
        this.bottomHexCell = null;
        this.maxNumberForNewTile = 3;
        this.spriteKeyForNULLValue = '0';
        this.defaultDifficultyLevel = GAME_CONST.DIFFICULTY_LEVEL.EASY;
        
        this.tweensArray = [];
        this.mergeFinalX = null;
        this.mergeFinalY = null;
        this.mergeDestinationIndex = null;
        this.mergeResultantNumber = null
    },

    create: function() {
        gameInfo.get("game").physics.startSystem(Phaser.Physics.ARCADE);
        var background = this.add.image(gameInfo.get("game").world.centerX, gameInfo.get("game").world.centerY, 'background');
        background.anchor.setTo(0.5);

        var backButton = this.add.image(94, 91, 'back');
        backButton.anchor.setTo(0.5);
        backButton.inputEnabled = true;
        backButton.events.onInputUp.add(function() {
            kapowClientController.handleBackButton();
        }, this);
        var board = gameInfo.get("game").add.image(this.world.centerX, 875, 'board');
        board.anchor.setTo(0.5);
        this.createHexCells();
        this.createNewTile(true);
        this.scoreLabel = this.game.add.text(gameInfo.get("game").world.centerX, 92, '0', { fontSize: '140px', fill: '#9a97a6'});
        this.scoreLabel.anchor.setTo(0.5);
        this.restoreRoomState();
    },

    restoreRoomState: function() {
        var isNewGame = gameInfo.get(GAME_CONST.IS_NEW_GAME)
        if(isNewGame == null || isNewGame == undefined || isNewGame == true) {
            return
        }
        this.disableUserIO()

        kapowRoomStore.get(GAME_CONST.ROOM_STORE.MOVES_COUNT, function(movesCount) {
            if(!movesCount) {
                this.numberOfMoves = 0
            } else {
                this.numberOfMoves = parseInt(movesCount)
            }
            this.updateScore(false);
            console.log('restored' + GAME_CONST.ROOM_STORE.MOVES_COUNT + ': ' + this.numberOfMoves)
        }.bind(this));

        kapowRoomStore.get(GAME_CONST.ROOM_STORE.MAX_NUMBER_UNLOCKED, function(maxNumberUnlocked) {
            if (!maxNumberUnlocked) {
                this.maxNumberForNewTile = 3
            } else {
                this.maxNumberForNewTile = parseInt(maxNumberUnlocked)
            }
            console.log('restored' + GAME_CONST.ROOM_STORE.MAX_NUMBER_UNLOCKED + ': ' + this.maxNumberForNewTile)
        }.bind(this));

        kapowRoomStore.get(GAME_CONST.ROOM_STORE.DIFFICULTY_LEVEL, function(difficultyLevel) {
            if (!difficultyLevel) {
                gameInfo.set(GAME_CONST.DIFFICULTY_LEVEL, this.defaultDifficultyLevel);
                kapowRoomStore.set(GAME_CONST.ROOM_STORE.DIFFICULTY_LEVEL, this.defaultDifficultyLevel)
            } else {
                gameInfo.set(GAME_CONST.DIFFICULTY_LEVEL_KEY, difficultyLevel)
            }
            console.log('restored' + GAME_CONST.ROOM_STORE.DIFFICULTY_LEVEL + ': ' + gameInfo.get('difficultyLevel'))

        }.bind(this));

        kapowRoomStore.get(GAME_CONST.ROOM_STORE.HEX_CELL_SPRITE_KEYS, function(keysString) {
            if (keysString != null) {
                var keysArray = JSON.parse(keysString);
                for(var index = 0 ; index < keysArray.length; index++) {
                    if (keysArray[index] != this.spriteKeyForNULLValue) {
                        this.setSpriteForHexCellWithKeyAndIndex(keysArray[index], index)
                        console.log('restoring sprite with key :(' + keysArray[index] + ') at index: ' + index )
                    }
                }
            }
            this.enableUserIO()

        }.bind(this), function() {
            this.enableUserIO()
        })
    },

    persistRoomState: function() {
        kapowRoomStore.set(GAME_CONST.ROOM_STORE.MOVES_COUNT, this.numberOfMoves);
        kapowRoomStore.set(GAME_CONST.ROOM_STORE.MAX_NUMBER_UNLOCKED,this.maxNumberForNewTile);

        var spriteKeys = [];
        for(var index = 0 ; index < this.cellsArray.length ; index++) {
            var sprite = this.cellsArray[index].sprite;
            if (sprite != null) {
                spriteKeys.push(sprite.key);
            } else {
                spriteKeys.push(this.spriteKeyForNULLValue);
            }
        }
        kapowRoomStore.set(GAME_CONST.ROOM_STORE.HEX_CELL_SPRITE_KEYS, spriteKeys);
    },

    setSpriteForHexCellWithKeyAndIndex: function(spriteKey, index) {
        var xPosition = this.cellsArray[index].frame[0],
            yPosition = this.cellsArray[index].frame[1];
        this.cellsArray[index].sprite = this.game.add.sprite(xPosition, yPosition, spriteKey);
        this.cellsArray[index].sprite.anchor.setTo(0.5, 0.5)
        this.cellsArray[index].sprite.inputEnabled = false
    },

    update: function() {
    },

    endGamePlay: function(didMakeSeven) {
        if(didMakeSeven == true) {
            for (var index = 0; index < this.cellsArray.length; index++) {
                var cell = this.cellsArray[index];
                if (index != this.numberSevenIndex && cell.sprite != null) {
                    cell.sprite.alpha = 0.4
                }
            }
            setTimeout(function() {
                console.log("switching to GameOver state after victory");
                GameManager.startState(GAME_CONST.STATES.GAMEOVER);
            }, GAME_CONST.END_GAME_PLAY_DELAY);
        } else {
            setTimeout(function() {
            console.log("switching to GameOver state after loss");
            GameManager.startState(GAME_CONST.STATES.GAMEOVER);
        }, GAME_CONST.END_GAME_PLAY_DELAY);
    },

    declareGameEnd: function(didMakeSeven) {
        if (didMakeSeven) {
            this.game.state.states.Loading.winning.play();
            this.game.state.states.Loading.winning.volume = 5;
            gameInfo.set('won', true);
            console.log('YOU WON')
        } else {
            gameInfo.set('won', false);
            console.log('YOU LOST')
        }
        gameInfo.set('score', this.numberOfMoves);
        this.endGamePlay(didMakeSeven)
    },

    endMergeAnimation: function() {
        var canEndAnimation = true
        for(var index = 0; index < this.tweensArray.length && canEndAnimation; index++) {
            if (this.tweensArray[index].isRunning) {
                canEndAnimation = false
            }
        }
        if (canEndAnimation) {
            for (var index = 0; index < this.cellIndicesToBeMerged.length; index++) {
                var cell = this.cellsArray[this.cellIndicesToBeMerged[index]];
                cell.sprite.destroy();
                cell.sprite = null
            }
            var resultantSpriteKey = this.mergeResultantNumber.toString();

            var sprite = gameInfo.get("game").add.sprite(this.mergeFinalX, this.mergeFinalY, resultantSpriteKey);
            sprite.anchor.setTo(0.5, 0.5);
            this.cellsArray[this.mergeDestinationIndex].sprite = sprite;
            if (this.mergeResultantNumber < this.numberSeven) {
                this.mergeCellsIfRequired(this.mergeDestinationIndex)
            } else {
                this.declareGameEnd(true)
            }
        }
    },

    mergeCells: function(destinationIndex) {
        const currentSpriteNumber = parseInt(this.cellsArray[destinationIndex].sprite.key);
        const resultantNumber = currentSpriteNumber + 1;
        this.updateMaxNumberReached(resultantNumber);

        const resultantSpriteKey = (resultantNumber).toString();
        const finalXPos = this.cellsArray[destinationIndex].frame[0],
            finalYPos = this.cellsArray[destinationIndex].frame[1];

        this.mergeDestinationIndex = destinationIndex;
        this.mergeFinalX = finalXPos;
        this.mergeFinalY = finalYPos;
        this.mergeResultantNumber = resultantNumber;
        this.tweensArray = []

        const maxTime = 400;
        const defaultSpeed = 60;
        for (var index = 0; index < this.cellIndicesToBeMerged.length; index++) {
            if (this.cellIndicesToBeMerged[index] != destinationIndex ) {
                var cell = this.cellsArray[this.cellIndicesToBeMerged[index]];

                gameInfo.get("game").physics.arcade.enable(cell.sprite);
                var moveTween = gameInfo.get("game").add.tween(cell.sprite).to({x: finalXPos, y: finalYPos}, maxTime, Phaser.Easing.Linear.None);
                moveTween.onComplete.add(function() { this.endMergeAnimation() }.bind(this));
                this.tweensArray.push(moveTween)

                var fadeTween = gameInfo.get("game").add.tween(cell.sprite).to({ alpha: 0.9 }, maxTime, Phaser.Easing.Linear.None);
                fadeTween.onComplete.add(function() { this.endMergeAnimation() }.bind(this));
                this.tweensArray.push(fadeTween);
                moveTween.start();
                fadeTween.start();
            }
        }
    },

     getHexCellForIndex: function(x, y) {
        if (Math.abs(x) + Math.abs(y) > 4) {
            return -1
        }
        for(var index = 0 ; index < this.cellsArray.length; index++) {
            if (this.cellsArray[index].key[0] == x &&  this.cellsArray[index].key[1] == y) {
                return index
            }
        }
        return -1
    },

    evaluateCellsToBeMerged: function(currentIndex, matchingKey) {
        this.visitedCells[currentIndex] = true;
        if (this.cellsArray[currentIndex].sprite == null || this.cellsArray[currentIndex].sprite.key != matchingKey) {
            return;
        }
        this.cellIndicesToBeMerged.push(currentIndex);
        for(var index = 0; index < this.directions.length; index++) {
            var newXPos = this.cellsArray[currentIndex].key[0] + this.directions[index][0],
                newYPos = this.cellsArray[currentIndex].key[1] + this.directions[index][1] ;
            var neighbourCellIndex = this.getHexCellForIndex(newXPos, newYPos);
            if (neighbourCellIndex != -1 && !this.visitedCells[neighbourCellIndex]) {
                this.evaluateCellsToBeMerged(neighbourCellIndex, matchingKey);
            }
        }
    },

    mergeCellsIfRequired: function(startIndex) {
        this.visitedCells = Array(this.cellsArraySize).fill(false);
        this.cellIndicesToBeMerged = [];
        this.evaluateCellsToBeMerged(startIndex, this.cellsArray[startIndex].sprite.key);
        if (this.cellIndicesToBeMerged.length >= 3) {
            this.mergeCells(startIndex);
        } else {
            this.prepareForNextMove()
        }
    },

    checkIfUserLost: function() {
        var didUserLose = true;
        for(var index = 0; index < this.cellsArray.length && didUserLose ; index++) {
            if (this.cellsArray[index].sprite == null) {
                didUserLose = false;
            }
        }
        if (didUserLose) {
           this.declareGameEnd(false);
        }
    },

    prepareForNextMove: function() {
        this.checkIfUserLost()
        this.persistRoomState()
        this.enableUserIO()
    },

    onDragUpdate: function(sprite, pointer) {
        var matchingIndex = this.checkMatchingTile(pointer);
        if(matchingIndex !== -1 && this.cellsArray[matchingIndex].spriteObject == null) {
            this.removeHighlighter();
            this.highlighter = gameInfo.get("game").add.image(this.cellsArray[matchingIndex].frame[0], this.cellsArray[matchingIndex].frame[1], 'highlighter');
            this.highlighter.anchor.setTo(0.5, 0.5);
        } else {
            this.removeHighlighter();
        }
        sprite.bringToTop();
    },

    onDragStop: function(sprite, pointer) {

        var xPosition = this.newTilePositionX, yPosition = this.newTilePositionY;
        this.removeHighlighter();

        var matchingIndex = this.checkMatchingTile(pointer);
        if(matchingIndex !== -1 && this.cellsArray[matchingIndex].sprite == null) {
            xPosition = this.cellsArray[matchingIndex].frame[0];
            yPosition = this.cellsArray[matchingIndex].frame[1];
            this.cellsArray[matchingIndex].sprite = sprite;
        }

        if(xPosition != this.newTilePositionX && yPosition != this.newTilePositionY) {
            sprite.position.setTo(xPosition, yPosition);
            sprite.input.draggable = false;
            this.game.state.states.Loading.tileDrop.play();
            this.game.state.states.Loading.tileDrop.volume = 5;
            this.createNewTile();
            this.disableUserIO()
            this.updateScore()
            this.mergeCellsIfRequired(matchingIndex);

        } else {
            var moveTween = gameInfo.get("game").add.tween(sprite).to({x: this.newTilePositionX, y: this.newTilePositionY}, 200, Phaser.Easing.Linear.None);
            moveTween.start()
        }
    },

    updateScore: function(shouldIncrement) {
        if (shouldIncrement === undefined || shouldIncrement === null) {
            shouldIncrement = true;
        }
        if (shouldIncrement) {
            this.numberOfMoves += 1;
        }
        this.scoreLabel.text = this.numberOfMoves.toString();
    },

    removeHighlighter: function() {
        if(this.highlighter != null) {
            this.highlighter.destroy();
            this.highlighter = null;
        }
    },

    checkMatchingTile: function(pointer) {
        for(var index = 0; index < this.cellsArray.length; index++) {
            if((Math.abs(pointer.x - this.cellsArray[index].frame[0]) + Math.abs(pointer.y - this.cellsArray[index].frame[1]) < 100) &&
                this.cellsArray[index].sprite == null) {
                return index;
            }
        }
        return -1;
    },

    updateMaxNumberReached: function(currentNumber) {
        if (gameInfo.get(GAME_CONST.DIFFICULTY_LEVEL_KEY) == GAME_CONST.DIFFICULTY_LEVEL.EASY) {
            if (currentNumber >= 4) {
                this.maxNumberForNewTile = 4;
            }
        } else if (gameInfo.get(GAME_CONST.DIFFICULTY_LEVEL_KEY) == GAME_CONST.DIFFICULTY_LEVEL.MEDIUM) {
            if (currentNumber >= 6) {
                this.maxNumberForNewTile = 4;;
            }
        }
    },

    createNewTile: function() {
        this.newTileNumber = Math.floor(Math.random() * this.maxNumberForNewTile) + 1

        this.newTileType = this.tileArray[this.newTileNumber - 1];
        this.bottomHexCell = this.game.add.sprite(this.newTilePositionX, this.newTilePositionY, this.newTileType);
        this.bottomHexCell.anchor.setTo(0.5, 0.5);
        this.bottomHexCell.inputEnabled = true;
        this.bottomHexCell.input.enableDrag(true);
        this.bottomHexCell.events.onDragStop.add(this.onDragStop, this);
        this.bottomHexCell.events.onDragUpdate.add(this.onDragUpdate, this);
    },

    disableUserIO: function() {
        if (this.bottomHexCell != null) {
            this.bottomHexCell.inputEnabled = false
        }
    },

    enableUserIO: function() {
        if (this.bottomHexCell != null) {
            this.bottomHexCell.inputEnabled = true
        }
    },

    createHexCells: function() {
        for(var i = 0; i < this.cellIndices.length; i++) {
            this.cellsArray.push(createCellObject(this.cellIndices[i], this.cellFrames[i], null));
        }
    }
};