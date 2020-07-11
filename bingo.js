const bingo = ["B", "I", "N", "G", "O"];
let prevNums = []

class Cell {
  number;
  selected = false;

  constructor(number) {
    this.number = number;
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

class Card {
  cardArr = []
  constructor() {
    let prevNums = [];
    for (let i = 0; i < 5; i++) {
      this.cardArr.push([]);
      for (let j = 0; j < 5; j++) {
        const num = Math.floor(Math.random() * 15) + 15 * i;
        if (prevNums.indexOf(num) === -1) {
          prevNums.push(num);
          this.cardArr[i][j] = new Cell(num);
        } else {
          j--;
        }
      }
    }
    this.cardArr[2][2] = new Cell(75); //75 is free space
  }

  idToCell(id) {
    const i = parseInt(id.charAt(3));
    const j = parseInt(id.charAt(5));
    return this.cardArr[i][j];
  }

  drawCard(cardId) {
    document.getElementById("cardHolder" + cardId).appendChild(document.createElement("table"));
    document.getElementsByTagName("table")[cardId].appendChild(document.createElement("tr"));
    const tr = document.getElementsByTagName("table")[cardId].getElementsByTagName("tr")[0];
    for (let i = 0; i < 5; i++) {
      tr.appendChild(document.createElement("th"));
      tr.getElementsByTagName("th")[i].innerHTML = bingo[i];
    }
    for (let i = 0; i < 5; i++) {
      document.getElementsByTagName("table")[cardId].appendChild(document.createElement("tr"));
      const tr = document.getElementsByTagName("table")[cardId].getElementsByTagName("tr")[i + 1];
      for (let j = 0; j < 5; j++) {
        tr.appendChild(document.createElement("td"));
        const cell = tr.getElementsByTagName("td")[j];
        cell.id = "c" + cardId + "r" + i + "c" + j;
        const cellObj = this.idToCell(cell.id);
        cell.innerHTML = cellObj.getCellNum;
        cell.addEventListener("click", () => {
          if (prevNums[cellObj.getCellNum]) {
            cell.style.background = "red";
            cellObj.setSelected = true;
          }
        });
      }
    }
    document.getElementById("c" + cardId + "r2c2").innerHTML = "free";
  }
}



function init() {
  makeCards(4);
  makePastBallsTable();
  for (let i = 0; i < 75; i++) {
    prevNums.push(false);
  }
  prevNums.push(true); //Free space (i = 75) is always clickable
  document.getElementById("bingo").addEventListener("click", () => {

  });
  beginGame();
}

function makeCards(numCards) {
  for (let i = 0; i < numCards; i++) {
    card = new Card();
    card.drawCard(i);
  }
}

function makePastBallsTable() {
  document.getElementById("pastBalls").appendChild(document.createElement("table"));
  const table = document.getElementById("pastBalls").getElementsByTagName("table")[0];
  const headRow = table.appendChild(document.createElement("tr"));
  for (let i = 0; i < 5; i++) {
    const cell = headRow.appendChild(document.createElement("th"));
    cell.innerHTML = bingo[i];
  }
  for (let i = 0; i < 15; i++) {
    const row = table.appendChild(document.createElement("tr"));
    for (let j = 0; j < 5; j++) {
      const cell = row.appendChild(document.createElement("td"));
      cell.innerHTML = j * 15 + i;
      cell.className = "pastBallCell";
    }
  }
}

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

function beginGame() {
  let numbers = [];
  for (let i = 0; i < 75; i++) {
    numbers.push(i);
  }
  numbers = shuffle(numbers);
  let currentBallIdx = 0;
  let currentBallNum = 0;
  const drawBall = setInterval(() => {
    currentBallNum = numbers[currentBallIdx];

  }, 5000);
}
