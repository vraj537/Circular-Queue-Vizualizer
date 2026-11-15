const $ = id => document.getElementById(id);

let currentMode = 'array';
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
  },
  singly: {
    filename: 'circularqueue_singly_ll.c',
    lines: [
      { n: 1, c: "#include <stdio.h>" },
      { n: 2, c: "#include <stdlib.h>" },
      { n: 3, c: "" },
      { n: 4, c: "typedef struct Node {" },
      { n: 5, c: "    int data;" },
      { n: 6, c: "    struct Node* next;" },
      { n: 7, c: "} Node;" },
      { n: 8, c: "" },
      { n: 9, c: "Node *front = NULL, *rear = NULL;" },
      { n: 10, c: "" },
      { n: 11, c: "void enqueue(int val) {" },
      { n: 12, c: "    Node* nn = (Node*)malloc(sizeof(Node));" },
      { n: 13, c: "    nn->data = val;" },
      { n: 14, c: "    if (!front) {" },
      { n: 15, c: "        front = rear = nn;" },
      { n: 16, c: "        rear->next = front;" },
      { n: 17, c: "    } else {" },
      { n: 18, c: "        rear->next = nn;" },
      { n: 19, c: "        rear = nn;" },
      { n: 20, c: "        rear->next = front;" },
      { n: 21, c: "    }" },
      { n: 22, c: "    printf(\"Enqueued: %d\\n\", val);" },
      { n: 23, c: "}" },
      { n: 24, c: "" },
      { n: 25, c: "void dequeue() {" },
      { n: 26, c: "    if (!front) {" },
      { n: 27, c: "        printf(\"Queue Underflow\\n\");" },
      { n: 28, c: "        return;" },
      { n: 29, c: "    }" },
      { n: 30, c: "    printf(\"Dequeued: %d\\n\", front->data);" },
      { n: 31, c: "    if (front == rear) {" },
      { n: 32, c: "        free(front);" },
      { n: 33, c: "        front = rear = NULL;" },
      { n: 34, c: "    } else {" },
      { n: 35, c: "        Node* t = front;" },
      { n: 36, c: "        front = front->next;" },
      { n: 37, c: "        rear->next = front;" },
      { n: 38, c: "        free(t);" },
      { n: 39, c: "    }" },
      { n: 40, c: "}" },
      { n: 41, c: "" },
      { n: 42, c: "void display() {" },
      { n: 43, c: "    if (!front) {" },
      { n: 44, c: "        printf(\"Queue is empty\\n\");" },
      { n: 45, c: "        return;" },
      { n: 46, c: "    }" },
      { n: 47, c: "    Node* temp = front;" },
      { n: 48, c: "    printf(\"Circular Singly Linked List: \");" },
      { n: 49, c: "    do {" },
      { n: 50, c: "        printf(\"%d -> \", temp->data);" },
      { n: 51, c: "        temp = temp->next;" },
      { n: 52, c: "    } while (temp != front);" },
      { n: 53, c: "    printf(\"(head: %d)\\n\", front->data);" },
      { n: 54, c: "}" },
      { n: 55, c: "" },
      { n: 56, c: "int main() {" },
      { n: 57, c: "    enqueue(10);" },
      { n: 58, c: "    enqueue(20);" },
      { n: 59, c: "    enqueue(30);" },
      { n: 60, c: "    display();" },
      { n: 61, c: "    dequeue();" },
      { n: 62, c: "    display();" },
      { n: 63, c: "    return 0;" },
      { n: 64, c: "}" }
    ]
  },
  doubly: {
    filename: 'circularqueue_doubly_ll.c',
    lines: [
      { n: 1, c: "#include <stdio.h>" },
      { n: 2, c: "#include <stdlib.h>" },
      { n: 3, c: "" },
      { n: 4, c: "typedef struct Node {" },
      { n: 5, c: "    int data;" },
      { n: 6, c: "    struct Node *prev, *next;" },
      { n: 7, c: "} Node;" },
      { n: 8, c: "" },
      { n: 9, c: "Node *front = NULL, *rear = NULL;" },
      { n: 10, c: "" },
      { n: 11, c: "void enqueue(int val) {" },
      { n: 12, c: "    Node* nn = (Node*)malloc(sizeof(Node));" },
      { n: 13, c: "    nn->data = val;" },
      { n: 14, c: "    if (!front) {" },
      { n: 15, c: "        front = rear = nn;" },
      { n: 16, c: "        rear->next = front;" },
      { n: 17, c: "        front->prev = rear;" },
      { n: 18, c: "    } else {" },
      { n: 19, c: "        rear->next = nn;" },
      { n: 20, c: "        nn->prev = rear;" },
      { n: 21, c: "        rear = nn;" },
      { n: 22, c: "        rear->next = front;" },
      { n: 23, c: "        front->prev = rear;" },
      { n: 24, c: "    }" },
      { n: 25, c: "    printf(\"Enqueued: %d\\n\", val);" },
      { n: 26, c: "}" },
      { n: 27, c: "" },
      { n: 28, c: "void dequeue() {" },
      { n: 29, c: "    if (!front) {" },
      { n: 30, c: "        printf(\"Queue Underflow\\n\");" },
      { n: 31, c: "        return;" },
      { n: 32, c: "    }" },
      { n: 33, c: "    printf(\"Dequeued: %d\\n\", front->data);" },
      { n: 34, c: "    if (front == rear) {" },
      { n: 35, c: "        free(front);" },
      { n: 36, c: "        front = rear = NULL;" },
      { n: 37, c: "    } else {" },
      { n: 38, c: "        Node* t = front;" },
      { n: 39, c: "        front = front->next;" },
      { n: 40, c: "        front->prev = rear;" },
      { n: 41, c: "        rear->next = front;" },
      { n: 42, c: "        free(t);" },
      { n: 43, c: "    }" },
      { n: 44, c: "}" },
      { n: 45, c: "" },
      { n: 46, c: "void display() {" },
      { n: 47, c: "    if (!front) {" },
      { n: 48, c: "        printf(\"Queue is empty\\n\");" },
      { n: 49, c: "        return;" },
      { n: 50, c: "    }" },
      { n: 51, c: "    Node* temp = front;" },
      { n: 52, c: "    printf(\"Circular Doubly Linked List: \");" },
      { n: 53, c: "    do {" },
      { n: 54, c: "        printf(\"%d <-> \", temp->data);" },
      { n: 55, c: "        temp = temp->next;" },
      { n: 56, c: "    } while (temp != front);" },
      { n: 57, c: "    printf(\"(head: %d)\\n\", front->data);" },
      { n: 58, c: "}" },
      { n: 59, c: "" },
      { n: 60, c: "int main() {" },
      { n: 61, c: "    enqueue(100);" },
      { n: 62, c: "    enqueue(200);" },
      { n: 63, c: "    enqueue(300);" },
      { n: 64, c: "    display();" },
      { n: 65, c: "    dequeue();" },
      { n: 66, c: "    display();" },
      { n: 67, c: "    return 0;" },
      { n: 68, c: "}" }
    ]
  }
};

