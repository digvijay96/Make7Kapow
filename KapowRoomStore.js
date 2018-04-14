function KapowRoomStore() {
    KapowRoomStore.prototype.get = function(key, successCallback, failureCallback) {
        kapow.roomStore.get(key, function (val) {
            console.log("Fetching roomStore " + key + " data successful", val);
            successCallback && successCallback(val);
        }.bind(this), function (error) {
            console.log("Fetching roomStore " + key + " data failed : ", error);
            failureCallback && failureCallback();
        });
    }

    KapowRoomStore.prototype.set = function(key, param, successCallback, failureCallback) {
        kapow.roomStore.set(key, JSON.stringify(param), function () {
            console.log("Storing roomStore " + key + " data was successful :", param);
            successCallback && successCallback();
        }, function (error) {
            console.log("Storing roomStore " + key + " data Failed : ", error);
            failureCallback && failureCallback();
        });
    }
}

var kapowRoomStore = new KapowRoomStore();
