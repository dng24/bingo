const bingo = ["I", "P", "P", "E", "R"]; //array whereever these 5 letters are needed
const colors = ["red", "orange", "#47fc77", "#389afc", "#dc69ff"]; //colors of the balls
let prevNums = []; //array of 75 booleans; true if the number was chosen; i = 75 is free space
let cards = []; //array of Card objects
let drawBall = null; //the timer event that choses a number every 5 seconds

/**
 * A number on a Card.
 */
class Cell {
  number; //the number
  row; //the row of the cell in the card
  col; //the column of the cell in the card
  selected = false; //true if user has selected cell

  constructor(number, row, col) {
    this.number = number;
    this.row = row;
    this.col = col;
  }

  get getRow() {
    return this.row;
  }

  get getCol() {
    return this.col;
  }

  get getCellNum() {
    return this.number;
  }

  get isSelected() {
    return this.selected;
  }

  set setSelected(selected) {
    this.selected = selected;
  }
}

/**
 * A user's Bingo card.
 */
class Card {
  cardArr = []; //5X5 2D array containing Cells
  numBingos = 0; //number of unclaimed bingos on this card by the user

  //constructor loads the card (cardArr) with random numbers (represented by Cells)
  constructor() {
    let chosenNums = [];
    for (let i = 0; i < 5; i++) { //row
      this.cardArr.push([]);
      for (let j = 0; j < 5; j++) { //column
        const num = Math.floor(Math.random() * 15) + 15 * j;
        if (chosenNums.indexOf(num) === -1) {
          chosenNums.push(num);
          this.cardArr[i][j] = new Cell(num, i, j);
        } else {
          j--;
        }
      }
    }
    this.cardArr[2][2] = new Cell(75, 2, 2); //75 is free space
  }

  get numBingos() {
    return numBingos;
  }

  /**
   * Converts a HTML Cell id into a Cell object.
   *
   * @param id string: id of HTML Cell; in form - c{card_num}r{row_num}c{col_num}
   *                   all nums are 1 digit
   */
  idToCell(id) {
    const row = parseInt(id.charAt(3));
    const col = parseInt(id.charAt(5));
    return this.cardArr[row][col];
  }

  /**
   * Draws the Card on screen.
   *
   * @param cardId integer: the id of the card; determines where it'll be drawn on screen
   */
  drawCard(cardId) {
    document.getElementById("cardHolder" + cardId).appendChild(document.createElement("table"));
    document.getElementsByTagName("table")[cardId].appendChild(document.createElement("tr"));
    const tr = document.getElementsByTagName("table")[cardId].getElementsByTagName("tr")[0];
    //make card header
    for (let i = 0; i < 5; i++) {
      tr.appendChild(document.createElement("th"));
      tr.getElementsByTagName("th")[i].innerHTML = bingo[i];
    }
    for (let i = 0; i < 5; i++) { //rows
      document.getElementsByTagName("table")[cardId].appendChild(document.createElement("tr"));
      const tr = document.getElementsByTagName("table")[cardId].getElementsByTagName("tr")[i + 1];
      for (let j = 0; j < 5; j++) { //columns
        tr.appendChild(document.createElement("td"));
        const cell = tr.getElementsByTagName("td")[j];
        cell.id = "c" + cardId + "r" + i + "c" + j;
        const cellObj = this.idToCell(cell.id);
        cell.innerHTML = cellObj.getCellNum;
        //event listener when user clicks on a number
        cell.addEventListener("click", () => {
          if (prevNums[cellObj.getCellNum]) { //only if number previously chosen
            cell.style.background = "red";
            cellObj.setSelected = true;
            this.updateNumBingos(cellObj.getRow, cellObj.getCol);
          }
        });
      }
    }
    document.getElementById("c" + cardId + "r2c2").innerHTML = "free"; //set free cell
  }

