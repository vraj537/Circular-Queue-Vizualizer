const $ = id => document.getElementById(id);

let capacity = 8;
const MAX_CAPACITY = 15;
let queueData = new Array(capacity).fill(null);
let front = -1;
let rear = -1;
let animSpeed = 200;
let isBusy = false;

const codeFiles = {
  array: {
    filename: 'circularqueue_array.c',
    lines: [
      { n: 1, c: "#include <stdio.h>" },
      { n: 2, c: "#define SIZE 50" },
      { n: 3, c: "" },
      { n: 4, c: "int queue[SIZE];" },
      { n: 5, c: "int front = -1;" },
      { n: 6, c: "int rear = -1;" },
      { n: 7, c: "" },
      { n: 8, c: "void enqueue(int value) {" },
      { n: 9, c: "    if ((rear + 1) % SIZE == front) {" },
      { n: 10, c: "        printf(\"Queue Overflow\\n\");" },
      { n: 11, c: "        return;" },
      { n: 12, c: "    }" },
      { n: 13, c: "    if (front == -1) front = 0;" },
      { n: 14, c: "    rear = (rear + 1) % SIZE;" },
      { n: 15, c: "    queue[rear] = value;" },
      { n: 16, c: "    printf(\"Enqueued %d at index %d\\n\", value, rear);" },
      { n: 17, c: "}" },
      { n: 18, c: "" },
      { n: 19, c: "void dequeue() {" },
      { n: 20, c: "    if (front == -1) {" },
      { n: 21, c: "        printf(\"Queue Underflow\\n\");" },
      { n: 22, c: "        return;" },
      { n: 23, c: "    }" },
      { n: 24, c: "    printf(\"Dequeued %d from index %d\\n\", queue[front], front);" },
      { n: 25, c: "    if (front == rear) {" },
      { n: 26, c: "        front = -1;" },
      { n: 27, c: "        rear = -1;" },
      { n: 28, c: "    } else {" },
      { n: 29, c: "        front = (front + 1) % SIZE;" },
      { n: 30, c: "    }" },
      { n: 31, c: "}" },
      { n: 32, c: "" },
      { n: 33, c: "void display() {" },
      { n: 34, c: "    if (front == -1) {" },
      { n: 35, c: "        printf(\"Queue is empty\\n\");" },
      { n: 36, c: "        return;" },
      { n: 37, c: "    }" },
      { n: 38, c: "    int i = front;" },
      { n: 39, c: "    printf(\"Queue elements: \");" },
      { n: 40, c: "    while (1) {" },
      { n: 41, c: "        printf(\"%d \", queue[i]);" },
      { n: 42, c: "        if (i == rear) break;" },
      { n: 43, c: "        i = (i + 1) % SIZE;" },
      { n: 44, c: "    }" },
      { n: 45, c: "    printf(\"\\n\");" },
      { n: 46, c: "}" },
      { n: 47, c: "" },
      { n: 48, c: "int main() {" },
      { n: 49, c: "    enqueue(10);" },
      { n: 50, c: "    enqueue(20);" },
      { n: 51, c: "    enqueue(30);" },
      { n: 52, c: "    display();" },
      { n: 53, c: "    dequeue();" },
      { n: 54, c: "    display();" },
      { n: 55, c: "    return 0;" },
      { n: 56, c: "}" }
    ]
  }
};

const HL = {
  array: {
    enqCheck: [8, 9],
    enqOverflow: [10, 11],
    enqFront: [13],
    enqRear: [14],
    enqStore: [15],
    enqPrint: [16],
    deqCheck: [19, 20],
    deqUnder: [21, 22],
    deqPrint: [24],
    deqIfSingle: [25],
    deqSingle: [26, 27],
    deqElse: [28, 29]
  }
};

let canvas;
let ctx;

function setupCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', () => {
  if (canvas) {
    setupCanvas();
    drawVisualizer();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  canvas = $('renderCanvas');
  ctx = canvas.getContext('2d');

  document.querySelectorAll('#speeds button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#speeds button').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      animSpeed = parseInt(btn.dataset.s);
    };
  });

  setupCanvas();
  renderCodeInspector();
  drawVisualizer();
});

