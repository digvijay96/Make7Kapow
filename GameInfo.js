
function GameInfoStore() { // TODO : do we actually need to initialize null values ? if value is not present it will be returned as `undefined`
    this.room = null;
    this.gameType = null;
}

GameInfoStore.prototype.get = function (key) {
	console.log(temp);
    return this[key];
};

GameInfoStore.prototype.set = function (key, val) {
    this[key] = val;
};

GameInfoStore.prototype.setBulk = function (arg) {
    for (let key in arg) {
        this[key] = arg[key];
    }
};

var gameInfo = new GameInfoStore();
