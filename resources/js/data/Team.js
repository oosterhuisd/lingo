class Team {

    constructor(name, player1, player2) {
        this.name = name;
        this.score = 0;
        this.players = [player1, player2];
        this.puzzlesCompleted =  0;
        this.greenBallsDrawn = 0;
    }

}
export default Team;
