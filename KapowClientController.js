class KapowClientController {
    handleOnLoad(room) {
        gameInfo.set("room", room);
        this._initialiseStats();
        this._loadScreen();
    }