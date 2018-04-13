    let GameManager = {
    startGame() {
        this.startState(GAME_CONST.STATES.BOOT);
    },
    startState(state) {
        gameInfo.get("game").state.start(state);
    }
};