// line numbers of the C files that get highlighted for each step
const HL = {
  "array": {
    "enqCheck": [
      8,
      9
    ],
    "enqOverflow": [
      10,
      11
    ],
    "enqFront": [
      13
    ],
    "enqRear": [
      14
    ],
    "enqStore": [
      15
    ],
    "enqPrint": [
      16
    ],
    "deqCheck": [
      19,
      20
    ],
    "deqUnder": [
      21,
      22
    ],
    "deqPrint": [
      24
    ],
    "deqIfSingle": [
      25
    ],
    "deqSingle": [
      26,
      27
    ],
    "deqElse": [
      28,
      29
    ]
  },
  "singly": {
    "enqAlloc": [
      11,
      12,
      13
    ],
    "enqCheck": [
      14
    ],
    "enqPrint": [
      22
    ],
    "deqCheck": [
      25,
      26
    ],
    "deqUnder": [
      27,
      28
    ],
    "deqPrint": [
      30
    ],
    "deqIfSingle": [
      31
    ],
    "deqSingle": [
      32,
      33
    ],
    "enqFirst": [
      15,
      16
    ],
    "enqAppend": [
      17,
      18,
      19,
      20
    ],
    "deqElse": [
      34,
      35,
      36,
      37,
      38
    ]
  },
  "doubly": {
    "enqAlloc": [
      11,
      12,
      13
    ],
    "enqCheck": [
      14
    ],
    "enqPrint": [
      25
    ],
    "deqCheck": [
      28,
      29
    ],
    "deqUnder": [
      30,
      31
    ],
    "deqPrint": [
      33
    ],
    "deqIfSingle": [
      34
    ],
    "deqSingle": [
      35,
      36
    ],
    "enqFirst": [
      15,
      16,
      17
    ],
    "enqAppend": [
      18,
      19,
      20,
      21,
      22,
      23
    ],
    "deqElse": [
      37,
      38,
      39,
      40,
      41,
      42
    ]
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
  
  // Setup Mode selection buttons
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

  // Setup speed selection buttons
  document.querySelectorAll("#speeds button").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("#speeds button").forEach(b => b.classList.remove("on"));
      btn.classList.add("on");
      animSpeed = parseInt(btn.dataset.s);
    };
  });

  setupCanvas();
  renderCodeInspector();
  drawVisualizer();
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
  const box = $('codeContainer');
  const firstEl = $(`cl-${lines[0]}`);
  if (box && firstEl) box.scrollTop = Math.max(0, firstEl.offsetTop - box.clientHeight / 2);
  await new Promise(r => setTimeout(r, animSpeed));
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
  const h = HL[currentMode];

  if (currentMode === 'array') {
    await highlightLines(h.enqCheck);
    if ((rear + 1) % capacity === front) {
      await highlightLines(h.enqOverflow);
      $('statusBadge').textContent = "STATUS: OVERFLOW";
      $('statusBadge').style.color = "var(--rose)";
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
  } else {
    let count = countActive();
    await highlightLines(h.enqAlloc);
    if (count >= capacity) {
      $('statusBadge').textContent = "STATUS: OVERFLOW";
      $('statusBadge').style.color = "var(--rose)";
      logConsole(`Enqueue(${val}) Linked list allocation reached max capacity limit (${capacity}).`, 'error');
      isBusy = false;
      clearHighlights();
      return;
    }
    await highlightLines(h.enqCheck);
    if (front === -1) {
      await highlightLines(h.enqFirst);
      front = 0;
      rear = 0;
    } else {
      await highlightLines(h.enqAppend);
      rear = (rear + 1) % capacity;
    }
    queueData[rear] = val;
    await highlightLines(h.enqPrint);
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
  const h = HL[currentMode];

  await highlightLines(h.deqCheck);
  if (front === -1) {
    await highlightLines(h.deqUnder);
    $('statusBadge').textContent = "STATUS: UNDERFLOW";
    $('statusBadge').style.color = "var(--rose)";
    logConsole(`Dequeue UNDERFLOW! Queue is completely empty.`, 'error');
    isBusy = false;
    clearHighlights();
    return;
  }

  let removedVal = queueData[front];
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
  $('statusBadge').textContent = "STATUS: ACTIVE";
  $('statusBadge').style.color = "var(--teal)";
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

  if (currentMode === 'array') {
    drawArrayRing(width, height);
  } else {
    drawNodeLinkedList(width, height);
  }
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
    let angle = (i * 2 * Math.PI / capacity) - Math.PI / 2;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);

    let isFront = (i === front);
    let isRear = (i === rear);
    let isFilled = (queueData[i] !== null);

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

    let labelR = radius + 26;
    let lx = centerX + labelR * Math.cos(angle);
    let ly = centerY + labelR * Math.sin(angle);
    ctx.fillStyle = isFront ? '#3ee0c4' : isRear ? '#ffd166' : '#98a0c4';
    ctx.font = '12px "Times New Roman", Times, serif';
    ctx.fillText(`[${i}]`, lx, ly);

    if (isFront) drawBadge(ctx, x - 16, y - 32, 'FRONT', '#3ee0c4');
    if (isRear) drawBadge(ctx, x - 16, y + 22, 'REAR', '#ffd166');
  }
}

