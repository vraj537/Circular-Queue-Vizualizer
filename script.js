const $ = id => document.getElementById(id);

let currentMode = 'array'; // 'array' | 'singly' | 'doubly'
let capacity = 8;
let queueData = new Array(capacity).fill(null);
let front = -1;
let rear = -1;
let animSpeed = 200;
let isBusy = false;

// C Source implementations
const codeFiles = {
  array: {
    filename: 'circularqueue_array.c',
    lines: [
      { n: 1, c: '#include <stdio.h>' },
      { n: 2, c: '#define SIZE 50' },
      { n: 3, c: 'int queue[SIZE]; int front = -1, rear = -1;' },
      { n: 4, c: 'void enqueue(int value) {' },
      { n: 5, c: '    if ((rear + 1) % SIZE == front) {' },
      { n: 6, c: '        printf("Queue Overflow\n"); return;' },
      { n: 7, c: '    }' },
      { n: 8, c: '    if (front == -1) front = 0;' },
      { n: 9, c: '    rear = (rear + 1) % SIZE;' },
      { n: 10, c: '    queue[rear] = value;' },
      { n: 11, c: '}' },
      { n: 12, c: 'void dequeue() {' },
      { n: 13, c: '    if (front == -1) {' },
      { n: 14, c: '        printf("Queue Underflow\n"); return;' },
      { n: 15, c: '    }' },
      { n: 16, c: '    if (front == rear) { front = rear = -1; }' },
      { n: 17, c: '    else { front = (front + 1) % SIZE; }' },
      { n: 18, c: '}' }
    ]
  },
  singly: {
    filename: 'circularqueue_singly_ll.c',
    lines: [
      { n: 1, c: '#include <stdio.h>\n#include <stdlib.h>' },
      { n: 2, c: 'typedef struct Node {' },
      { n: 3, c: '    int data;' },
      { n: 4, c: '    struct Node* next;' },
      { n: 5, c: '} Node;' },
      { n: 6, c: 'Node *front = NULL, *rear = NULL;' },
      { n: 7, c: 'void enqueue(int val) {' },
      { n: 8, c: '    Node* nn = (Node*)malloc(sizeof(Node)); nn->data = val;' },
      { n: 9, c: '    if (!front) { front = rear = nn; rear->next = front; }' },
      { n: 10, c: '    else { rear->next = nn; rear = nn; rear->next = front; }' },
      { n: 11, c: '}' },
      { n: 12, c: 'void dequeue() {' },
      { n: 13, c: '    if (!front) { printf("Underflow\n"); return; }' },
      { n: 14, c: '    if (front == rear) { free(front); front = rear = NULL; }' },
      { n: 15, c: '    else { Node* t = front; front = front->next; rear->next = front; free(t); }' },
      { n: 16, c: '}' }
    ]
  },
  doubly: {
    filename: 'circularqueue_doubly_ll.c',
    lines: [
      { n: 1, c: '#include <stdio.h>\n#include <stdlib.h>' },
      { n: 2, c: 'typedef struct Node {' },
      { n: 3, c: '    int data;' },
      { n: 4, c: '    struct Node *prev, *next;' },
      { n: 5, c: '} Node;' },
      { n: 6, c: 'Node *front = NULL, *rear = NULL;' },
      { n: 7, c: 'void enqueue(int val) {' },
      { n: 8, c: '    Node* nn = (Node*)malloc(sizeof(Node)); nn->data = val;' },
      { n: 9, c: '    if (!front) { front = rear = nn; rear->next = front; front->prev = rear; }' },
      { n: 10, c: '    else { rear->next = nn; nn->prev = rear; rear = nn;' },
      { n: 11, c: '      rear->next = front; front->prev = rear; }' },
      { n: 12, c: '}' },
      { n: 13, c: 'void dequeue() {' },
      { n: 14, c: '    if (!front) { printf("Underflow\n"); return; }' },
      { n: 15, c: '    if (front == rear) { free(front); front = rear = NULL; }' },
      { n: 16, c: '    else { Node* t = front; front = front->next;' },
      { n: 17, c: '      front->prev = rear; rear->next = front; free(t); }' },
      { n: 18, c: '}' }
    ]
  }
};

// Canvas Engine Setup
const canvas = $('renderCanvas');
const ctx = canvas.getContext('2d');

function setupCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', () => {
  setupCanvas();
  drawVisualizer();
});

window.onload = () => {
  setupCanvas();
  renderCodeInspector();
  drawVisualizer();
};

// Mode & Speed handlers
document.querySelectorAll("#modeSeg button").forEach(btn => {
  btn.onclick = () => {
    if (isBusy) return;
    document.querySelectorAll("#modeSeg button").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    currentMode = btn.dataset.mode;
    resetQueue();
    renderCodeInspector();
    logConsole(`Switched queue mode to: ${btn.textContent}`, 'info');
  };
});

document.querySelectorAll("#speeds button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#speeds button").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    animSpeed = parseInt(btn.dataset.s);
  };
});

function renderCodeInspector() {
  const f = codeFiles[currentMode];
  $('codeFilename').textContent = f.filename;
  $('codeContainer').innerHTML = f.lines.map(l => `<div class="code-line" id="cl-${l.n}"><span class="num">${l.n}</span>${escapeHtml(l.c)}</div>`).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function highlightLines(lines) {
  if (animSpeed === 0) return;
  document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
  for (let n of lines) {
    const el = $(`cl-${n}`);
    if (el) el.classList.add('active');
  }
  await new Promise(r => setTimeout(r, animSpeed));
}

function clearHighlights() {
  document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
}

function changeCapacity(val) {
  let c = parseInt(val);
  if (isNaN(c) || c < 3 || c > 50) return;
  capacity = c;
  queueData = new Array(capacity).fill(null);
  resetQueue();
  logConsole(`Updated capacity limit to ${capacity} nodes.`, 'info');
}

function resetQueue() {
  front = -1;
  rear = -1;
  queueData = new Array(capacity).fill(null);
  $('statusBadge').textContent = "STATUS: READY";
  $('statusBadge').style.color = "var(--teal)";
  updateMetrics();
  drawVisualizer();
  clearHighlights();
  logConsole("Queue reset.", 'info');
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
  $('mFormula').textContent = currentMode === 'array' ? '(R + 1) % ' + capacity : 'node->next';
  $('canvasModeLabel').textContent = `${currentMode.toUpperCase()} Mode (${capacity} Max Capacity)`;
  $('viewModeNotice').textContent = currentMode === 'array' ? "Array Ring" : "Circular Node Layout";
}

// Queue Operations
async function handleEnqueue() {
  let val = parseInt($('enqueueVal').value);
  if (isNaN(val)) val = Math.floor(Math.random() * 90) + 10;
  $('enqueueVal').value = val + 5;
  await executeEnqueue(val);
}

async function handleRandomEnqueue() {
  let val = Math.floor(Math.random() * 90) + 10;
  await executeEnqueue(val);
}

async function executeEnqueue(val) {
  if (isBusy) return;
  isBusy = true;

  if (currentMode === 'array') {
    await highlightLines([4, 5]);
    if ((rear + 1) % capacity === front) {
      await highlightLines([6]);
      $('statusBadge').textContent = "STATUS: OVERFLOW";
      $('statusBadge').style.color = "var(--rose)";
      logConsole(`Enqueue(${val}) OVERFLOW! Queue buffer is full.`, 'error');
      isBusy = false;
      clearHighlights();
      return;
    }
    await highlightLines([8]);
    if (front === -1) front = 0;
    await highlightLines([9]);
    rear = (rear + 1) % capacity;
    await highlightLines([10]);
    queueData[rear] = val;
  } else {
    let count = countActive();
    await highlightLines([7, 8]);
    if (count >= capacity) {
      $('statusBadge').textContent = "STATUS: OVERFLOW";
      $('statusBadge').style.color = "var(--rose)";
      logConsole(`Enqueue(${val}) Linked list allocation reached max capacity limit (${capacity}).`, 'error');
      isBusy = false;
      clearHighlights();
      return;
    }
    await highlightLines([9]);
    if (front === -1) {
      front = 0;
      rear = 0;
    } else {
      await highlightLines([10]);
      rear = (rear + 1) % capacity;
    }
    queueData[rear] = val;
  }

  $('statusBadge').textContent = "STATUS: ACTIVE";
  $('statusBadge').style.color = "var(--teal)";
  logConsole(`Enqueued element: ${val} at index [${rear}]`, 'success');
  updateMetrics();
  drawVisualizer();
  isBusy = false;
  clearHighlights();
}

async function handleDequeue() {
  if (isBusy) return;
  isBusy = true;

  await highlightLines([12, 13]);
  if (front === -1) {
    await highlightLines([14]);
    $('statusBadge').textContent = "STATUS: UNDERFLOW";
    $('statusBadge').style.color = "var(--rose)";
    logConsole(`Dequeue UNDERFLOW! Queue is completely empty.`, 'error');
    isBusy = false;
    clearHighlights();
    return;
  }

  let removedVal = queueData[front];
  queueData[front] = null;

  await highlightLines([15]);
  if (front === rear) {
    front = -1;
    rear = -1;
  } else {
    await highlightLines([16]);
    front = (front + 1) % capacity;
  }

  if (front === -1) {
    $('statusBadge').textContent = "STATUS: READY";
    $('statusBadge').style.color = "var(--teal)";
  }

  logConsole(`Dequeued element ${removedVal} from front node.`, 'success');
  updateMetrics();
  drawVisualizer();
  isBusy = false;
  clearHighlights();
}

function handlePeek() {
  if (front === -1) {
    logConsole("Peek failed: Queue is empty.", 'warn');
    return;
  }
  logConsole(`[Peek]: Front = ${queueData[front]} (index ${front}), Rear = ${queueData[rear]} (index ${rear})`, 'gold');
}

async function handleAutoFill() {
  if (isBusy) return;
  resetQueue();
  logConsole(`Auto-filling buffer up to capacity ${capacity}...`, 'info');
  for (let i = 0; i < capacity; i++) {
    let val = Math.floor(Math.random() * 90) + 10;
    if (front === -1) front = 0;
    rear = (rear + 1) % capacity;
    queueData[rear] = val;
  }
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

// Visualizer Rendering Logic
function drawVisualizer() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  if (currentMode === 'array') {
    drawArrayRing(width, height);
  } else {
    drawNodeLinkedList(width, height);
  }
}

function drawArrayRing(w, h) {
  const centerX = w / 2;
  const centerY = h / 2;
  const radius = Math.min(w, h) / 2 - 45;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 4;
  ctx.stroke();

  for (let i = 0; i < capacity; i++) {
    let angle = (i * 2 * Math.PI / capacity) - Math.PI / 2;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);

    let isFront = (i === front);
    let isRear = (i === rear);
    let isFilled = (queueData[i] !== null);

    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = isFilled ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.04)';
    ctx.fill();
    ctx.strokeStyle = isFront ? '#3ee0c4' : isRear ? '#ffd166' : isFilled ? '#8b7cff' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = isFront || isRear ? 3 : 1.5;
    ctx.stroke();

    ctx.fillStyle = isFilled ? '#eef0ff' : '#6b7280';
    ctx.font = 'bold 12px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isFilled ? queueData[i] : '--', x, y);

    let labelR = radius + 24;
    let lx = centerX + labelR * Math.cos(angle);
    let ly = centerY + labelR * Math.sin(angle);
    ctx.fillStyle = isFront ? '#3ee0c4' : isRear ? '#ffd166' : '#98a0c4';
    ctx.font = '10px "DM Sans"';
    ctx.fillText(`[${i}]`, lx, ly);

    if (isFront) drawBadge(ctx, x - 15, y - 28, 'FRONT', '#3ee0c4');
    if (isRear) drawBadge(ctx, x + 5, y - 28, 'REAR', '#ffd166');
  }
}

