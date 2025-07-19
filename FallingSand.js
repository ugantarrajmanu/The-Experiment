let n = 100;

document.querySelector(".root").innerHTML =
  '<canvas class="container" height="500px" width="500px"></div>';

const canvas = document.querySelector(".container");
const ctx = canvas.getContext("2d");

const cellSize = 2;
const gridWidth = 500 / cellSize;
const gridHeight = 500 / cellSize;

let grid = Array.from({ length: gridHeight }, () =>
  Array.from({ length: gridWidth }, () => 0)
);


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.querySelector(".container").addEventListener("mousemove", (e) => {
  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);
  if (grid[y][x] !== 1) {
    const spawn = () => {
      let dx = getRandomInt(-2, 2);
      let dy = getRandomInt(-2, 2);
      let i = x + dx;
      let j = y + dy;
      if (i >= 0 && i < gridWidth && j >= 0 && j < gridHeight) {
        grid[j][i] = 1;
      }
      newUpdateCanvas();  
    };

    spawn();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    clearGrid();
  } else if (e.code === "Space") {
    console.log("space");
    let x = getRandomInt(0, gridWidth - 1);
    let y = 0;

    grid[0][x] = 1;
    newUpdateCanvas()
  }
});

let prev = performance.now();
function loop(now) {
  if (now - prev >= 1) {
    fallingSandLoop();
    prev = now;
  }
  requestAnimationFrame(loop);
}
loop();

function fallingSandLoop() {
  for (let j = gridHeight - 2; j >= 0; j--) {
    for (let i = 0; i < gridWidth; i++) {
      if (grid[j][i] === 1) {
        if (grid[j + 1][i] === 0) {
          grid[j][i] = 0;
          grid[j + 1][i] = 1;
        } else if (i + 1 < gridWidth && grid[j + 1][i + 1] === 0) {
          grid[j][i] = 0;
          grid[j + 1][i + 1] = 1;
        } else if (i - 1 >= 0 && grid[j + 1][i - 1] === 0) {
          grid[j][i] = 0;
          grid[j + 1][i - 1] = 1;
        }
      }
    }
  }
  newUpdateCanvas();
}


function newUpdateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let j = 0; j < gridHeight; j++) {
    for (let i = 0; i < gridWidth; i++) {
      if (grid[j][i] === 1) {
        ctx.fillStyle = "#C8a2c8";
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}

const clearGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
