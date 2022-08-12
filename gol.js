const  unitLength  =  20;
const  boxColor  =  "pink";
const  strokeColor  =  "black";
let columns; /* To be determined by window width*/
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let pause = false;
let clicker = false;
let slider = document.querySelector('#myRange');
const fps = document.querySelector('.fps')

// Function
function setup() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(400,400);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = new Array(columns);
    nextBoard = new Array(columns);

    for(let i = 0; i < columns; i++){
        currentBoard[i] = new Array(rows)
        nextBoard[i] = new Array(rows);
    }
    frameRate(5.5);
    fps.innerHTML =  Math.round(slider.value);
    init();  
}



 // Now both currentBoard and nextBoard are array of array of undefined values.
function init() {  // Set the initial values of the currentBoard and nextBoard
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}

function draw(){
    background(255); //RGB code for white
    generate(); // The function calculates next generation with current generation
    // slider.position(1300, 1400);
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1){
                if (nextBoard[i][j] === 1){ //Darken colours for stable life
                    fill (150)
                } else {
                    fill(boxColor)
                };
            }else {
                fill (255)
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}

function generate(){
    for(let x = 0; x < columns; x++){ //Loop over every single box on the board
        for (let y = 0; y < rows; y++){
            let neighbors = 0;        // Count all living members in the Moore neighborhood(8 boxes surrounding)
            for(let i of [-1, 0, 1]) {
                for(let j of [-1, 0, 1]) {
                    if(i === j && j === 0) {
                        continue;
                    } 
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows]; 
                }
            }
            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2){
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3){
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3){
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            // } else if(currentBoard[x][y] === nextBoard[x][y] !== 0){
            //     boxColor = "grey";
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];

            // Allow frameRate changes  instantly according to slidebar
            // changeSpeed();
        }
    }
}
    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if(mouseX > unitLength * columns || mouseY > unitLength * rows){
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke("green");
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
    if (clicker == false){
    noLoop();
    mouseDragged();
    } else if (clicker == true){
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke("green");
    rect(x * unitLength, y * unitLength, unitLength, unitLength);

    }
}

/**
 * When mouse is released
 */
function mouseReleased() {
    if (clicker == false){
    loop();
    } else if (clicker == true){
    
    }
}

function windowResized(){
    /*Calculate the number of columns and rows */
    const canvas = createCanvas((Math.round((windowWidth - 400) / unitLength) * unitLength),400);
    console.log(windowWidth);
    canvas.parent(document.querySelector('#canvas'));

    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    let oldBoard = currentBoard;

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = new Array(columns);
    nextBoard = new Array(columns);

    for(let i = 0; i < columns; i++){
        currentBoard[i] = new Array(rows)
        nextBoard[i] = new Array(rows);
    }

    for(let i = 0; i  < columns; i++){
        for(let j = 0; j< rows; j++){
            if(i >  oldBoard.length || !oldBoard[i] || (oldBoard[i] && j > oldBoard[i].length)){
                continue;
            }
            currentBoard[i][j] = oldBoard[i][j];
        }
    }
}



slider.addEventListener('change', function(){
    frameRate(Math.round(slider.value));
    fps.innerHTML = Math.round(slider.value);
})

document.querySelector('#reset-game')
    .addEventListener('click',function(){
        init();
        frameRate(slider.value());
        fps.innerHTML =  floor(slider.value());
        clicker = !true;
        stopbtntext.innerHTML =  'Stop';
    });

document.querySelector('#stop-game')
    .addEventListener('click',function(){
        if(pause == false){
            frameRate(0);
            fps.innerHTML =  floor(slider.value());
            pause = true;
            clicker = true;
            stopbtntext.innerHTML =  'Resume';
        } else if (pause) {
            frameRate(slider.value());
    
            pause = !true;
            clicker = !true;
            stopbtntext.innerHTML =  'Stop';
        }
    });