  /**
   * Determine if there are new bingos.
   *
   * @param row integer: row of the cell that the user just selected
   * @param col integer: column of the cell that the user just selected
   */
  updateNumBingos(row, col) {
    this.numBingos += 2;
    //check horizontally for bingos in the row the selected number is in
    for (let i = 0; i < 5; i++) {
      if (!this.cardArr[row][i].isSelected) { //no bingo
        this.numBingos--;
        break;
      }
    }
    //check vertically for bingos in the row the selected number is in
    for (let i = 0; i < 5; i++) {
      if (!this.cardArr[i][col].isSelected) { //no bingo
        this.numBingos--;
        break;
      }
    }
    //check diagonal from top left to bottom right, if necessary
    if (row == col) {
      this.numBingos++;
      for (let i = 0; i < 5; i++) {
        if (!this.cardArr[i][i].isSelected) { //no bingo
          this.numBingos--;
          break;
        }
      }
    }
    //check diagonal from top right to bottom left, if necessary
    if (row + col == 4) {
      this.numBingos++;
      for (let i = 0; i < 5; i++) {
        if (!this.cardArr[i][4 - i].isSelected) { //no bingo
          this.numBingos--;
          break;
        }
      }
    }
  }
}

/**
 * Called when body of HTML is loaded.
 */
function init() {
  makeCards(4);
  makePastBallsTable();
  //init prevNums array
  for (let i = 0; i < 75; i++) {
    prevNums.push(false);
  }
  prevNums.push(true); //Free space (i = 75) is always clickable
  //add event listener of the bingo button
  document.getElementById("bingo").addEventListener("click", () => {
    cards.forEach(card => {
      if (card.numBingos > 0) {
        clearInterval(drawBall);
        document.getElementById("bingoBall").innerHTML = "You Win!";
      }
    });
  });
  beginGame();
}

/**
 * Makes the cards.
 *
 * @param numCards integer: number of Cards to make
 */
function makeCards(numCards) {
  for (let i = 0; i < numCards; i++) {
    card = new Card();
    card.drawCard(i);
    cards.push(card);
  }
}

/**
 * Draws the master table.
 */
function makePastBallsTable() {
  document.getElementById("pastBalls").appendChild(document.createElement("table"));
  const table = document.getElementById("pastBalls").getElementsByTagName("table")[0];
  const headRow = table.appendChild(document.createElement("tr"));
  //draw the table headers
  for (let i = 0; i < 5; i++) {
    const cell = headRow.appendChild(document.createElement("th"));
    cell.innerHTML = bingo[i];
    cell.style.backgroundColor = colors[i];
  }
  for (let i = 0; i < 15; i++) { //rows
    const row = table.appendChild(document.createElement("tr"));
    for (let j = 0; j < 5; j++) { //colulmns
      const cell = row.appendChild(document.createElement("td"));
      cell.innerHTML = j * 15 + i;
      cell.id = "master" + cell.innerHTML;
      cell.className = "pastBallCell";
    }
  }
}

/**
 * Randomly shuffles an array. Used to determine order of chosen numbers.
 *
 * @param array Array: the array to be shuffled
 * @return the shuffled array
 */
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue = 0;
  let randomIndex = 0;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/**
 * Begin a game.
 */
function beginGame() {
  let numbers = []; //the order of the numbers to be chosen in
  for (let i = 0; i < 75; i++) {
    numbers.push(i);
  }
  numbers = shuffle(numbers);
  let curBallIdx = 0; //current chosen number index in numbers array
  let curBallNum = 0; //current chosen number
  let tmpIdx = 0; //0 - 4; index of bingo and colors array
  let masterCell = null; //HTML element of current chosen number cell of the master table
  const bingoBall = document.getElementById("bingoBall");
  let count = 4; //when game starts, game counts down from 5
  const beginCountdown = setInterval(() => {
    bingoBall.innerHTML = "Begin in " + count;
    count--;
  }, 1000);

  setTimeout(() => { //stop countdown timer
    clearInterval(beginCountdown);
  }, 4500);

  //main timer to choose next number every 5 seconds
  drawBall = setInterval(() => {
    curBallNum = numbers[curBallIdx];
    prevNums[curBallNum] = true;
    tmpIdx = Math.floor(curBallNum / 15);
    bingoBall.innerHTML = bingo[tmpIdx] + " " + curBallNum;
    bingoBall.style.backgroundColor = colors[tmpIdx];
    masterCell = document.getElementById("master" + curBallNum)
    masterCell.style.backgroundColor = "black";
    masterCell.style.color = "white";
    curBallIdx++;
    if (curBallIdx == 75) { //all balls drawn
      clearInterval(drawBall);
    }
  }, 5000);
}
