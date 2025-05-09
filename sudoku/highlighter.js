function highlightRowAndCol(row, col) {
  [...document.querySelectorAll(`tr:nth-child(${row + 1}) td`)].slice(0,-1).forEach(td => td.classList.add("highlight"));
  [...document.querySelectorAll(`tr td:nth-child(${col+1})`)].slice(0,-1).forEach(td => td.classList.add("highlight"));
}

function highlightBox(row, col) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    const tr = document.querySelectorAll("tr")[r];
    if (!tr) continue;

    for (let c = startCol; c < startCol + 3; c++) {
      const td = tr.querySelectorAll("td")[c];
      if (td) td.classList.add("highlight");
    }
  }
}

const clearHighlights = () => document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));

function highlightNumber(num, help) {
  if (!help) return;
  clearHighlights();

  document.querySelectorAll("tr").forEach((tr, rowIndex) => {
    if (rowIndex >= 9) return; // Skip the 10th row for column sums

    tr.querySelectorAll("td").forEach((td, colIndex) => {
      if (colIndex >= 9) return; // Skip the 10th column for row sums

      const val = Number(td.innerHTML.trim().charAt(0))
      const select = td.querySelector("select");
      const selectedVal = select ? select.value : null;

      if (val == num || selectedVal == num) {
        highlightRowAndCol(rowIndex, colIndex);
        highlightBox(rowIndex, colIndex);
      }
    });
  });
}



export {highlightNumber, clearHighlights}