const Application = PIXI.Application;

const app = new Application({
    transparent: false,
    antialias: true
});

app.renderer.backgroundColor = 0x23395D;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view)

//text header
const style = new PIXI.TextStyle({
    fontFamily: 'Montserrat',
    fontSize: 48,
    fill: 'deepskyblue',
    stroke: '#ffffff',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowDistance: 10,
    dropShadowAngle: Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor: '#000000'
});

const myText = new PIXI.Text('Tic Tac Toe', style);
myText.position.set(380, 100);
app.stage.addChild(myText);

//data
const data = {
    start: { x: 200, y: 200 },
    size: { x: 200, y: 200 },
    amount: { x: 3, y: 3 }
}

const AI = 'O';
const Player = 'X';

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

var cells;
var currentField;

//visual
const Graphics = PIXI.Graphics;
const container = new PIXI.Container();
app.stage.addChild(container);
start();

function start() {
    cells = new Array(data.amount.x * data.amount.y);//array to hold cells
    currentField = Array.from(Array(9).keys());

    // add cells to container
    for (let i = 0; i < data.amount.x * data.amount.y; i++) {
        const cell = new Graphics();
        cells[i] = cell;
        cell.beginFill(0xAA33BB)
            .lineStyle(4, 0xFFEA00, 1)
            .drawRect(data.start.x + data.size.x * (i % data.amount.x), data.start.y + data.size.y * Math.floor(i / data.amount.x), data.size.x, data.size.y)
            .endFill();
        cell.Text = i;
        cell.interactive = true;
        cell.buttonMode = true;
        cell.on('pointerdown', function () {
            if (!isNaN(currentField[cell.Text])) {
                turn(cell.Text, Player)
                if (!checkWin(currentField, Player) && !checkTie()) turn(bestSpot(), AI);
            }
        });

        container.addChild(cell);
    }
}

function addCross(index) {
    //draw cross
    var i = index % data.amount.x
    var j = Math.floor(index / data.amount.x)
    const line1 = new Graphics();
    line1.lineStyle(5, 0xFFEA00, 1)
        .moveTo(data.start.x + data.size.x * i, data.start.y + data.size.y * j)
        .lineTo(data.start.x + data.size.x * (i + 1), data.start.y + data.size.y * (j + 1));
    cells[index].addChild(line1);

    const line2 = new Graphics();
    line2.lineStyle(5, 0xFFEA00, 1)
        .moveTo(data.start.x + data.size.x * i, data.start.y + data.size.y * (j + 1))
        .lineTo(data.start.x + data.size.x * (i + 1), data.start.y + data.size.y * j);
    cells[index].addChild(line2);
}

function addTorus(index) {
    //drow torus
    const torus = new Graphics();
    const thickness = 10;
    torus.beginFill(0xFFEA00)
        .drawTorus(data.start.x + data.size.x * (index % data.amount.x + 0.5), data.start.y + data.size.y * (Math.floor(index / data.amount.x) + 0.5), data.size.x / 2 - thickness, data.size.x / 2)
        .endFill();
    cells[index].addChild(torus);
}

function declareWinner(text) {
    const style1 = new PIXI.TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 100,
        fill: 'deepskyblue',
        stroke: '#ffffff',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowDistance: 10,
        dropShadowAngle: Math.PI / 2,
        dropShadowBlur: 4,
        dropShadowColor: '#000000'
    });

    const myText1 = new PIXI.Text(text, style1);
    myText1.position.set(300, 450);
    container.addChild(myText1);

    const button = new Graphics();
    button.beginFill(0xFF0000)
        .lineStyle(4, 0xFFEA00, 1)
        .drawRect(370, 570, 275, 125)
        .endFill();

    button.interactive = true;
    button.buttonMode = true;
    button.defaultCursor = 'pointer';

    button.on('pointerdown', function () {
        button.clear();
        button.beginFill(0xFF7700)
            .lineStyle(4, 0xFFEA00, 1)
            .drawRect(370, 570, 275, 125)
            .endFill();
        reset();
    });

    container.addChild(button);

    const style2 = new PIXI.TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 50,
        fill: 'deepskyblue',
        stroke: '#ffffff',
        strokeThickness: 4,
    });

    const myText2 = new PIXI.Text('Try again?', style2);
    myText2.position.set(400, 600);
    button.addChild(myText2);
}

//logic

function turn(index, player) {
    //mark the turn
    currentField[index] = player;
    //draw the shape
    if (player == Player) {
        addCross(index)
    }
    else {
        addTorus(index)
    }
    //check the win
    let gameWon = checkWin(currentField, player)
    if (gameWon) {
        gameOver(gameWon)
    }
}

function checkWin(field, player) {
    let plays = field.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function checkTie() {
    if (emptySquares().length == 0) {
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function emptySquares() {
    return currentField.filter(s => typeof s == 'number');
}

function gameOver(gameWon) {
    declareWinner(gameWon.player == Player ? "You win!" : "You lose.");
    cells.forEach(c => c.interactive = false);
}

function bestSpot() {
    return minimax(currentField, AI).index;
}

function minimax(newField, player) {
    var availableSpots = emptySquares();

    if (checkWin(newField, Player)) {
        return { score: -10 };
    } else if (checkWin(newField, AI)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availableSpots.length; i++) {
        var move = {};
        move.index = newField[availableSpots[i]];
        newField[availableSpots[i]] = player;
        if (player == AI) {
            var result = minimax(newField, Player);
            move.score = result.score;
        } else {
            var result = minimax(newField, AI);
            move.score = result.score;
        }
        newField[availableSpots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player === AI) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function reset() {
    start();
}