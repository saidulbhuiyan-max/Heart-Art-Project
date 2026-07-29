const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colors = ["red", "blue", "lime", "yellow", "cyan", "magenta", "orange", "pink"];

const originX = 0;
const originY = 40; // fixed point all lines radiate from

// pre-compute each point on the heart curve + its assigned color (kept fixed so colors don't flicker)
const points = [];
for (let i = 0; i < 120; i++) {
  const angle = i * (Math.PI * 2) / 120;

  const x = 16 * Math.pow(Math.sin(angle), 3) * 15;
  const y = (13 * Math.cos(angle)
            - 5 * Math.cos(2 * angle)
            - 2 * Math.cos(3 * angle)
            - Math.cos(4 * angle)) * 15;

  const color = colors[Math.floor(Math.random() * colors.length)];
  points.push({ x, y, color });
}

function drawStar(x, y, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  let angle = 0;
  for (let k = 0; k < 8; k++) {
    const rad = angle * Math.PI / 180;
    const tipX = x + 6 * Math.cos(rad);
    const tipY = y + 6 * Math.sin(rad);
    ctx.moveTo(x, y);
    ctx.lineTo(tipX, tipY);
    angle += 45;
  }
  ctx.stroke();
}

let frame = 0;

function drawFrame() {
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // move origin to center of canvas, flip y so it matches turtle coords
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);

  // heartbeat pulse: scale oscillates gently between 0.92 and 1.08
  const pulse = 1 + 0.08 * Math.sin(frame * 0.05);
  ctx.scale(pulse, pulse);

  for (const p of points) {
    ctx.strokeStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    drawStar(p.x, p.y, p.color);
  }

  frame++;
  requestAnimationFrame(drawFrame);
}

drawFrame();
