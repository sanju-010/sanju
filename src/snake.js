/* ------------------- Grid-based snake that grows with food color -------------------
   - Replaces previous snake logic.
   - Movement is grid-based (orthogonal) toward the mouse/touch.
   - When food is eaten, its color is queued and applied to the NEW tail block.
   - Drop this in after your <canvas id="snakeCanvas"> exists and remove old snake code.
----------------------------------------------------------------------------- */
(function () {
  const canvas = document.getElementById("snakeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const blockSize = 20;    // pixel size of each square
  const tickMs = 100;      // movement tick (ms) - lower = faster
  let width = 0, height = 0;

  function resizeCanvas() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    // snap snake and food to new grid when resizing
    if (snake && snake.length) {
      snake = snake.map(s => ({ x: snap(s.x), y: snap(s.y), color: s.color }));
    }
    if (food) food = spawnFood();
  });

  function snap(v) { return Math.round(v / blockSize) * blockSize; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // initial snake: 3 yellow blocks
  let snake = [];
  function initSnake() {
    snake = [];
    const startX = snap(width / 2);
    const startY = snap(height / 2);
    for (let i = 0; i < 3; i++) {
      snake.push({ x: startX - i * blockSize, y: startY, color: "yellow" });
    }
  }

  // spawn food on grid not overlapping snake
  function spawnFood() {
    const colors = ["red", "green", "blue", "purple"];
    const cols = Math.max(1, Math.floor(width / blockSize));
    const rows = Math.max(1, Math.floor(height / blockSize));
    let tries = 0;
    while (tries++ < 500) {
      const x = Math.floor(Math.random() * cols) * blockSize;
      const y = Math.floor(Math.random() * rows) * blockSize;
      const collision = snake.some(s => s.x === x && s.y === y);
      if (!collision) {
        return { x, y, color: colors[Math.floor(Math.random() * colors.length)] };
      }
    }
    return { x: 0, y: 0, color: colors[0] };
  }

  // game state
  let food = null;
  let colorQueue = []; // holds colors to be added to tail (in order eaten)
  let target = { x: 0, y: 0 };

  // pointer support
  function updatePointerFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    const clientY = (e.touches ? e.touches[0].clientY : e.clientY);
    target.x = clamp(clientX - rect.left, 0, width - 1);
    target.y = clamp(clientY - rect.top, 0, height - 1);
  }
  canvas.addEventListener("mousemove", updatePointerFromEvent);
  canvas.addEventListener("touchmove", (e) => { e.preventDefault(); updatePointerFromEvent(e); }, { passive: false });

  // init
  function reset() {
    resizeCanvas();
    initSnake();
    food = spawnFood();
    colorQueue = [];
    // default pointer to center
    target.x = width / 2;
    target.y = height / 2;
  }
  reset();

  // draw block with border to mimic site theme
  function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, blockSize, blockSize);
  }

  // movement tick (grid-based, orthogonal preference)
  function tick() {
    if (!snake.length) return;

    const head = snake[0];

    // compute snapped target cell
    const targetCellX = snap(target.x);
    const targetCellY = snap(target.y);

    const dx = targetCellX - head.x;
    const dy = targetCellY - head.y;

    // choose axis to move (prefer larger distance)
    let stepX = 0, stepY = 0;
    if (Math.abs(dx) > Math.abs(dy)) stepX = Math.sign(dx);
    else if (Math.abs(dy) > 0) stepY = Math.sign(dy);
    else { /* target on same cell */ render(); return; }

    const newHeadX = clamp(head.x + stepX * blockSize, 0, Math.max(0, width - blockSize));
    const newHeadY = clamp(head.y + stepY * blockSize, 0, Math.max(0, height - blockSize));
    // if newHead equals current head (edge), nothing to do
    if (newHeadX === head.x && newHeadY === head.y) { render(); return; }

    const newHead = { x: newHeadX, y: newHeadY, color: head.color }; // head keeps its color

    // add head
    snake.unshift(newHead);

    // check food collision (exact grid equality)
    if (food && newHead.x === food.x && newHead.y === food.y) {
      // queue the food color (will be applied to the new tail)
      colorQueue.push(food.color);
      food = spawnFood();
    }

    // growth handling:
    if (colorQueue.length > 0) {
      // DO NOT pop the tail — snake grows
      // assign the queued color to the current tail (so that new length includes that color)
      const colorToApply = colorQueue.shift();
      // The tail is currently at snake[snake.length - 1]
      // We want the new extra block to show as the eaten color.
      // To ensure growth shows correctly, set the existing tail's color (it already exists and will remain),
      // so the visible tail will change to the eaten color.
      snake[snake.length - 1].color = colorToApply;
      // (no pop)
    } else {
      // normal movement - remove tail
      snake.pop();
    }

    // optional: keep snake trimmed if extremely long
    const maxSegments = 500;
    if (snake.length > maxSegments) {
      snake.length = maxSegments;
    }

    render();
  }

  // render everything
  function render() {
    ctx.clearRect(0, 0, width, height);
    // draw food first so snake sits above it visually
    if (food) drawBlock(food.x, food.y, food.color);
    // draw snake segments from tail to head (so head is on top)
    for (let i = snake.length - 1; i >= 0; i--) {
      drawBlock(snake[i].x, snake[i].y, snake[i].color);
    }
  }

  // run tick on interval
  let tickHandle = setInterval(tick, tickMs);

  // reset & re-init on big resizes
  window.addEventListener("resize", () => {
    clearInterval(tickHandle);
    resizeCanvas();
    // ensure positions snap to grid
    snake = snake.map(s => ({ x: snap(s.x), y: snap(s.y), color: s.color }));
    food = spawnFood();
    tickHandle = setInterval(tick, tickMs);
  });

})();
