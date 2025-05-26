const size = 4;
const area = size * size;
const available_nums = Array.from({ length: 9 }, (_, i) => i + 1).concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')).slice(0, area); // numbers 1-9 and letters A-Z, up to the area size

const board = Array.from({ length: area }, () => Array(area).fill(0)); // empty board with zeros

const is_valid = (board, row, col, num) => {
  for (let i = 0; i < area; i++) {if (board[row][i] === num || board[i][col] === num) return false} // check if the number is already in the row, column
  
  const boxRow = Math.floor(row / size) * size;
  const boxCol = Math.floor(col / size) * size;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false; // check if the number is already in each size x size box
    }
  }

  return true;
}

const solve = board => {
  for (let row = 0; row < area; row++) {
    for (let col = 0; col < area; col++) {
      if (board[row][col] === 0) {
        const nums = available_nums.sort(() => Math.random() - 0.5);  // try numbers [1 – size] in random order for variety

        for (const num of nums) {
          if (is_valid(board, row, col, num)) {
            board[row][col] = num;

            if (solve(board)) return true; // recursively proceed
            board[row][col] = 0; // backtrack to 0
          }
        }

        return false; // if no valid number found, return false to trigger backtracking
      }
    }
  }

  return true; // no empty cells left — board has been solved!
}

console.time("Sudoku solved in");
solve(board);
console.timeEnd("Sudoku solved in");

console.table(board);