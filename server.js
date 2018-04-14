var mysql = require('mysql');
var game = {
    onMessageDelivered: function (data) {
        console.log("SERVER onMessageDelivered - " + JSON.stringify(data));
    },
    postScore: function(obj) {
        var score = obj.score;
        var playerId = kapow.getPlayerId();
        var score = {
            "playerId":playerId,
            "scores": {
                'score' : score
            }
        };
        console.log("archit",score);
        kapow.boards.postScores(score, function() {
            console.log("SUCCESS : Score Posting");
            kapow.return(obj);
        },
        function(error) {
            console.log("FAILURE : Score Posting",error);
            kapow.return(null, error);
        });
    }
};