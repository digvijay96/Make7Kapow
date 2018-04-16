var mysql = require('mysql');
var game = {
    postScore: function(obj) {
        var playerId = kapow.getPlayerId();
        var score = {
            "playerId":playerId,
            "scores": obj
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