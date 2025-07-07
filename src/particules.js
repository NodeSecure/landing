(function particulesIIFE() {
  const palette = ["#00D1FF", "#3722AF", "#5A44DA"];
  const canvas = document.getElementById("network-bg");
  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const points = [];
  const numPoints = Math.floor((width * height) / 9000);
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    // Draw lines
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (dist < 120) {
          ctx.globalAlpha = 0.18;
          ctx.strokeStyle = points[i].color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    // Draw points
    for (const p of points) {
      ctx.globalAlpha = 0.38;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function animate() {
    for (const p of points) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > width) {
        p.dx *= -1;
      }
      if (p.y < 0 || p.y > height) {
        p.dy *= -1;
      }
    }
    draw();
    requestAnimationFrame(animate);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener("resize", resize);

  animate();
}());