function renderCodeInspector() {
  const f = codeFiles.array;
  $('codeFilename').textContent = f.filename;
  $('codeContainer').innerHTML = f.lines.map(l => `<div class="code-line" id="cl-${l.n}"><span class="num">${l.n}</span>${escapeHtml(l.c)}</div>`).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function highlightLines(lines) {
  if (animSpeed === 0) return;
  document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
  for (const n of lines) {
    const el = $(`cl-${n}`);
    if (el) el.classList.add('active');
  }
  const box = $('codeContainer');
  const firstEl = $(`cl-${lines[0]}`);
  if (box && firstEl) box.scrollTop = Math.max(0, firstEl.offsetTop - box.clientHeight / 2);
  await new Promise(resolve => setTimeout(resolve, animSpeed));
}

function clearHighlights() {
  document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
}

function changeCapacity(val) {
  let c = parseInt(val);
  if (isNaN(c) || c < 3) c = 3;
  if (c > MAX_CAPACITY) c = MAX_CAPACITY;
  $('inputCap').value = c;
  capacity = c;
  queueData = new Array(capacity).fill(null);
  resetQueue();
  logConsole(`Updated capacity limit to ${capacity} slots.`, 'info');
}

function resetQueue() {
  front = -1;
  rear = -1;
  queueData = new Array(capacity).fill(null);
  $('statusBadge').textContent = 'STATUS: READY';
  $('statusBadge').style.color = 'var(--teal)';
  updateMetrics();
  drawVisualizer();
  clearHighlights();
  logConsole('Queue reset.', 'info');
}

function countActive() {
  if (front === -1) return 0;
  if (rear >= front) return rear - front + 1;
  return capacity - front + rear + 1;
}

function updateMetrics() {
  $('mFront').textContent = front;
  $('mRear').textContent = rear;
  $('mItems').textContent = `${countActive()} / ${capacity}`;
  $('mFormula').textContent = '(R + 1) % ' + capacity;
  $('canvasModeLabel').textContent = `Array Buffer (${capacity} Slots)`;
  $('viewModeNotice').textContent = 'Circular Array Ring';
}

async function handleEnqueue() {
  let val = parseInt($('enqueueVal').value);
  if (isNaN(val)) val = Math.floor(Math.random() * 90) + 10;
  $('enqueueVal').value = val + 5;
  await executeEnqueue(val);
}

async function handleRandomEnqueue() {
  const val = Math.floor(Math.random() * 90) + 10;
  await executeEnqueue(val);
}

async function executeEnqueue(val) {
  if (isBusy) return;
  isBusy = true;
  const h = HL.array;

  await highlightLines(h.enqCheck);
  if ((rear + 1) % capacity === front) {
    await highlightLines(h.enqOverflow);
    $('statusBadge').textContent = 'STATUS: OVERFLOW';
    $('statusBadge').style.color = 'var(--rose)';
    logConsole(`Enqueue(${val}) OVERFLOW! Queue buffer is full.`, 'error');
    isBusy = false;
    clearHighlights();
    return;
  }
  await highlightLines(h.enqFront);
  if (front === -1) front = 0;
  await highlightLines(h.enqRear);
  rear = (rear + 1) % capacity;
  await highlightLines(h.enqStore);
  queueData[rear] = val;
  await highlightLines(h.enqPrint);

  $('statusBadge').textContent = 'STATUS: ACTIVE';
  $('statusBadge').style.color = 'var(--teal)';
  logConsole(`Enqueued element: ${val} at index [${rear}]`, 'success');
  updateMetrics();
  drawVisualizer();
  isBusy = false;
  clearHighlights();
}

async function handleDequeue() {
  if (isBusy) return;
  isBusy = true;
  const h = HL.array;

  await highlightLines(h.deqCheck);
  if (front === -1) {
    await highlightLines(h.deqUnder);
    $('statusBadge').textContent = 'STATUS: UNDERFLOW';
    $('statusBadge').style.color = 'var(--rose)';
    logConsole('Dequeue UNDERFLOW! Queue is completely empty.', 'error');
    isBusy = false;
    clearHighlights();
    return;
  }

  const removedVal = queueData[front];
  queueData[front] = null;

  await highlightLines(h.deqPrint);
  await highlightLines(h.deqIfSingle);
  if (front === rear) {
    await highlightLines(h.deqSingle);
    front = -1;
    rear = -1;
  } else {
    await highlightLines(h.deqElse);
    front = (front + 1) % capacity;
  }

  if (front === -1) {
    $('statusBadge').textContent = 'STATUS: READY';
    $('statusBadge').style.color = 'var(--teal)';
  }

  logConsole(`Dequeued element ${removedVal} from the front slot.`, 'success');
  updateMetrics();
  drawVisualizer();
  isBusy = false;
  clearHighlights();
}

function handlePeek() {
  if (front === -1) {
    logConsole('Peek failed: Queue is empty.', 'warn');
    return;
  }
  logConsole(`[Peek]: Front = ${queueData[front]} (index ${front}), Rear = ${queueData[rear]} (index ${rear})`, 'gold');
}

async function handleAutoFill() {
  if (isBusy) return;
  resetQueue();
  logConsole(`Auto-filling buffer up to capacity ${capacity}...`, 'info');
  for (let i = 0; i < capacity; i++) {
    const val = Math.floor(Math.random() * 90) + 10;
    if (front === -1) front = 0;
    rear = (rear + 1) % capacity;
    queueData[rear] = val;
  }
  $('statusBadge').textContent = 'STATUS: ACTIVE';
  $('statusBadge').style.color = 'var(--teal)';
  updateMetrics();
  drawVisualizer();
  logConsole(`Buffer filled with ${capacity} elements.`, 'success');
}

function logConsole(text, type = 'info') {
  const box = $('consoleLog');
  const div = document.createElement('div');
  div.className = `log-${type}`;
  const time = new Date().toLocaleTimeString();
  div.textContent = `[${time}] ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function clearConsole() {
  $('consoleLog').innerHTML = '<div class="log-info">[System] Log cleared.</div>';
}

function drawVisualizer() {
  if (!ctx || !canvas) return;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);
  drawArrayRing(width, height);
}

function drawArrayRing(w, h) {
  const centerX = w / 2;
  const centerY = h / 2;
  const radius = Math.min(w, h) / 2 - 50;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 4;
  ctx.stroke();

  for (let i = 0; i < capacity; i++) {
    const angle = (i * 2 * Math.PI / capacity) - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const isFront = i === front;
    const isRear = i === rear;
    const isFilled = queueData[i] !== null;

    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = isFilled ? '#1e1b4b' : 'rgba(15, 23, 42, 0.8)';
    ctx.fill();
    ctx.strokeStyle = isFront ? '#3ee0c4' : isRear ? '#ffd166' : isFilled ? '#8b7cff' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = isFront || isRear ? 3 : 1.5;
    ctx.stroke();

    ctx.fillStyle = isFilled ? '#38bdf8' : '#6b7280';
    ctx.font = 'bold 15px "Times New Roman", Times, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isFilled ? queueData[i] : '--', x, y);

    const labelR = radius + 26;
    const lx = centerX + labelR * Math.cos(angle);
    const ly = centerY + labelR * Math.sin(angle);
    ctx.fillStyle = isFront ? '#3ee0c4' : isRear ? '#ffd166' : '#98a0c4';
    ctx.font = '12px "Times New Roman", Times, serif';
    ctx.fillText(`[${i}]`, lx, ly);

    if (isFront) drawBadge(ctx, x - 16, y - 32, 'FRONT', '#3ee0c4');
    if (isRear) drawBadge(ctx, x - 16, y + 22, 'REAR', '#ffd166');
  }
}

function drawBadge(ctx, x, y, text, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 32, 11);
  ctx.fillStyle = '#070814';
  ctx.font = 'bold 9px "Times New Roman", Times, serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + 16, y + 8);
}