// Dual-Compartment Struct Node Renderer for Singly & Doubly LL
function drawNodeLinkedList(w, h) {
  const centerX = w / 2;
  const centerY = h / 2;
  const radius = Math.min(w, h) / 2 - 50;

  const nodeW = currentMode === 'doubly' ? 74 : 64;
  const nodeH = 34;

  let coords = [];

  for (let i = 0; i < capacity; i++) {
    let angle = (i * 2 * Math.PI / capacity) - Math.PI / 2;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    coords.push({x, y, angle});

    let isFront = (i === front);
    let isRear = (i === rear);
    let isFilled = (queueData[i] !== null);

    ctx.save();
    ctx.translate(x, y);

    // Node Outer Box
    ctx.fillStyle = isFilled ? '#1e293b' : 'rgba(15, 23, 42, 0.6)';
    ctx.strokeStyle = isFront ? '#3ee0c4' : isRear ? '#ffd166' : isFilled ? '#8b7cff' : '#334155';
    ctx.lineWidth = isFront || isRear ? 2.5 : 1.5;

    ctx.beginPath();
    ctx.roundRect(-nodeW/2, -nodeH/2, nodeW, nodeH, 6);
    ctx.fill();
    ctx.stroke();

    if (currentMode === 'singly') {
      // 2 Compartments: DATA | NEXT
      let divX = -nodeW/2 + 38;

      ctx.beginPath();
      ctx.moveTo(divX, -nodeH/2);
      ctx.lineTo(divX, nodeH/2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Data Text
      ctx.fillStyle = isFilled ? '#38bdf8' : '#475569';
      ctx.font = 'bold 11px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isFilled ? queueData[i] : '-', -nodeW/2 + 19, 0);

      // Next Ptr Label
      ctx.fillStyle = isFilled ? '#a5b4fc' : '#475569';
      ctx.font = '9px "JetBrains Mono"';
      ctx.fillText('next', divX + 13, 0);

    } else {
      // 3 Compartments: PREV | DATA | NEXT
      let divX1 = -nodeW/2 + 22;
      let divX2 = -nodeW/2 + 52;

      ctx.beginPath();
      ctx.moveTo(divX1, -nodeH/2);
      ctx.lineTo(divX1, nodeH/2);
      ctx.moveTo(divX2, -nodeH/2);
      ctx.lineTo(divX2, nodeH/2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isFilled ? '#ffd166' : '#475569';
      ctx.font = '8px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P', -nodeW/2 + 11, 0);

      ctx.fillStyle = isFilled ? '#38bdf8' : '#475569';
      ctx.font = 'bold 11px "JetBrains Mono"';
      ctx.fillText(isFilled ? queueData[i] : '-', -nodeW/2 + 37, 0);

      ctx.fillStyle = isFilled ? '#a5b4fc' : '#475569';
      ctx.font = '8px "JetBrains Mono"';
      ctx.fillText('N', -nodeW/2 + 63, 0);
    }

    // Index & Pointer Tags
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.fillText(`0x${(1000 + i).toString(16)}`, 0, -nodeH/2 - 8);

    if (isFront) drawBadge(ctx, -20, nodeH/2 + 6, 'FRONT', '#3ee0c4');
    if (isRear) drawBadge(ctx, 10, nodeH/2 + 6, 'REAR', '#ffd166');

    ctx.restore();
  }

  // Draw Node Pointer Connections
  if (front !== -1) {
    let i = front;
    while (true) {
      let nextIdx = (i + 1) % capacity;
      let p1 = coords[i];
      let p2 = coords[nextIdx];

      if (i === rear && currentMode === 'singly') {
        // Draw Tail -> Front circular wrap curve
        drawCircularWrapArrow(ctx, p1, p2, centerX, centerY, radius, '#8b7cff');
        break;
      }

      drawArrow(ctx, p1.x, p1.y, p2.x, p2.y, '#8b7cff');

      if (currentMode === 'doubly') {
        drawArrow(ctx, p2.x, p2.y, p1.x, p1.y, '#ffd166');
        if (i === rear) {
          drawCircularWrapArrow(ctx, p2, p1, centerX, centerY, radius - 15, '#ffd166');
        }
      }

      if (i === rear) break;
      i = (i + 1) % capacity;
    }
  }
}

function drawBadge(ctx, x, y, text, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 32, 11);
  ctx.fillStyle = '#070814';
  ctx.font = 'bold 7px "Syne"';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + 16, y + 8);
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const headlen = 7;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
  ctx.fillStyle = color;
  ctx.fill();
}

function drawCircularWrapArrow(ctx, p1, p2, cx, cy, r, color) {
  ctx.beginPath();
  ctx.arc(cx, cy, r - 35, p1.angle, p2.angle, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Navigation Spy
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.dock a').forEach(a => a.classList.toggle('on', a.dataset.s === e.target.id));
    }
  });
}, {rootMargin: '-35% 0px -55% 0px'});
document.querySelectorAll('section').forEach(s => spy.observe(s));
