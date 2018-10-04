function setup(){
    document.getElementById("solve").onclick = submit;
    document.getElementById("clear").onclick = clear;
}

//initializes a matrix with the clues provided and passes it to the solver function
//the matrix is a 9x9 grid with each cell containing an object {val: 0-9, clue: true/false}
function submit(){
    console.log("submitting");
    var node;
    var clueArray = [[],[],[],[],[],[],[],[],[]];
    for(var i=0; i<81; i++){
        node = Number(document.getElementById(i.toString()).value);
        if(!isNaN(node) && node > 0){
            clueArray[Math.floor(i/9)][i%9] = {val: node, clue: true};
        }
        else{
            clueArray[Math.floor(i/9)][i%9] = {val: 0, clue: false};
        }
    }
    //console.log("initial: ",clueArray);
    solve(clueArray);
}

//solves the sudoku through brute force and backtracking. Fills the grid in with the values
function solve(grid) {
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 9; y++) {
            if (grid[x][y].clue === false) {
                grid[x][y].val += 1;
                //console.log("new node at ", x,", ",y);
                while(!checkValid(grid,x,y)){
                    grid[x][y].val+=1;
                    //if there is no valid number for this box, go back to the previous non clue box
                    if(grid[x][y].val > 9){
                        //console.log("backtracking");
                        if(x === 0 && y === 0){
                            //no valid solution found
                            alert("No valid solution found");
                            clear();
                            return;
                        }
                        grid[x][y].val = 0;
                        do{
                            if(y === 0){
                                x -= 1;
                                y= 8;
                            }
                            else{
                                y -= 1;
                            }
                        }
                        while(grid[x][y].clue === true);
                        //must go back one more time because the loop will increment to the next element
                        if(y>0){
                            y -= 1;
                        }
                        else{
                            x-=1;
                            y=8;
                        }
                        break;
                    }
                }
            }
        }
    }
    //console.log("solved grid: ",grid);
    for(var i=0;i<81;i++){
        var element = document.getElementById(i.toString());
        element.disabled = true;
        element.value = grid[Math.floor(i/9)][i%9].val;
    }
}

//checks if the number in a box is violating any sudoku rules based on our current grid
function checkValid(clueArray,x,y){
    if(clueArray[x][y].val > 9){
        return false;
    }
    for(var i=0; i<9; i++){
        //no duplicate in this row
        if(clueArray[x][i].val === clueArray[x][y].val && i != y){
            //console.log("invalid row");
            return false;
        }
        //no duplicate in this column
        if(clueArray[i][y].val === clueArray[x][y].val && i!=x){
            //console.log("invalid column");
            return false;
        }
    }
    //no duplicate in this 3x3 box
    var boxx = 3*Math.floor(x/3);
    var xlimit = boxx + 3;
    for(boxx; boxx<xlimit; boxx++){
        var boxy = 3*Math.floor(y/3);
        var ylimit = boxy + 3;
        for(boxy; boxy<ylimit; boxy++){
            if(clueArray[boxx][boxy].val === clueArray[x][y].val && !(boxx === x && boxy === y)){
                //console.log("invalid box");
                return false;
            }
        }
    }
    //console.log("valid value: ",clueArray[x][y].val);
    return true;
}


//clears the gameboard and re-enables the inputs
function clear(){
    for(var i=0;i<81;i++){
        var element = document.getElementById(i.toString());
        element.disabled = false;
        element.value = "";
    }
}