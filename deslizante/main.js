import getRandomHslColor from './colors.js';

const board = document.getElementById("game-board");
const moveCountEl = document.getElementById("move-count");
const bestMoveEl = document.getElementById("best-move");
const winMessage = document.getElementById("win-message");
const shuffleBtn = document.getElementById("shuffle-btn");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");

const tileSize = 80;
let rows = 4;
let cols = 4;
let tiles = [];
let emptyTile = { x: 0, y: 0 };
let moveCount = 0;

rowsInput.addEventListener("change", () => setup());
colsInput.addEventListener("change", () => setup());
shuffleBtn.addEventListener("click", () => shuffle());

function setup() {
  rows = parseInt(rowsInput.value);
  cols = parseInt(colsInput.value);
  board.innerHTML = "";
  tiles = [];
  moveCount = 0;
  moveCountEl.textContent = moveCount;
  winMessage.classList.add("hidden");

  board.style.width = `${cols * tileSize}px`;
  board.style.height = `${rows * tileSize}px`;

  let numbers = [...Array(rows * cols - 1).keys()].map(n => n + 1);
  numbers.push(null); // empty
  numbers.forEach((n, index) => {
    const x = index % cols;
    const y = Math.floor(index / cols);
    const tile = document.createElement("div");
    tile.className = "tile" + (n === null ? " empty" : "");
    tile.textContent = n === null ? "" : n;
    tile.style.width = tile.style.height = tileSize - 4 + "px";
    board.appendChild(tile);
    tiles.push({ x, y, value: n, el: tile });

    if (n === null) emptyTile = { x, y };
  });

  render();
  updateBestEstimate();
  shuffle();
}

const render = () => {for (const tile of tiles) tile.el.style.transform = `translate(${tile.x * tileSize}px, ${tile.y * tileSize}px)`}

function moveTile(tile) {
  if (isAdjacent(tile, emptyTile)) {
    [tile.x, emptyTile.x] = [emptyTile.x, tile.x];
    [tile.y, emptyTile.y] = [emptyTile.y, tile.y];
    moveCount++;
    moveCountEl.textContent = moveCount;
    checkWin();
  }
}

const isAdjacent = (a, b) => (a.x === b.x && Math.abs(a.y - b.y) === 1) || (a.y === b.y && Math.abs(a.x - b.x) === 1)

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    const tile = tiles[i];
    const correctX = i % cols;
    const correctY = Math.floor(i / cols);
    if (tile.value !== i + 1 || tile.x !== correctX || tile.y !== correctY) return;
  }
  winMessage.classList.remove("hidden");
}

function shuffle() {
  tiles.sort(() => Math.random() - 0.5);
  tiles.map((tile, index) => {
    const x = index % cols;
    const y = Math.floor(index / cols);
    tile.x = x;
    tile.y = y;
  });

  moveCount = 0;
  moveCountEl.textContent = moveCount;
  render();
  updateBestEstimate();
  getRandomHslColor();
  winMessage.classList.add("hidden");
}

function updateBestEstimate() {
  let estimate = 0;
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile.value === null) continue;
    const correctX = (tile.value - 1) % cols;
    const correctY = Math.floor((tile.value - 1) / cols);
    estimate += Math.abs(tile.x - correctX) + Math.abs(tile.y - correctY);
  }
  bestMoveEl.textContent = estimate;
}

document.addEventListener("DOMContentLoaded", setup);

board.addEventListener("click", (e) => {
  const rect = board.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / tileSize);
  const y = Math.floor((e.clientY - rect.top) / tileSize);
  const tile = tiles.find(t => t.x === x && t.y === y);
  if (tile) moveTile(tile);
});
