function KapowGameStore() {
    KapowGameStore.prototype.get = function(key, successCallback, failureCallback) {
        kapow.gameStore.get(key, function (val) {
            console.log("Fetching gameStore " + key + " data successful", val);
            successCallback && successCallback(val);
        }.bind(this), function (error) {
            console.log("Fetching gameStore " + key + " data failed : ", error);
            failureCallback && failureCallback();
        });
    }

    KapowGameStore.prototype.set = function(key, param, successCallback, failureCallback) {
        kapow.gameStore.set(key, JSON.stringify(param), function () {
            console.log("Storing gameStore " + key + " data was successful :", param);
            successCallback && successCallback();
        }, function (error) {
            console.log("Storing gameStore " + key + " data Failed : ", error);
            failureCallback && failureCallback();
        });
    }
}

var kapowGameStore = new KapowGameStore();
