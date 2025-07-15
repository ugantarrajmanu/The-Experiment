const width = 700;
const height = 500
let y = 207;
let mu = 1.33;
let mediumStartX = 200;
let mediumEndX = 300;
let lightSourceY = 250;

document.querySelector(".root").innerHTML = `<canvas class="container" height="${height}px" width="${width}px"></div>`;

let yRange = document.querySelector("#y-range");
let yRangeNumber = document.querySelector("#y-range-number");
let muRange = document.querySelector("#mu-range-number");
let mediumStartRange = document.querySelector("#medium-start-number");
let mediumEndRange = document.querySelector("#medium-end-number");

const canvas = document.querySelector(".container");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "rgb(43, 43, 43)";
ctx.fillRect(0, 0, width, height);


ctx.fillStyle = "rgba(66, 66, 66, 1)";
ctx.fillRect(mediumStartX, 0, (mediumEndX - mediumStartX), height);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// actual path : ok
function actualPath(y) {
  h = (width * Math.abs(lightSourceY - y)) / mediumStartX;

  if (y > lightSourceY) return lightSourceY + h;
  else return lightSourceY - h;
}

// incident angle : ok (degrees)
function incidentAngle(y) {
  return Math.atan(Math.abs(lightSourceY - y) / mediumStartX);
}

// refraction angle : ok (degrees)
function refractionAngle(y) {
  return Math.asin(Math.sin(incidentAngle(y) ) / mu);
}

// inside medium ray : ok
function insideMediumRay(y) {
  r = refractionAngle(y);
  h = (mediumEndX - mediumStartX) * Math.tan(r);

  if (y <= lightSourceY) return y - h;
  else return y + h;
}

// refracted path : ok
function refractedPath(y) {
  let i = incidentAngle(y);

  if (y <= lightSourceY)
    return insideMediumRay(y) - (width - mediumEndX) * Math.tan(i);
  else return insideMediumRay(y) + (width - mediumEndX) * Math.tan(i);
}

function createRay(y) {
  ctx.lineWidth = 2;
  clearGrid();

  // Actual path
  ctx.strokeStyle = "#C8a2c8";
  ctx.beginPath();
  ctx.moveTo(mediumStartX, y);
  ctx.lineTo(width, actualPath(y));
  ctx.stroke();

  // before medium
  ctx.strokeStyle = "#C8a2c8";
  ctx.beginPath();
  ctx.moveTo(0, lightSourceY);
  ctx.lineTo(mediumStartX, y);
  ctx.stroke();

  //inside medium
  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.moveTo(mediumStartX, y);
  ctx.lineTo(mediumEndX, insideMediumRay(y));
  ctx.stroke();

  // outside medium
  ctx.strokeStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(mediumEndX, insideMediumRay(y));
  ctx.lineTo(width, refractedPath(y));
  ctx.stroke();

  
}

function clearGrid() {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgb(43, 43, 43)";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(66, 66, 66, 1)";
  ctx.fillRect(mediumStartX, 0, mediumEndX - mediumStartX, width);
}

createRay(y);
yRange.addEventListener("input", (e) => {
  yRangeNumber.value = e.target.value;
  y = parseInt(e.target.value);
  createRay(y);
});

yRangeNumber.addEventListener("input", (e) => {
  yRange.value = e.target.value;
  y = parseInt(e.target.value);
  createRay(y);
});

muRange.addEventListener("input", (e) => {
  muRange.value = e.target.value;
  mu = parseFloat(e.target.value);
  createRay(y);
});

mediumStartRange.addEventListener("input", (e) => {
  mediumStartRange.value = e.target.value;
  mediumStartX = parseInt(e.target.value);
  createRay(y);
});

mediumEndRange.addEventListener("input", (e) => {
  mediumEndRange.value = e.target.value;
  mediumEndX = parseInt(e.target.value);
  createRay(y);
});