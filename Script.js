const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// move origin to center of canvas, flip y so it matches turtle coords
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(1, -1);

const colors = ["red", "blue", "lime", "yellow", "cyan", "magenta", "orange", "pink"];

function drawStar(x, y, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  let dx = x, dy = y;
  let angle = 0;
  for (let k = 0; k < 8; k++) {
    const rad = angle * Math.PI / 180;
    const tipX = dx + 6 * Math.cos(rad);
    const tipY = dy + 6 * Math.sin(rad);
    ctx.moveTo(dx, dy);
    ctx.lineTo(tipX, tipY);
    angle += 45;
  }
  ctx.stroke();
}

const originX = 0;
const originY = 40; // fixed point all lines radiate from

for (let i = 0; i < 120; i++) {
  const angle = i * (Math.PI * 2) / 120;

  const x = 16 * Math.pow(Math.sin(angle), 3) * 15;
  const y = (13 * Math.cos(angle)
            - 5 * Math.cos(2 * angle)
            - 2 * Math.cos(3 * angle)
            - Math.cos(4 * angle)) * 15;

  const color = colors[Math.floor(Math.random() * colors.length)];

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(x, y);
  ctx.stroke();

  drawStar(x, y, color);
}