function drawNodeLinkedList(w, h) {
  const centerX = w / 2;
  const centerY = h / 2;
  const radius = Math.min(w, h) / 2 - 55;

  const nodeW = currentMode === 'doubly' ? 76 : 64;
  const nodeH = 34;

  let nodes = [];

  for (let i = 0; i < capacity; i++) {
    let angle = (i * 2 * Math.PI / capacity) - Math.PI / 2;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    nodes.push({ x, y, angle, w: nodeW, h: nodeH });
  }

  if (front !== -1) {
    let i = front;
    while (true) {
      let nextIdx = (i + 1) % capacity;
      let curr = nodes[i];
      let nextNode = nodes[nextIdx];

      if (i === rear) {
        let frontNode = nodes[front];
        let rearNode = nodes[rear];

        if (currentMode === 'singly') {
          drawCircularWrapArrow(ctx, rearNode, frontNode, centerX, centerY, radius + 28, '#8b7cff', false);
        } else {
          drawCircularWrapArrow(ctx, rearNode, frontNode, centerX, centerY, radius + 28, '#8b7cff', false);
          drawCircularWrapArrow(ctx, frontNode, rearNode, centerX, centerY, radius - 28, '#ffd166', true);
        }
        break;
      }

      if (currentMode === 'singly') {
        let p1 = getCompartmentCenter(curr, 'next', currentMode);
        let p2 = getNodeEdgePoint(nextNode, p1);
        drawEdgeArrow(ctx, p1, p2, '#8b7cff');
      } else {
        let pNextStart = getCompartmentCenter(curr, 'next', 'doubly');
        let pNextEnd = getNodeEdgePoint(nextNode, pNextStart);
        drawEdgeArrow(ctx, pNextStart, pNextEnd, '#8b7cff');

        let pPrevStart = getCompartmentCenter(nextNode, 'prev', 'doubly');
        let pPrevEnd = getNodeEdgePoint(curr, pPrevStart);
        drawEdgeArrow(ctx, pPrevStart, pPrevEnd, '#ffd166');
      }

      i = (i + 1) % capacity;
    }
  }

  for (let i = 0; i < capacity; i++) {
    let n = nodes[i];
    let isFront = (i === front);
    let isRear = (i === rear);
    let isFilled = (queueData[i] !== null);

    ctx.save();
    ctx.translate(n.x, n.y);

    ctx.fillStyle = isFilled ? '#0f172a' : 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = isFront ? '#3ee0c4' : isRear ? '#ffd166' : isFilled ? '#8b7cff' : '#334155';
    ctx.lineWidth = isFront || isRear ? 2.5 : 1.5;

    ctx.beginPath();
    ctx.roundRect(-n.w/2, -n.h/2, n.w, n.h, 6);
    ctx.fill();
    ctx.stroke();

    if (currentMode === 'singly') {
      let divX = -n.w/2 + 38;

      ctx.beginPath();
      ctx.moveTo(divX, -n.h/2);
      ctx.lineTo(divX, n.h/2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isFilled ? '#38bdf8' : '#475569';
      ctx.font = 'bold 14px "Times New Roman", Times, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isFilled ? queueData[i] : '-', -n.w/2 + 19, 0);

      ctx.fillStyle = isFilled ? '#a5b4fc' : '#475569';
      ctx.font = '11px "Times New Roman", Times, serif';
      ctx.fillText('N', divX + 13, 0);

    } else {
      let divX1 = -n.w/2 + 22;
      let divX2 = -n.w/2 + 54;

      ctx.beginPath();
      ctx.moveTo(divX1, -n.h/2);
      ctx.lineTo(divX1, n.h/2);
      ctx.moveTo(divX2, -n.h/2);
      ctx.lineTo(divX2, n.h/2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isFilled ? '#ffd166' : '#475569';
      ctx.font = '10px "Times New Roman", Times, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P', -n.w/2 + 11, 0);

      ctx.fillStyle = isFilled ? '#38bdf8' : '#475569';
      ctx.font = 'bold 14px "Times New Roman", Times, serif';
      ctx.fillText(isFilled ? queueData[i] : '-', -n.w/2 + 38, 0);

      ctx.fillStyle = isFilled ? '#a5b4fc' : '#475569';
      ctx.font = '10px "Times New Roman", Times, serif';
      ctx.fillText('N', -n.w/2 + 65, 0);
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Times New Roman", Times, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`0x${(1000 + i).toString(16)}`, 0, -n.h/2 - 6);

    if (isFront) drawBadge(ctx, -16, -n.h/2 - 22, 'FRONT', '#3ee0c4');
    if (isRear) drawBadge(ctx, -16, n.h/2 + 8, 'REAR', '#ffd166');

    ctx.restore();
  }
}

function getCompartmentCenter(node, type, mode) {
  if (mode === 'singly') {
    return { x: node.x + 13, y: node.y };
  } else {
    if (type === 'prev') {
      return { x: node.x - (node.w / 2) + 11, y: node.y };
    } else {
      return { x: node.x + (node.w / 2) - 11, y: node.y };
    }
  }
}

function getNodeEdgePoint(node, sourcePoint) {
  let dx = sourcePoint.x - node.x;
  let dy = sourcePoint.y - node.y;
  let halfW = node.w / 2 + 2;
  let halfH = node.h / 2 + 2;

  if (dx === 0 && dy === 0) return { x: node.x, y: node.y };

  let scaleX = Math.abs(dx) > 0 ? halfW / Math.abs(dx) : Infinity;
  let scaleY = Math.abs(dy) > 0 ? halfH / Math.abs(dy) : Infinity;
  let scale = Math.min(scaleX, scaleY);

  return {
    x: node.x + dx * scale,
    y: node.y + dy * scale
  };
}

function drawBadge(ctx, x, y, text, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 32, 11);
  ctx.fillStyle = '#070814';
  ctx.font = 'bold 9px "Times New Roman", Times, serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + 16, y + 8);
}

function drawEdgeArrow(ctx, p1, p2, color) {
  const headlen = 7;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const angle = Math.atan2(dy, dx);
  
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p2.x, p2.y);
  ctx.lineTo(p2.x - headlen * Math.cos(angle - Math.PI / 6), p2.y - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(p2.x - headlen * Math.cos(angle + Math.PI / 6), p2.y - headlen * Math.sin(angle + Math.PI / 6));
  ctx.fillStyle = color;
  ctx.fill();
}

function drawCircularWrapArrow(ctx, fromNode, toNode, cx, cy, r, color, counterClockwise = false) {
  let startAngle = fromNode.angle;
  let endAngle = toNode.angle;

  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle, counterClockwise);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  let headAngle = endAngle + (counterClockwise ? Math.PI / 2 : -Math.PI / 2);
  let arrowX = cx + r * Math.cos(endAngle);
  let arrowY = cy + r * Math.sin(endAngle);

  const headlen = 7;
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX - headlen * Math.cos(headAngle - Math.PI / 6), arrowY - headlen * Math.sin(headAngle - Math.PI / 6));
  ctx.lineTo(arrowX - headlen * Math.cos(headAngle + Math.PI / 6), arrowY - headlen * Math.sin(headAngle + Math.PI / 6));
  ctx.fillStyle = color;
  ctx.fill();
}
