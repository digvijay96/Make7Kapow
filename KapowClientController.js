class KapowClientController {
    handleOnLoad(room) {
        this._loadScreen();
    }

    _loadScreen() {
        console.log("Loading Player Info");
        kapow.getUserInfo(function (user) {
            console.log("Client getUserInfoSuccess - User: " + JSON.stringify(user));
            gameInfo.set("playerData", user.player);
            console.log("Game about to be started.");
            GameManager.startGame();
        }, function (error) {
            console.log("Client getUserInfo failure", error);
        });
    }