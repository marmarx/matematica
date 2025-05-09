export default function updateSums(board, enabled) {
  if(!enabled) return;
  console.log('here')

  function colorize(td, sum) {
    if (!td) return;
    td.textContent = sum || '';
    if (sum === 45) td.style.color = "var(--green)"
    else if (sum > 45) td.style.color = "var(--red)"
    else td.style.color = "var(--sum-color)"
  }

  // Row sums
  for (let r = 0; r < 9; r++) {
    let sum = 0;
    for (let c = 0; c < 9; c++) { sum += parseInt(board[r][c]) || 0 }
    const sumTd = document.querySelector(`tr:nth-child(${r + 1}) td.row-sum`);
    colorize(sumTd, sum);
  }

  // Column sums
  for (let c = 0; c < 9; c++) {
    let sum = 0;
    for (let r = 0; r < 9; r++) { sum += parseInt(board[r][c]) || 0 }
    const colSumTd = document.querySelector(`tr:nth-child(10) td:nth-child(${c + 1})`);
    colorize(colSumTd, sum);
  }

  // Box sums
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      let sum = 0;
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          sum += parseInt(board[r][c]) || 0;
        }
      }

      const centerRow = br * 3 + 1;
      const centerCol = bc * 3 + 1;
      const td = document.querySelector(`tr:nth-child(${centerRow + 1}) td:nth-child(${centerCol + 1})`);
      if (td) {
        let overlay = td.querySelector(".box-sum");
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.className = "box-sum";
          td.appendChild(overlay);
        }
        overlay.textContent = sum || '';
        overlay.style.color = sum === 45 ? "var(--green)" : sum > 45 ? "var(--red)" : "var(--box-sum-color)";
      }
    }
  }
}
