let n = 100;

document.querySelector(".root").innerHTML =
  '<canvas class="container" height="500px" width="500px"></div>';


const canvas = document.querySelector(".container");
const ctx = canvas.getContext("2d");

const gridWidth = 250;
const gridHeight = 250;
const cellSize = 2;

let grid = Array.from({ length: gridHeight }, () =>
  Array.from({ length: gridWidth }, () => 0)
);

ctx.fillStyle = "rgba(43, 43, 43)";
ctx.fillRect(0, 0, canvas.width, canvas.height);


document.querySelector(".container").addEventListener("mousemove", (e) => {
  if (
    grid[Math.floor(e.offsetY / cellSize)][Math.floor(e.offsetX / cellSize)] !==
    1
  ) {
    requestAnimationFrame(() =>
      fallingGrid(
        Math.floor(e.offsetX / cellSize),
        Math.floor(e.offsetY / cellSize)
      )
    );
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    clearGrid();
  } else if (e.code === "Space") {

    let x = getRandomInt(0, gridWidth - 1);
    let y = getRandomInt(0, gridHeight - 1);
    fallingGrid(x, 0);
  }
});

function fallingGrid(i, j) {
  if (j === gridHeight) return;

  if (j - 1 >= 0) {
    grid[j - 1][i] = 0;
  }

  let flag = 0;

  if (grid[j][i] === 1) {
    if (i + 1 < gridHeight && grid[j][i + 1] === 0) {
      i += 1;
      flag = 1;
    } else if (i - 1 >= 0 && grid[j][i - 1] === 0) {
      i -= 1;
      flag = -1;
    } else {
      grid[--j][i] = 1;
      updateCanvas(i, j, flag);
      return;
    }
  }
  grid[j][i] = 1;
  updateCanvas(i, j, flag);

  requestAnimationFrame(() => fallingGrid(i, ++j));
}

function updateCanvas(i, j, flag) {
  ctx.fillStyle = "rgb(43, 43, 43)";
  ctx.fillRect((i - flag) * cellSize, (j - 1) * cellSize, cellSize, cellSize);
  ctx.fillStyle = "#C8a2c8";
  ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
}

const clearGrid = () => {
  ctx.fillStyle = "rgba(43, 43, 43)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  grid = Array.from({ length: gridHeight }, () =>
    Array.from({ length: gridWidth }, () => 0)
  );
};
