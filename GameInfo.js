
function GameInfoStore() { // TODO : do we actually need to initialize null values ? if value is not present it will be returned as `undefined`
    this.room = null;
    this.gameType = null;
    this.won = false;
    this.game = null;
    this.score = null;
    this.screenState = null;
    this.difficulty_level = null;
}

GameInfoStore.prototype.get = function (key) {
    return this[key];
};

GameInfoStore.prototype.set = function (key, val) {
    this[key] = val;
};

GameInfoStore.prototype.setBulk = function (arg) {
    for (var key in arg) {
        this[key] = arg[key];
    }
};

var gameInfo = new GameInfoStore();
