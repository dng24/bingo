
function makeCards(numCards) {
  //make the HTML card
  const bingo = ["B", "I", "N", "G", "O"];
  for (let i = 0; i < numCards; i++) {
    document.getElementsByTagName("body")[0].appendChild(document.createElement("table"));
    document.getElementsByTagName("table")[i].appendChild(document.createElement("tr"));
    let tr = document.getElementsByTagName("table")[i].getElementsByTagName("tr")[0];
    for (let j = 0; j < 5; j++) {
      tr.appendChild(document.createElement("th"));
      tr.getElementsByTagName("th")[j].innerHTML = bingo[j];
    }
    for (let j = 0; j < 5; j++) {
      document.getElementsByTagName("table")[i].appendChild(document.createElement("tr"));
      tr = document.getElementsByTagName("table")[i].getElementsByTagName("tr")[j + 1];
      for (let k = 0; k < 5; k++) {
        tr.appendChild(document.createElement("td"));
        tr.getElementsByTagName("td")[k].id = "c" + i + "r" + j + "c" + k;
      }
    }
  }

  //fill the cards with numbers
  let cards = [];
  for (let i = 0; i < numCards; i++) {
    let prevNums = [];
    cards[i] = [];
    for (let j = 0; j < 5; j++) {
      cards[i][j] = [];
      for (let k = 0; k < 5; k++) {
        const num = Math.floor(Math.random() * 75);
        if (prevNums.indexOf(num) === -1) {
          prevNums.push(num);
          cards[i][j][k] = num;
          const cellId = "c" + i + "r" + j + "c" + k;
          document.getElementById(cellId).innerHTML = num;
        } else {
          k--;
        }
      }
    }
    document.getElementById("c" + i + "r2c2").innerHTML = "free"
  }
}
