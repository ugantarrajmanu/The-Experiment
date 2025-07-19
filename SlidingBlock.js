const width = 800;
const height = 500;

document.querySelector(
  ".root"
).innerHTML = `<canvas class="container" height="${height}px" width="${width}px"></div>`;

const muRange = document.querySelector("#mu-range");
const muRangeNumber = document.querySelector("#mu-range-number");
const mass = document.querySelector("#mass-range");
const angleRange = document.querySelector("#angle-range");
const angleNumber = document.querySelector("#angle-range-number");

const sliding = {
  x: 0,
  y: 0,
  theta: angleRange.value * (Math.PI / 180),
  g: 9.81,
  mu: muRange.value,
  a: 0,
  v: 1,
};

const block = {
  width: 50,
  m: 15, //kg
};

let slideX = calcWidth();
let slideY = calcHeight();

let blockOriginX = 0;
let blockOriginY = slideY;

let isRunning = true;

const canvas = document.querySelector(".container");
const ctx = canvas.getContext("2d");

function drawSlide() {
  ctx.strokeStyle = "#C8a2c8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (sliding.theta <= 30 * (Math.PI / 180)) {
    ctx.moveTo(0, slideY);
    ctx.lineTo(slideX, height);
  } else {
    ctx.moveTo(0, slideY);
    ctx.lineTo(slideX, height);
  }
  ctx.stroke();
}

function calcHeight() {
  if (sliding.theta > 30 * (Math.PI / 180))
    return height - (width - 50) * Math.tan(30 * (Math.PI / 180));
  return height - slideX * Math.tan(sliding.theta);
}

function calcWidth() {
  if (sliding.theta === 90 * (Math.PI / 180)) return 0;
  if (sliding.theta <= 30 * (Math.PI / 180)) return width - 50;
  return (
    ((width - 50) * Math.tan(30 * (Math.PI / 180))) / Math.tan(sliding.theta)
  );
}

function blockPosition(x, y) {
  const h = sliding.theta === 90 * (Math.PI / 180) ? 0 : block.width * Math.tan(sliding.theta);

  const originY =
    sliding.theta === 90 * (Math.PI / 180)
      ? slideY
      : Math.floor(
          y +
            h * Math.sin(sliding.theta) -
            block.width / Math.cos(sliding.theta)
        );
  const originX =
    sliding.theta === 90 * (Math.PI / 180)
      ? block.width
      : Math.floor(x + h * Math.cos(sliding.theta));

  return [originX, originY];
}

function drawBlock() {
  ctx.save();
  const [originX, originY] = blockPosition(blockOriginX, blockOriginY);

  ctx.translate(originX, originY - 1);
  ctx.rotate(sliding.theta);

  ctx.fillStyle = "#C8a2c8";
  ctx.fillRect(sliding.x, 0, block.width, block.width);

  ctx.restore();
}

function resetValues() {
  slideX = calcWidth();
  slideY = calcHeight();
  blockOriginX = 0;
  blockOriginY = slideY;
  sliding.x = 0;
  sliding.a = 0;
  sliding.v = 0;
}

function slide() {
  const fParallel = block.m * sliding.g * Math.sin(sliding.theta);
  const fPerpendicular =
    sliding.mu * block.m * sliding.g * Math.cos(sliding.theta);
  const fNet = fParallel - fPerpendicular;

  if (fNet > 0) sliding.a = fNet / block.m;
  else {
    sliding.a = 0;
    sliding.v = 0;
  }

  document.querySelector(".net-force-value").innerHTML = `${fNet.toFixed(3)} N`;
  document.querySelector(".vel-value").innerHTML = `${sliding.v.toFixed(
    3
  )} m/s`;
  document.querySelector(".accl-value").innerHTML = `${sliding.a.toFixed(
    3
  )} m/s <sup>2</sup>`;

  if (Math.tan(sliding.theta) > sliding.mu && sliding.theta !== 90 * (Math.PI / 180)) {
    sliding.x += sliding.v / 10;
    sliding.v += sliding.a;
    if (sliding.x > slideX / Math.cos(sliding.theta)) {
      resetValues();
    }
  } else {
    sliding.x += sliding.v / 10;
    sliding.v += sliding.a;
    if (sliding.x > canvas.height) {
      resetValues();
    }
  }
}

function loop() {
  if (isRunning) {
    ctx.clearRect(0, 0, width, height);
    drawSlide();
    drawBlock();
    slide();
    requestAnimationFrame(loop);
  }
}
loop();

muRange.addEventListener("input", (e) => {
  muRangeNumber.value = e.target.value;
  sliding.mu = e.target.value;
  sliding.x = 0;
});

muRangeNumber.addEventListener("input", (e) => {
  muRange.value = e.target.value;
  sliding.mu = e.target.value;
  sliding.x = 0;
});

document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (isRunning) isRunning = false;
    else {
      isRunning = true;
      loop();
    }
  }
});

mass.addEventListener("input", (e) => {
  block.m = e.target.value;
  sliding.x = 0;
});

angleRange.addEventListener("input", (e) => {
  angleNumber.value = e.target.value;
  sliding.theta = (e.target.value * Math.PI) / 180;
  slideX = calcWidth();
  slideY = calcHeight();
  blockOriginY = slideY;
});

angleNumber.addEventListener("input", (e) => {
  angleRange.value = e.target.value;
  sliding.theta = (e.target.value * Math.PI) / 180;
  slideX = calcWidth();
  slideY = calcHeight();
  blockOriginY = slideY;
});
