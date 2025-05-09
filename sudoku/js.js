import {highlightNumber, clearHighlights} from './highlighter.js'
import updateSums from './sums.js'
import getRandomHslColor from './colors.js'

function generateSudoku() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }
    return true;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function fillBoard() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (isValid(row, col, num)) {
              board[row][col] = num;
              if (fillBoard()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillBoard();
  return board;
}


function removeCells(board, difficulty = "medium") {
  const levels = {veryeasy: 25, easy: 35, medium: 45, hard: 55, veryhard: 65}; // 56, 46, 36, 26, 16 clues
  const totalToRemove = levels[difficulty] ?? levels["medium"];
  const puzzle = board.map(row => row.slice());

  let removed = 0;
  while (removed < totalToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return puzzle;
}


function renderSudoku(puzzle) {
  const container = document.getElementById("sudoku-container");
  container.innerHTML = ""; // Clear previous render
  const table = document.createElement("table");

  // Create a reference grid for selects
  selects = [];

  for (let row = 0; row <= 9; row++) {
    const tr = document.createElement("tr");
    if (row < 9) selects[row] = [];

    for (let col = 0; col <= 9; col++) {
      const td = document.createElement("td");
      if(row < 9 && col < 9) td.classList.add(`r${row}c${col}`)

      // Border styling (for 9x9 grid only)
      if (row < 9 && col < 9) {
        if (col % 3 === 0) td.classList.add("left");
        if (row % 3 === 0) td.classList.add("top");
        if (col === 8) td.classList.add("right");
        if (row === 8) td.classList.add("bottom");
      }
      if(row === 9 && col === 9) {td.style.border = "none"}

      // Regular Sudoku cells
      if (row < 9 && col < 9) {
        const val = puzzle[row][col];

        if (val === 0) {
          const select = document.createElement("select");
          select.setAttribute("class", "cell");
          select.setAttribute("data-row", row);
          select.setAttribute("data-col", col);

          const emptyOption = document.createElement("option");
          emptyOption.value = "";
          emptyOption.textContent = "";
          select.appendChild(emptyOption);

          for (let i = 1; i <= 9; i++) {
            if (isValidInCell(puzzle, row, col, i)) {
              const option = document.createElement("option");
              option.value = i;
              option.textContent = i;
              select.appendChild(option);
            }
          }

          select.addEventListener("mouseenter", () => {if (select.value) highlightNumber(select.value, helpers[0])});
          select.addEventListener("mouseleave", clearHighlights);
          // select.addEventListener("change", () => updateLiveBoard(puzzle, selects));
          select.addEventListener("change", () => {
            saveStateToUndoStack(select);
            updateLiveBoard(puzzle, selects);
          })

          td.appendChild(select);
          selects[row][col] = select;
        } else {
          td.textContent = val;
          td.classList.add("fixed");

          td.addEventListener("mouseenter", () => highlightNumber(val, helpers[0]));
          td.addEventListener("mouseleave", clearHighlights);
        }

        // For center cell in each 3x3 box, add box sum overlay
        if ((row % 3 === 1) && (col % 3 === 1)) {
          const overlay = document.createElement("div");
          overlay.className = "box-sum";
          if(!helpers[2]) overlay.classList.add("dn")
          td.appendChild(overlay);
        }
      }

      // 10th row and 10th column (sums)
      if (row < 9 && col === 9) td.classList.add("row-sum")
      if (row === 9 && col < 9) td.classList.add("col-sum")
      if (row === 9 || col === 9) if(!helpers[2]) td.classList.add("dn")

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
  updateSums(puzzle, helpers[2]);
  getRandomHslColor()
}


function isValidInCell(board, row, col, num) {
  if(!helpers[1]) return true;

  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}


function updateLiveBoard(puzzle, selects) {
  board = puzzle.map((row, r) =>
    row.map((val, c) => {
      const select = selects?.[r]?.[c];
      return select ? parseInt(select.value) || 0 : val;
    })
  );

  // Update each select’s options based on new board state
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const select = selects?.[r]?.[c];
      if (!select) continue;

      const currentValue = parseInt(select.value) || "";
      const previousOptions = Array.from(select.options).map(o => o.value);
      select.innerHTML = "";

      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "";
      select.appendChild(emptyOption);

      for (let i = 1; i <= 9; i++) {
        if (isValidInCell(board, r, c, i) || i == currentValue) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;
          option.addEventListener("mouseenter", () => highlightNumber(i,helpers[0]));
          option.addEventListener("mouseleave", clearHighlights);
          select.appendChild(option);
        }
      }

      // Re-set the current value (if valid)
      select.value = currentValue;
    }
  }

  updateSums(board, helpers[2]); // update sums live
}


const helpers = [0, 0, 0];
const change_helpers = i => event => {
  helpers[i] = event.target.checked;
  if(i==1) updateLiveBoard(puzzle, selects)
  if(i==2) {
    [...document.getElementsByClassName("row-sum")].forEach(e => e.classList.toggle("dn"));
    [...document.getElementsByClassName("col-sum")].forEach(e => e.classList.toggle("dn"));
    [...document.getElementsByClassName("box-sum")].forEach(e => e.classList.toggle("dn"));
    document.getElementById("sudoku-container").classList.toggle("added_margin")
    updateLiveBoard(puzzle, selects);
  }
}
[...document.getElementsByTagName("input")].forEach((el, i) => el
  .addEventListener("change", change_helpers(i))
);

let puzzle, selects, board;
const initiate = () => {
  const dificulty = dificulty_selector.value
  const fullBoard = generateSudoku();
  puzzle = removeCells(fullBoard, dificulty);
  renderSudoku(puzzle);
}
const dificulty_selector = document.getElementById("dificulty")
dificulty_selector.addEventListener("change", initiate);
initiate();

const resetGame = () => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const select = selects?.[row]?.[col];
      if (select) select.value = ""
    }
  }
  updateLiveBoard(puzzle, selects);
}
document.getElementById("reset").addEventListener("click",resetGame)


const undoStack = [];

function saveStateToUndoStack(select) {
  const val = Number(select.value)
  const row = select.getAttribute('data-row')
  const col = select.getAttribute('data-col')
  undoStack.unshift([row+col,val]);
}

document.getElementById("undoBtn").addEventListener("click", () => {
  if (undoStack.length === 0) return;

  const lastChanged = undoStack.shift();
  const lastState = undoStack.find(subarray => subarray[0] === lastChanged[0]);
  selects[lastChanged[0][0]][lastChanged[0][1]].value = lastState?lastState[1]:0

  updateLiveBoard(puzzle, selects);
});