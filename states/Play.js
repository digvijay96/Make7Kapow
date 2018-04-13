"use strict";

var play = function() {
};

play.prototype = {


    preload: function() {

        this.load.image('board', 'assets/board.png');
        this.load.image('1', 'assets/1.png');
        this.load.image('2', 'assets/2.png');
        this.load.image('3', 'assets/3.png');
        this.load.image('4', 'assets/4.png');
        this.load.image('5', 'assets/5.png');
        this.load.image('6', 'assets/6.png');
        this.load.image('7', 'assets/7.png');

        Math.seedrandom('45');

        this.cellsArray = [];

        this.highlighter = null;
        this.scoreLabel = null;

        this.tileArray = ['1', '2', '3'];

        this.newTilePositionX = 246;
        this.newTilePositionY = 532;

        this.directions = [[1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0], [-1, -1]];
        this.cellsArraySize = 19;
        this.numberSeven = 7;
        this.visitedCells = [];
        this.cellIndicesToBeMerged = [];
        this.numberOfMoves = 0
        this.bottomHexCell = null
    },

    create: function() {
        gameInfo.get("game").physics.startSystem(Phaser.Physics.ARCADE);
        gameInfo.get("game").add.image(80, 100, 'board');
        this.createHexCells();
        this.createNewTile(true);
        this.scoreLabel = this.game.add.text(32, 32, 'Moves: 0', { fontSize: '32px', fill: '#fff' });
    },

    update: function() {
    },

    declareGameEnd: function(didMakeSeven) {
        if (didMakeSeven) {
            gameInfo.set('won', true);
            console.log('YOU WON')
        } else {
            gameInfo.set('won', false);
            console.log('YOU LOST')
        }
    },

    mergeCells: function(destinationIndex) {
        const currentSpriteNumber = parseInt(this.cellsArray[destinationIndex].sprite.key);
        const resultantNumber = currentSpriteNumber + 1;
        const resultantSpriteKey = (resultantNumber).toString();
        const finalXPos = this.cellsArray[destinationIndex].frame[0],
            finalYPos = this.cellsArray[destinationIndex].frame[1];
        const maxTime = 500;
        const defaultSpeed = 60;
        for (var index = 0; index < this.cellIndicesToBeMerged.length; index++) {
            if (this.cellIndicesToBeMerged[index] != destinationIndex ) {
                var cell = this.cellsArray[this.cellIndicesToBeMerged[index]];
                gameInfo.get("game").physics.arcade.enable(cell.sprite);
                gameInfo.get("game").physics.arcade.moveToXY(cell.sprite, finalXPos, finalYPos, defaultSpeed, maxTime)
            }
        }
        setTimeout(function() {
            for (var index = 0; index < this.cellIndicesToBeMerged.length; index++) {
                var cell = this.cellsArray[this.cellIndicesToBeMerged[index]];
                cell.sprite.destroy();
                cell.sprite = null
            }
            var sprite = gameInfo.get("game").add.sprite(finalXPos, finalYPos, resultantSpriteKey);
            sprite.anchor.setTo(0.5, 0.5);
            this.cellsArray[destinationIndex].sprite = sprite;
            if (resultantNumber < this.numberSeven) {
                this.mergeCellsIfRequired(destinationIndex)
            } else {
                this.declareGameEnd(true)
            }
        }.bind(this), maxTime);
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
            this.enableUserIO()
        }
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
            this.createNewTile();
            this.disableUserIO()
            this.mergeCellsIfRequired(matchingIndex);
            this.incrementScore()

        } else {
            sprite.position.setTo(this.newTilePositionX, this.newTilePositionY);
        }

    },

    incrementScore: function() {
        this.numberOfMoves += 1;
        this.scoreLabel.text = 'Moves: ' + this.numberOfMoves;

    },

    removeHighlighter: function() {
        if(this.highlighter != null) {
            this.highlighter.destroy();
            this.highlighter = null;
        }
    },

    onDragUpdate: function(sprite, pointer) {
        var matchingIndex = this.checkMatchingTile(pointer);
        if(matchingIndex !== -1 && this.cellsArray[matchingIndex].spriteObject == null) {
            this.removeHighlighter();
            this.highlighter = gameInfo.get("game").add.image(this.cellsArray[matchingIndex].frame[0], this.cellsArray[matchingIndex].frame[1], '1');
            this.highlighter.anchor.setTo(0.5, 0.5);
        } else {
            this.removeHighlighter();
        }
        sprite.bringToTop();
    },

    checkMatchingTile: function(pointer) {
        for(var index = 0; index < this.cellsArray.length; index++) {
            if((Math.abs(pointer.x - this.cellsArray[index].frame[0]) + Math.abs(pointer.y - this.cellsArray[index].frame[1]) < 30) &&
                this.cellsArray[index].sprite == null) {
                return index;
            }
        }
        return -1;
    },

    createNewTile: function() {
        this.newTileType = this.tileArray[Math.floor(Math.random() * 3)];
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


    createHexCells: function() {
            this.cellsArray.push(createCellObject([-2,-2], [188, 150], null));
            this.cellsArray.push(createCellObject([0,-2], [252, 150], null));
            this.cellsArray.push(createCellObject([2,-2], [316, 150], null));
            this.cellsArray.push(createCellObject([-3,-1], [156, 206], null));
            this.cellsArray.push(createCellObject([-1,-1], [220, 206], null));
            this.cellsArray.push(createCellObject([1,-1], [284, 206], null));
            this.cellsArray.push(createCellObject([3,-1], [348, 206], null));
            this.cellsArray.push(createCellObject([-4,0], [124, 262], null));
            this.cellsArray.push(createCellObject([-2,0], [188, 262], null));
            this.cellsArray.push(createCellObject([0,0], [252, 262], null));
            this.cellsArray.push(createCellObject([2,0], [316, 262], null));
            this.cellsArray.push(createCellObject([4,0], [380, 262], null));
            this.cellsArray.push(createCellObject([-3,1], [156, 318], null));
            this.cellsArray.push(createCellObject([-1,1], [220, 318], null));
            this.cellsArray.push(createCellObject([1,1], [284, 318], null));
            this.cellsArray.push(createCellObject([3,1], [348, 318], null));
            this.cellsArray.push(createCellObject([-2,2], [188, 374], null));
            this.cellsArray.push(createCellObject([0,2], [252, 374], null));
            this.cellsArray.push(createCellObject([2,2], [316, 374], null));
    }
}