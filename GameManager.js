    let GameManager = {
    startGame() {
        this.startState(GAME_CONST.STATES.BOOT);
    },
    startState(state) {
    	gameInfo.set("screenState",GAME_CONST.STATES.BOOT);
        gameInfo.get("game").state.start(state);
    },
    resetGameState() {
        this._resetRoom();
        GameManager.startState(GAME_CONST.STATES.LOADING);
    },
    _resetRoom() {
       kapow.unloadRoom(function () {
            console.log('Room Successfully Unloaded');
        }, function () {
            console.log('Room Unloading Failed');
        });
        gameInfo.setBulk({
        /*    "gameResume": false,
            "room": null,
            "playerMark": GAME_CONST.TURN.NONE,
            "gameType": null,
            "botLevel": -1,
            "boardStatus": {cells: Array.from({length: GAME_CONST.GRID.CELL_COUNT}, (v, k) => undefined)},
            "opponentData": undefined,
            "turnOfPlayer": undefined,
            "gameOver": false,
            "win": 0,
            "gameLayoutLoaded": false,
            "winType": null,
            "markSet": false*/
            //Update all the keys that are present in game info.
        });
    }
};