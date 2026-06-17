'use strict';

// ╔══════════════════════════════════════════════════════════════╗
// ║              AbsTree — script.js                            ║
// ║  BST · AVL · Rubro-Negra · Heap (Max/Min)                  ║
// ║  Código C++ real · Animações · Edição inline                ║
// ╚══════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────
// C++ CODE TEMPLATES
// Each template is split into an array of lines (0-indexed).
// HIGHLIGHT_MAP maps operation names → line indices to highlight.
// ─────────────────────────────────────────────────────────────

const CPP = {

  bst: `#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* left, *right;
    Node(int v) : value(v),
        left(nullptr), right(nullptr) {}
};

class BST {
public:
    Node* root = nullptr;

    Node* insert(Node* n, int v) {
        if (n == nullptr)
            return new Node(v);
        if (v < n->value)
            n->left = insert(n->left, v);
        else if (v > n->value)
            n->right = insert(n->right, v);
        return n;
    }

    Node* findMin(Node* n) {
        while (n->left) n = n->left;
        return n;
    }

    Node* remove(Node* n, int v) {
        if (!n) return nullptr;
        if (v < n->value)
            n->left = remove(n->left, v);
        else if (v > n->value)
            n->right = remove(n->right, v);
        else {
            if (!n->left) return n->right;
            if (!n->right) return n->left;
            Node* s = findMin(n->right);
            n->value = s->value;
            n->right = remove(n->right, s->value);
        }
        return n;
    }

    void inOrder(Node* n) {
        if (!n) return;
        inOrder(n->left);
        cout << n->value << " ";
        inOrder(n->right);
    }

    void preOrder(Node* n) {
        if (!n) return;
        cout << n->value << " ";
        preOrder(n->left);
        preOrder(n->right);
    }

    void postOrder(Node* n) {
        if (!n) return;
        postOrder(n->left);
        postOrder(n->right);
        cout << n->value << " ";
    }
};

int main() {
    BST tree;
    tree.root = tree.insert(tree.root, 50);
    tree.root = tree.insert(tree.root, 30);
    tree.root = tree.insert(tree.root, 70);
    cout << "Em Ordem: ";
    tree.inOrder(tree.root);
    cout << endl;
    return 0;
}`.split('\n'),

  avl: `#include <iostream>
#include <algorithm>
using namespace std;

struct Node {
    int value, height;
    Node *left, *right;
    Node(int v) : value(v), height(1),
        left(nullptr), right(nullptr) {}
};

int h(Node* n) { return n ? n->height : 0; }

void updH(Node* n) {
    if (n) n->height = 1 +
        max(h(n->left), h(n->right));
}

int bal(Node* n) {
    return n ? h(n->left) - h(n->right) : 0;
}

Node* rotRight(Node* y) {   // Caso LL
    Node* x  = y->left;
    y->left  = x->right;
    x->right = y;
    updH(y); updH(x);
    return x;
}

Node* rotLeft(Node* x) {    // Caso RR
    Node* y  = x->right;
    x->right = y->left;
    y->left  = x;
    updH(x); updH(y);
    return y;
}

Node* insert(Node* n, int v) {
    if (!n) return new Node(v);
    if (v < n->value)
        n->left = insert(n->left, v);
    else
        n->right = insert(n->right, v);
    updH(n);
    int b = bal(n);
    if (b > 1  && v < n->left->value)    // LL
        return rotRight(n);
    if (b < -1 && v > n->right->value)   // RR
        return rotLeft(n);
    if (b > 1  && v > n->left->value) {  // LR
        n->left = rotLeft(n->left);
        return rotRight(n);
    }
    if (b < -1 && v < n->right->value) { // RL
        n->right = rotRight(n->right);
        return rotLeft(n);
    }
    return n;
}

Node* findMin(Node* n) {
    while (n->left) n = n->left;
    return n;
}

Node* remove(Node* n, int v) {
    if (!n) return nullptr;
    if (v < n->value)
        n->left = remove(n->left, v);
    else if (v > n->value)
        n->right = remove(n->right, v);
    else {
        if (!n->left) return n->right;
        if (!n->right) return n->left;
        Node* s = findMin(n->right);
        n->value = s->value;
        n->right = remove(n->right, s->value);
    }
    if (!n) return nullptr;
    updH(n);
    int b = bal(n);
    if (b > 1  && bal(n->left)  >= 0) return rotRight(n); // LL
    if (b > 1  && bal(n->left)  <  0) {                    // LR
        n->left = rotLeft(n->left);
        return rotRight(n);
    }
    if (b < -1 && bal(n->right) <= 0) return rotLeft(n);  // RR
    if (b < -1 && bal(n->right) >  0) {                    // RL
        n->right = rotRight(n->right);
        return rotLeft(n);
    }
    return n;
}

int main() {
    Node* root = nullptr;
    root = insert(root, 10);
    root = insert(root, 20);
    root = insert(root, 30); // triggers RR
    return 0;
}`.split('\n'),

  rb: `#include <iostream>
using namespace std;

enum Color { RED, BLACK };

struct Node {
    int value;
    Color color;
    Node *left, *right, *parent;
    Node(int v) : value(v), color(RED),
        left(nullptr), right(nullptr),
        parent(nullptr) {}
};

Node* root = nullptr;

void rotLeft(Node* x) {
    Node* y  = x->right;
    x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent)             root = y;
    else if (x == x->parent->left) x->parent->left  = y;
    else                            x->parent->right = y;
    y->left   = x;
    x->parent = y;
}

void rotRight(Node* y) {
    Node* x  = y->left;
    y->left  = x->right;
    if (x->right) x->right->parent = y;
    x->parent = y->parent;
    if (!y->parent)             root = x;
    else if (y == y->parent->left) y->parent->left  = x;
    else                            y->parent->right = x;
    x->right  = y;
    y->parent = x;
}

void fixInsert(Node* z) {
    while (z->parent && z->parent->color == RED) {
        bool left = (z->parent == z->parent->parent->left);
        Node* u = left                // tio
            ? z->parent->parent->right
            : z->parent->parent->left;
        if (u && u->color == RED) {   // Caso 1: tio vermelho
            z->parent->color         = BLACK;
            u->color                 = BLACK;
            z->parent->parent->color = RED;
            z = z->parent->parent;
        } else {
            if (left && z == z->parent->right) { // Caso 2: LR
                z = z->parent; rotLeft(z);
            } else if (!left && z == z->parent->left) { // Caso 2: RL
                z = z->parent; rotRight(z);
            }
            z->parent->color         = BLACK;    // Caso 3
            z->parent->parent->color = RED;
            if (left) rotRight(z->parent->parent);
            else      rotLeft(z->parent->parent);
        }
    }
    root->color = BLACK;
}

void insert(int v) {
    Node* z = new Node(v);
    Node* y = nullptr;
    Node* x = root;
    while (x) {
        y = x;
        if (v < x->value) x = x->left;
        else              x = x->right;
    }
    z->parent = y;
    if (!y)               root = z;
    else if (v < y->value) y->left  = z;
    else                   y->right = z;
    fixInsert(z);
}

void transplant(Node* u, Node* v) {
    if (!u->parent)              root = v;
    else if (u == u->parent->left) u->parent->left  = v;
    else                           u->parent->right = v;
    if (v) v->parent = u->parent;
}

int main() {
    insert(10); insert(20); insert(30);
    insert(15); insert(5);
    return 0;
}`.split('\n'),

  heap_max: `#include <iostream>
#include <vector>
using namespace std;

class MaxHeap {
    vector<int> h; // h[0] não usado (base-1)

    void siftUp(int i) {
        while (i > 1 && h[i/2] < h[i]) {
            swap(h[i], h[i/2]);
            i /= 2;
        }
    }

    void siftDown(int i) {
        int n = (int)h.size() - 1;
        while (2*i <= n) {
            int j = 2*i;
            if (j < n && h[j] < h[j+1]) j++;
            if (h[i] >= h[j]) break;
            swap(h[i], h[j]);
            i = j;
        }
    }

public:
    MaxHeap() { h.push_back(0); } // placeholder

    void insert(int value) {
        h.push_back(value);     // insere no final
        siftUp(h.size() - 1);   // sobe até a posição correta
    }

    int extractMax() {
        if (h.size() <= 1) return -1;
        int maxVal = h[1];
        h[1] = h.back();        // move último para raiz
        h.pop_back();
        if (h.size() > 1) siftDown(1);
        return maxVal;
    }

    int getMax() {
        return h.size() > 1 ? h[1] : -1;
    }

    int size() { return (int)h.size() - 1; }

    void print() {
        for (int i = 1; i < (int)h.size(); i++)
            cout << "[" << i << "]=" << h[i] << " ";
        cout << endl;
    }
};

int main() {
    MaxHeap heap;
    heap.insert(10);
    heap.insert(40);
    heap.insert(20);
    heap.insert(35);
    cout << "Max: " << heap.getMax() << endl;
    heap.print();
    heap.extractMax();
    heap.print();
    return 0;
}`.split('\n'),

  heap_min: `#include <iostream>
#include <vector>
using namespace std;

class MinHeap {
    vector<int> h; // h[0] não usado (base-1)

    void siftUp(int i) {
        while (i > 1 && h[i/2] > h[i]) { // pai > filho
            swap(h[i], h[i/2]);
            i /= 2;
        }
    }

    void siftDown(int i) {
        int n = (int)h.size() - 1;
        while (2*i <= n) {
            int j = 2*i;
            if (j < n && h[j] > h[j+1]) j++; // filho menor
            if (h[i] <= h[j]) break;
            swap(h[i], h[j]);
            i = j;
        }
    }

public:
    MinHeap() { h.push_back(0); } // placeholder

    void insert(int value) {
        h.push_back(value);     // insere no final
        siftUp(h.size() - 1);   // sobe até a posição correta
    }

    int extractMin() {
        if (h.size() <= 1) return -1;
        int minVal = h[1];
        h[1] = h.back();        // move último para raiz
        h.pop_back();
        if (h.size() > 1) siftDown(1);
        return minVal;
    }

    int getMin() {
        return h.size() > 1 ? h[1] : -1;
    }

    int size() { return (int)h.size() - 1; }

    void print() {
        for (int i = 1; i < (int)h.size(); i++)
            cout << "[" << i << "]=" << h[i] << " ";
        cout << endl;
    }
};

int main() {
    MinHeap heap;
    heap.insert(40);
    heap.insert(10);
    heap.insert(20);
    cout << "Min: " << heap.getMin() << endl;
    heap.print();
    heap.extractMin();
    heap.print();
    return 0;
}`.split('\n'),
};

// Highlight maps: operation name → array of 0-indexed line numbers
const HL = {
  bst: {
    insert_start:   [14],
    insert_null:    [15, 16],
    insert_left:    [17, 18],
    insert_right:   [19, 20],
    remove_start:   [29],
    remove_left:    [31, 32],
    remove_right:   [33, 34],
    remove_found:   [35, 36, 37, 38, 39, 40, 41],
    traversal_in:   [45, 46, 47, 48, 49, 50],
    traversal_pre:  [52, 53, 54, 55, 56, 57],
    traversal_post: [59, 60, 61, 62, 63, 64],
  },
  avl: {
    insert_start:   [38],
    insert_null:    [39],
    insert_left:    [40, 41],
    insert_right:   [42, 43],
    balance_check:  [44, 45],
    rotate_right:   [22, 23, 24, 25, 26, 27, 28],
    rotate_left:    [30, 31, 32, 33, 34, 35, 36],
    balance_ll:     [46, 47],
    balance_rr:     [48, 49],
    balance_lr:     [50, 51, 52, 53],
    balance_rl:     [54, 55, 56, 57],
    remove_start:   [66],
    remove_left:    [68, 69],
    remove_right:   [70, 71],
    remove_found:   [72, 73, 74, 75, 76, 77, 78],
    remove_rebal:   [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91],
    traversal_in:   [38, 40, 41, 42, 43], // reuse insert as skeleton
    traversal_pre:  [38, 40, 41, 42, 43],
    traversal_post: [38, 40, 41, 42, 43],
  },
  rb: {
    insert_start:   [67],
    insert_traverse:[71, 72, 73, 74, 75],
    insert_place:   [76, 77, 78, 79, 80],
    rotate_left:    [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    rotate_right:   [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
    fix_case1:      [46, 47, 48, 49, 50, 51],
    fix_case2_lr:   [52, 53, 54],
    fix_case2_rl:   [55, 56, 57],
    fix_case3:      [58, 59, 60, 61],
    fix_root_black: [62, 63],
    traversal_in:   [67, 71, 72, 73, 74],
    traversal_pre:  [67, 71, 72, 73, 74],
    traversal_post: [67, 71, 72, 73, 74],
  },
  heap_max: {
    insert_start:   [28, 29],
    sift_up:        [7, 8, 9, 10, 11, 12],
    sift_up_swap:   [9, 10],
    sift_down:      [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    sift_down_swap: [20, 21],
    extract_start:  [33, 34, 35, 36, 37, 38],
  },
  heap_min: {
    insert_start:   [28, 29],
    sift_up:        [7, 8, 9, 10, 11, 12],
    sift_up_swap:   [9, 10],
    sift_down:      [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    sift_down_swap: [20, 21],
    extract_start:  [33, 34, 35, 36, 37, 38],
  },
};

// ─────────────────────────────────────────────────────────────
// APPLICATION STATE
// ─────────────────────────────────────────────────────────────

const SPEEDS = { 0: 1800, 1: 900, 2: 350 };
const SPEED_LABELS = { 0: 'Devagar', 1: 'Normal', 2: 'Rápido' };
const NODE_R = 22;
const ANIM_STEP = 0.1;

const state = {
  activeStructure: 'bst',
  trees: {
    bst:  { root: null },
    avl:  { root: null },
    rb:   { root: null },
    heap: { array: [null], type: 'max' },
  },
  selectedNode:    null,
  editingNode:     null,
  isAnimating:     false,
  path:            [],          // nodes visited (highlighted amber)
  insertedNode:    null,        // last inserted node (highlighted green)
  traversalNodes:  [],          // ordered node list for traversal animation
  traversalStep:   -1,
  heapHighlight:   [],          // heap array indices to highlight
  selectedHeapIdx: null,        // selected heap node index
  editingHeapIdx:  null,        // heap node being inline-edited
  speedMs:         900,
};

// Timer for distinguishing single-click vs double-click
let _clickTimer = null;

// Heap node SVG positions (idx → {x, y})
const _heapPositions = {};

// ─────────────────────────────────────────────────────────────
// NODE CLASS
// ─────────────────────────────────────────────────────────────

let _nodeId = 0;
const nodeMap = new Map(); // id (string) → TreeNode

class TreeNode {
  constructor(value) {
    this._id    = String(++_nodeId);
    this.value  = value;
    this.left   = null;
    this.right  = null;
    this.parent = null;
    this.height = 1;
    this.color  = 'black';
    this.x      = 0;
    this.y      = 0;
    this.targetX = 0;
    this.targetY = 0;
  }
}

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDelay(mult = 1) {
  return state.speedMs * mult;
}

function log(msg, cls = '') {
  const term = document.getElementById('terminal');
  if (!term) return;
  const div = document.createElement('div');
  div.className = 'terminal-line' + (cls ? ' ' + cls : '');
  div.textContent = '› ' + msg;
  term.appendChild(div);
  // Limit to 200 lines
  while (term.children.length > 200) term.removeChild(term.firstChild);
  term.scrollTop = term.scrollHeight;
}

function clearTerminal() {
  const term = document.getElementById('terminal');
  if (term) term.innerHTML = '';
}

function setButtonsLocked(locked) {
  if (locked) document.body.classList.add('animating');
  else        document.body.classList.remove('animating');
  state.isAnimating = locked;
}

function getSVGWidth() {
  const svg = document.getElementById('tree');
  return (svg ? svg.getBoundingClientRect().width : 500) || 500;
}

function getSVGHeight() {
  const svg = document.getElementById('tree');
  return (svg ? svg.getBoundingClientRect().height : 400) || 400;
}

// ─────────────────────────────────────────────────────────────
// AVL HELPERS
// ─────────────────────────────────────────────────────────────

function avlHeight(n) { return n ? n.height : 0; }
function avlBalance(n) { return n ? avlHeight(n.left) - avlHeight(n.right) : 0; }
function avlUpdateHeight(n) {
  if (n) n.height = 1 + Math.max(avlHeight(n.left), avlHeight(n.right));
}

// ─────────────────────────────────────────────────────────────
// LAYOUT — in-order index based (no overlaps guaranteed)
// ─────────────────────────────────────────────────────────────

function computeLayout(root) {
  if (!root) return;
  const W = getSVGWidth();
  const PAD = 36;
  let idx = 0;

  function assignIdx(n) {
    if (!n) return;
    assignIdx(n.left);
    n._idx = idx++;
    assignIdx(n.right);
  }
  assignIdx(root);

  const total = idx;

  function assignPos(n, depth) {
    if (!n) return;
    const usable = W - 2 * PAD;
    n.targetX = PAD + (n._idx / Math.max(total - 1, 1)) * usable;
    n.targetY = 44 + depth * 72;
    assignPos(n.left,  depth + 1);
    assignPos(n.right, depth + 1);
  }
  assignPos(root, 0);
}

// ─────────────────────────────────────────────────────────────
// SMOOTH ANIMATION LOOP
// ─────────────────────────────────────────────────────────────

let _animFrameId = null;

function startAnimate() {
  if (_animFrameId) cancelAnimationFrame(_animFrameId);
  _animFrameId = requestAnimationFrame(_animLoop);
}

function _animLoop() {
  let moving = false;
  const root = state.trees[state.activeStructure].root;

  function update(n) {
    if (!n) return;
    // Teleport new nodes (x===0 && y===0) to target
    if (n.x === 0 && n.y === 0) { n.x = n.targetX; n.y = n.targetY; }
    const dx = n.targetX - n.x;
    const dy = n.targetY - n.y;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      n.x += dx * ANIM_STEP;
      n.y += dy * ANIM_STEP;
      moving = true;
    } else {
      n.x = n.targetX;
      n.y = n.targetY;
    }
    update(n.left);
    update(n.right);
  }

  if (root) update(root);
  drawTree();
  if (moving) _animFrameId = requestAnimationFrame(_animLoop);
  else _animFrameId = null;
}

// ─────────────────────────────────────────────────────────────
// BST OPERATIONS
// ─────────────────────────────────────────────────────────────

async function bstInsert(node, value) {
  if (state.path.length === 0) {
    showCode('insert_start');
    log(`Inserindo ${value} na BST`);
    await sleep(getDelay(0.5));
  }

  if (!node) {
    const n = new TreeNode(value);
    state.insertedNode = n;
    showCode('insert_null');
    log(`Posição encontrada → inserido!`, 'terminal-info');
    return n;
  }

  state.path.push(node);
  drawTree();
  await sleep(getDelay());

  log(`Compara ${value} com ${node.value}`);

  if (value < node.value) {
    showCode('insert_left');
    log('→ vai para esquerda');
    await sleep(getDelay(0.5));
    node.left = await bstInsert(node.left, value);
  } else if (value > node.value) {
    showCode('insert_right');
    log('→ vai para direita');
    await sleep(getDelay(0.5));
    node.right = await bstInsert(node.right, value);
  } else {
    log(`⚠ Valor ${value} já existe na árvore`, 'terminal-warn');
  }
  return node;
}

async function bstRemove(node, value) {
  if (!node) {
    showCode('remove_start');
    log(`Valor ${value} não encontrado`, 'terminal-warn');
    return null;
  }

  state.path.push(node);
  drawTree();
  await sleep(getDelay());

  log(`Compara ${value} com ${node.value}`);

  if (value < node.value) {
    showCode('remove_left');
    log('→ vai para esquerda');
    node.left = await bstRemove(node.left, value);
  } else if (value > node.value) {
    showCode('remove_right');
    log('→ vai para direita');
    node.right = await bstRemove(node.right, value);
  } else {
    showCode('remove_found');
    log(`Nó ${value} encontrado — removendo`, 'terminal-info');
    await sleep(getDelay());
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    const suc = findMin(node.right);
    log(`Substituto (mínimo da sub-dir): ${suc.value}`);
    node.value = suc.value;
    node.right = await bstRemove(node.right, suc.value);
  }
  return node;
}

// ─────────────────────────────────────────────────────────────
// AVL OPERATIONS
// ─────────────────────────────────────────────────────────────

async function avlRotLeft(x) {
  showCode('rotate_left');
  log('Rotação à esquerda (RR)', 'terminal-info');
  const y = x.right;
  x.right = y.left;
  y.left  = x;
  avlUpdateHeight(x);
  avlUpdateHeight(y);
  await sleep(getDelay(0.6));
  return y;
}

async function avlRotRight(y) {
  showCode('rotate_right');
  log('Rotação à direita (LL)', 'terminal-info');
  const x = y.left;
  y.left  = x.right;
  x.right = y;
  avlUpdateHeight(y);
  avlUpdateHeight(x);
  await sleep(getDelay(0.6));
  return x;
}

async function avlInsert(node, value) {
  if (state.path.length === 0) {
    showCode('insert_start');
    log(`Inserindo ${value} na AVL`);
    await sleep(getDelay(0.4));
  }

  if (!node) {
    const n = new TreeNode(value);
    state.insertedNode = n;
    showCode('insert_null');
    log('Posição encontrada → inserido!', 'terminal-info');
    return n;
  }

  state.path.push(node);
  drawTree();
  await sleep(getDelay());
  log(`Compara ${value} com ${node.value}`);

  if (value < node.value) {
    showCode('insert_left');
    log('→ vai para esquerda');
    node.left = await avlInsert(node.left, value);
  } else if (value > node.value) {
    showCode('insert_right');
    log('→ vai para direita');
    node.right = await avlInsert(node.right, value);
  } else {
    log(`⚠ Valor ${value} já existe`, 'terminal-warn');
    return node;
  }

  avlUpdateHeight(node);
  showCode('balance_check');
  const b = avlBalance(node);
  log(`FB de ${node.value} = ${b > 0 ? '+' : ''}${b}`);

  if (b > 1 && value < node.left.value) {
    showCode('balance_ll');
    log('Caso LL: rotação simples à direita', 'terminal-info');
    computeLayout(state.trees.avl.root);
    startAnimate();
    await sleep(getDelay(0.4));
    return await avlRotRight(node);
  }
  if (b < -1 && value > node.right.value) {
    showCode('balance_rr');
    log('Caso RR: rotação simples à esquerda', 'terminal-info');
    computeLayout(state.trees.avl.root);
    startAnimate();
    await sleep(getDelay(0.4));
    return await avlRotLeft(node);
  }
  if (b > 1 && value > node.left.value) {
    showCode('balance_lr');
    log('Caso LR: rotação dupla (esq + dir)', 'terminal-info');
    node.left = await avlRotLeft(node.left);
    computeLayout(state.trees.avl.root);
    startAnimate();
    await sleep(getDelay(0.4));
    return await avlRotRight(node);
  }
  if (b < -1 && value < node.right.value) {
    showCode('balance_rl');
    log('Caso RL: rotação dupla (dir + esq)', 'terminal-info');
    node.right = await avlRotRight(node.right);
    computeLayout(state.trees.avl.root);
    startAnimate();
    await sleep(getDelay(0.4));
    return await avlRotLeft(node);
  }

  return node;
}

async function avlRemove(node, value) {
  if (!node) {
    log(`Valor ${value} não encontrado`, 'terminal-warn');
    return null;
  }

  state.path.push(node);
  drawTree();
  await sleep(getDelay());
  log(`Compara ${value} com ${node.value}`);

  if (value < node.value) {
    showCode('remove_left');
    node.left = await avlRemove(node.left, value);
  } else if (value > node.value) {
    showCode('remove_right');
    node.right = await avlRemove(node.right, value);
  } else {
    showCode('remove_found');
    log(`Nó ${value} encontrado — removendo`, 'terminal-info');
    await sleep(getDelay());
    if (!node.left || !node.right) {
      node = node.left ? node.left : node.right;
    } else {
      const suc = findMin(node.right);
      node.value = suc.value;
      node.right = await avlRemove(node.right, suc.value);
    }
  }

  if (!node) return node;

  avlUpdateHeight(node);
  showCode('remove_rebal');
  const b = avlBalance(node);
  log(`Rebalanceando: FB de ${node.value} = ${b > 0 ? '+' : ''}${b}`);

  if (b > 1 && avlBalance(node.left) >= 0) return await avlRotRight(node);
  if (b > 1 && avlBalance(node.left)  < 0) {
    node.left = await avlRotLeft(node.left);
    return await avlRotRight(node);
  }
  if (b < -1 && avlBalance(node.right) <= 0) return await avlRotLeft(node);
  if (b < -1 && avlBalance(node.right) > 0) {
    node.right = await avlRotRight(node.right);
    return await avlRotLeft(node);
  }
  return node;
}

// ─────────────────────────────────────────────────────────────
// RED-BLACK TREE OPERATIONS
// ─────────────────────────────────────────────────────────────

function isRed(n) { return n && n.color === 'red'; }

function rbGrandparent(n) { return n && n.parent ? n.parent.parent : null; }

function rbUncle(n) {
  const gp = rbGrandparent(n);
  if (!gp) return null;
  return n.parent === gp.left ? gp.right : gp.left;
}

async function rbRotLeft(x) {
  const tree = state.trees.rb;
  showCode('rotate_left');
  log('Rotação à esquerda (RB)', 'terminal-info');
  const y = x.right;
  x.right = y.left;
  if (y.left) y.left.parent = x;
  y.parent = x.parent;
  if (!x.parent)             tree.root = y;
  else if (x === x.parent.left) x.parent.left  = y;
  else                           x.parent.right = y;
  y.left    = x;
  x.parent  = y;

  computeLayout(tree.root);
  startAnimate();
  await sleep(getDelay());
  return y;
}

async function rbRotRight(y) {
  const tree = state.trees.rb;
  showCode('rotate_right');
  log('Rotação à direita (RB)', 'terminal-info');
  const x = y.left;
  y.left  = x.right;
  if (x.right) x.right.parent = y;
  x.parent = y.parent;
  if (!y.parent)             tree.root = x;
  else if (y === y.parent.left) y.parent.left  = x;
  else                           y.parent.right = x;
  x.right   = y;
  y.parent  = x;

  computeLayout(tree.root);
  startAnimate();
  await sleep(getDelay());
  return x;
}

async function rbFixInsert(z) {
  const tree = state.trees.rb;
  while (z.parent && isRed(z.parent)) {
    const uncle = rbUncle(z);
    const gp    = rbGrandparent(z);
    state.path  = [z, z.parent, gp, uncle].filter(Boolean);
    drawTree();
    await sleep(getDelay(0.5));

    if (isRed(uncle)) {
      showCode('fix_case1');
      log('Caso 1 (RB): tio vermelho → recolorir', 'terminal-info');
      z.parent.color = 'black';
      uncle.color    = 'black';
      gp.color       = 'red';
      z = gp;
      computeLayout(tree.root);
      startAnimate();
      await sleep(getDelay());
    } else {
      const leftSide = z.parent === (gp && gp.left);
      if (leftSide && z === z.parent.right) {
        showCode('fix_case2_lr');
        log('Caso 2 (RB-LR): nó interno → rotacionar à esquerda', 'terminal-info');
        z = z.parent;
        await rbRotLeft(z);
      } else if (!leftSide && z === z.parent.left) {
        showCode('fix_case2_rl');
        log('Caso 2 (RB-RL): nó interno → rotacionar à direita', 'terminal-info');
        z = z.parent;
        await rbRotRight(z);
      }
      showCode('fix_case3');
      log('Caso 3 (RB): nó externo → recolorir + rotacionar', 'terminal-info');
      if (z.parent) z.parent.color = 'black';
      const gp2 = rbGrandparent(z);
      if (gp2) gp2.color = 'red';
      if (z.parent && z.parent === (gp2 && gp2.left)) await rbRotRight(gp2);
      else if (gp2) await rbRotLeft(gp2);
    }
  }
  showCode('fix_root_black');
  if (tree.root) tree.root.color = 'black';
  state.path = [];
  computeLayout(tree.root);
  startAnimate();
  await sleep(getDelay(0.5));
}

async function rbInsert(value) {
  const tree = state.trees.rb;
  showCode('insert_start');
  log(`Inserindo ${value} na Rubro-Negra`);
  await sleep(getDelay(0.4));

  if (!tree.root) {
    const n = new TreeNode(value);
    n.color = 'black';
    tree.root = n;
    state.insertedNode = n;
    log('Raiz criada como preta', 'terminal-info');
    return;
  }

  let cur  = tree.root;
  let par  = null;

  while (cur) {
    par = cur;
    state.path.push(cur);
    drawTree();
    await sleep(getDelay(0.6));
    showCode('insert_traverse');
    log(`Compara ${value} com ${cur.value}`);
    if (value < cur.value)    cur = cur.left;
    else if (value > cur.value) cur = cur.right;
    else { log(`⚠ Valor ${value} já existe`, 'terminal-warn'); return; }
  }

  const z    = new TreeNode(value);
  z.color    = 'red';
  z.parent   = par;
  if (value < par.value) par.left  = z;
  else                   par.right = z;
  state.insertedNode = z;

  showCode('insert_place');
  log(`Inserido como nó vermelho. Ajustando...`, 'terminal-info');
  computeLayout(tree.root);
  startAnimate();
  await sleep(getDelay());
  await rbFixInsert(z);
}

function rbTransplant(u, v) {
  const tree = state.trees.rb;
  if (!u.parent)             tree.root = v;
  else if (u === u.parent.left) u.parent.left  = v;
  else                           u.parent.right = v;
  if (v) v.parent = u.parent;
}

async function rbFixDelete(x) {
  const tree = state.trees.rb;
  while (x !== tree.root && (!x || x.color === 'black')) {
    if (!x || !x.parent) break;
    const isLeft = (x === x.parent.left);
    let w = isLeft ? x.parent.right : x.parent.left;
    if (!w) break;

    if (w.color === 'red') {
      log('RB delete Caso 1: irmão vermelho', 'terminal-info');
      w.color        = 'black';
      x.parent.color = 'red';
      if (isLeft) await rbRotLeft(x.parent);
      else        await rbRotRight(x.parent);
      w = isLeft ? x.parent.right : x.parent.left;
    }

    if (w && (!w.left || w.left.color === 'black') && (!w.right || w.right.color === 'black')) {
      log('RB delete Caso 2: irmão preto com filhos pretos', 'terminal-info');
      w.color = 'red';
      x       = x.parent;
    } else {
      if (w) {
        if (isLeft && (!w.right || w.right.color === 'black')) {
          log('RB delete Caso 3', 'terminal-info');
          if (w.left) w.left.color = 'black';
          w.color = 'red';
          await rbRotRight(w);
          w = x.parent.right;
        } else if (!isLeft && (!w.left || w.left.color === 'black')) {
          log('RB delete Caso 3', 'terminal-info');
          if (w.right) w.right.color = 'black';
          w.color = 'red';
          await rbRotLeft(w);
          w = x.parent.left;
        }
        if (w) {
          log('RB delete Caso 4: finaliza', 'terminal-info');
          w.color        = x.parent.color;
          x.parent.color = 'black';
          if (isLeft) {
            if (w.right) w.right.color = 'black';
            await rbRotLeft(x.parent);
          } else {
            if (w.left) w.left.color = 'black';
            await rbRotRight(x.parent);
          }
          x = tree.root;
        }
      }
    }
  }
  if (x) x.color = 'black';
}

async function rbRemove(value) {
  const tree = state.trees.rb;
  log(`Removendo ${value} da Rubro-Negra`);

  let z = tree.root;
  while (z && z.value !== value) {
    state.path.push(z);
    drawTree();
    await sleep(getDelay(0.6));
    log(`Compara ${value} com ${z.value}`);
    z = value < z.value ? z.left : z.right;
  }

  if (!z) { log(`Valor ${value} não encontrado`, 'terminal-warn'); return; }
  log(`Nó ${value} encontrado. Removendo...`, 'terminal-info');

  let y = z;
  let yOrigColor = y.color;
  let x = null;

  if (!z.left) {
    x = z.right;
    rbTransplant(z, z.right);
  } else if (!z.right) {
    x = z.left;
    rbTransplant(z, z.left);
  } else {
    y = findMin(z.right);
    yOrigColor = y.color;
    x = y.right;
    if (y.parent !== z) {
      rbTransplant(y, y.right);
      y.right = z.right;
      if (y.right) y.right.parent = y;
    }
    rbTransplant(z, y);
    y.left = z.left;
    if (y.left) y.left.parent = y;
    y.color = z.color;
  }

  if (yOrigColor === 'black') await rbFixDelete(x);

  state.path = [];
  computeLayout(tree.root);
  startAnimate();
  await sleep(getDelay());
}

// ─────────────────────────────────────────────────────────────
// HEAP OPERATIONS
// ─────────────────────────────────────────────────────────────

function heapCompare(a, b) {
  // true if 'a' should be above 'b' (i.e., a is the parent)
  return state.trees.heap.type === 'max' ? a > b : a < b;
}

async function siftUp(arr, i) {
  showCode('sift_up');
  while (i > 1 && heapCompare(arr[i], arr[Math.floor(i / 2)])) {
    state.heapHighlight = [i, Math.floor(i / 2)];
    drawTree();
    await sleep(getDelay(0.6));
    showCode('sift_up_swap');
    log(`Swap: [${i}]=${arr[i]} ↔ [${Math.floor(i/2)}]=${arr[Math.floor(i/2)]}`);
    const tmp = arr[i];
    arr[i] = arr[Math.floor(i / 2)];
    arr[Math.floor(i / 2)] = tmp;
    i = Math.floor(i / 2);
    drawTree();
    await sleep(getDelay(0.4));
  }
  state.heapHighlight = [];
}

async function siftDown(arr, i) {
  showCode('sift_down');
  const n = arr.length - 1;
  while (2 * i <= n) {
    let j = 2 * i;
    if (j < n && heapCompare(arr[j + 1], arr[j])) j++;
    if (!heapCompare(arr[j], arr[i])) break;
    state.heapHighlight = [i, j];
    drawTree();
    await sleep(getDelay(0.6));
    showCode('sift_down_swap');
    log(`Swap: [${i}]=${arr[i]} ↔ [${j}]=${arr[j]}`);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    i = j;
    drawTree();
    await sleep(getDelay(0.4));
  }
  state.heapHighlight = [];
}

async function heapInsert(value) {
  const arr = state.trees.heap.array;
  showCode('insert_start');
  log(`Inserindo ${value} na Heap`);
  arr.push(value);
  const i = arr.length - 1;
  state.heapHighlight = [i];
  drawTree();
  await sleep(getDelay(0.5));
  log(`Posição ${i} → sift-up`, 'terminal-info');
  await siftUp(arr, i);
  drawTree();
}

async function heapRemoveRoot() {
  const arr = state.trees.heap.array;
  if (arr.length <= 1) { log('Heap vazia!', 'terminal-warn'); return; }

  const removed = arr[1];
  showCode('extract_start');
  log(`Removendo raiz: ${removed}`);
  state.heapHighlight = [1];
  drawTree();
  await sleep(getDelay(0.5));
  arr[1] = arr[arr.length - 1];
  arr.pop();
  log('Último elemento movido para a raiz → sift-down', 'terminal-info');
  if (arr.length > 1) await siftDown(arr, 1);
  drawTree();
  return removed;
}

async function heapRemoveValue(value) {
  const arr = state.trees.heap.array;
  const idx = arr.findIndex((v, i) => i > 0 && v === value);
  if (idx < 0) { log(`Valor ${value} não encontrado na heap`, 'terminal-warn'); return; }

  log(`Encontrado em [${idx}] → substituindo por ±Inf e extraindo`);
  // Set to extreme, sift to root, then extract
  arr[idx] = state.trees.heap.type === 'max' ? Infinity : -Infinity;
  state.heapHighlight = [idx];
  drawTree();
  await sleep(getDelay(0.4));
  await siftUp(arr, idx);
  await heapRemoveRoot();
}

// ─────────────────────────────────────────────────────────────
// SHARED: findMin
// ─────────────────────────────────────────────────────────────

function findMin(node) {
  while (node && node.left) node = node.left;
  return node;
}

// ─────────────────────────────────────────────────────────────
// RENDERING — TREE (BST · AVL · RB)
// ─────────────────────────────────────────────────────────────

function drawTree() {
  const type = state.activeStructure;

  if (type === 'heap') {
    drawHeap();
    return;
  }

  const svg  = document.getElementById('tree');
  const root = state.trees[type].root;

  if (!root) {
    svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#64748b" font-size="16" font-family="Inter">Árvore vazia — insira um valor</text>';
    return;
  }

  nodeMap.clear();
  const parts = [];

  // Draw edges first (behind nodes)
  function drawEdges(node) {
    if (!node) return;
    if (node.left)  parts.push(`<line class="tree-edge" x1="${node.x}" y1="${node.y}" x2="${node.left.x}" y2="${node.left.y}"/>`);
    if (node.right) parts.push(`<line class="tree-edge" x1="${node.x}" y1="${node.y}" x2="${node.right.x}" y2="${node.right.y}"/>`);
    drawEdges(node.left);
    drawEdges(node.right);
  }
  drawEdges(root);

  // Draw nodes
  function drawNode(node) {
    if (!node) return;
    nodeMap.set(node._id, node);

    const isSelected  = state.selectedNode === node;
    const isPath      = state.path.includes(node);
    const isInserted  = state.insertedNode === node;
    const isTrav      = state.traversalNodes[state.traversalStep] === node && state.traversalStep >= 0;

    let fill   = '#6d28d9';
    let stroke = '#a78bfa';
    let textFill = '#fff';

    if (type === 'rb') {
      if (node.color === 'red') {
        fill = '#b91c1c'; stroke = '#f87171';
      } else {
        fill = '#1e1b4b'; stroke = '#6366f1';
      }
    }

    if (isTrav)        { fill = '#065f46'; stroke = '#10b981'; }
    else if (isInserted) { fill = '#15803d'; stroke = '#4ade80'; }
    else if (isPath)     { fill = '#92400e'; stroke = '#f59e0b'; }

    // Traversal glow ring
    if (isTrav) {
      parts.push(`<circle cx="${node.x}" cy="${node.y}" r="${NODE_R + 7}" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.5" class="traversal-ring"/>`);
    }

    // Selection ring
    if (isSelected) {
      parts.push(`<circle cx="${node.x}" cy="${node.y}" r="${NODE_R + 5}" fill="none" stroke="#fbbf24" stroke-width="2.5" opacity="0.9"/>`);
    }

    // Main node circle
    parts.push(`<circle cx="${node.x}" cy="${node.y}" r="${NODE_R}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" class="tree-node" data-id="${node._id}" style="filter:drop-shadow(0 0 6px ${stroke}44)"/>`);

    // Value text
    const fontSize = Math.abs(node.value) > 9999 ? 9 : Math.abs(node.value) > 999 ? 10 : 13;
    parts.push(`<text x="${node.x}" y="${node.y}" text-anchor="middle" dy="${type === 'avl' ? '-0.4em' : '0.35em'}" fill="${textFill}" font-size="${fontSize}" font-family="Inter" font-weight="700" class="tree-node-text" data-id="${node._id}" style="pointer-events:none;user-select:none">${node.value}</text>`);

    // AVL: show balance factor and height
    if (type === 'avl') {
      const fb = avlBalance(node);
      const fbStr = fb > 0 ? `+${fb}` : String(fb);
      const fbColor = Math.abs(fb) > 1 ? '#fca5a5' : '#c4b5fd';
      parts.push(`<text x="${node.x}" y="${node.y}" text-anchor="middle" dy="0.9em" fill="${fbColor}" font-size="9" font-family="Inter" style="pointer-events:none">FB${fbStr} h${avlHeight(node)}</text>`);
    }

    drawNode(node.left);
    drawNode(node.right);
  }
  drawNode(root);

  svg.innerHTML = parts.join('');
}

// ─────────────────────────────────────────────────────────────
// RENDERING — HEAP
// ─────────────────────────────────────────────────────────────

function drawHeap() {
  const svg = document.getElementById('tree');
  const arr = state.trees.heap.array;
  const n   = arr.length - 1;

  renderHeapArray();

  if (n === 0) {
    svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#64748b" font-size="16" font-family="Inter">Heap vazia — insira um valor</text>';
    return;
  }

  const W    = getSVGWidth();
  const parts = [];
  const pos  = {};

  const isMax = state.trees.heap.type === 'max';
  const fillBase   = isMax ? '#0e7490' : '#065f46';
  const strokeBase = isMax ? '#22d3ee' : '#10b981';

  for (let i = 1; i <= n; i++) {
    const depth      = Math.floor(Math.log2(i));
    const levelCount = Math.pow(2, depth);
    const posInLvl   = i - levelCount;
    pos[i] = {
      x: ((posInLvl + 0.5) / levelCount) * W,
      y: 44 + depth * 72,
    };
    // Store for inline editor positioning
    _heapPositions[i] = pos[i];
  }

  // Edges
  for (let i = 2; i <= n; i++) {
    const p = pos[Math.floor(i / 2)];
    const c = pos[i];
    parts.push(`<line class="tree-edge" x1="${p.x}" y1="${p.y}" x2="${c.x}" y2="${c.y}"/>`);
  }

  // Nodes
  for (let i = 1; i <= n; i++) {
    const { x, y } = pos[i];
    const hl        = state.heapHighlight.includes(i);
    const isSel     = state.selectedHeapIdx === i;
    const fill      = hl ? '#92400e' : fillBase;
    const stroke    = hl ? '#f59e0b' : strokeBase;
    const val       = arr[i];

    // Selection ring
    if (isSel) {
      parts.push(`<circle cx="${x}" cy="${y}" r="${NODE_R + 5}" fill="none" stroke="#fbbf24" stroke-width="2.5" opacity="0.9"/>`);
    }
    parts.push(`<circle cx="${x}" cy="${y}" r="${NODE_R}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" class="heap-node" data-heap-idx="${i}" style="cursor:pointer;filter:drop-shadow(0 0 6px ${stroke}44)"/>`);
    const fontSize = Math.abs(val) > 9999 ? 9 : Math.abs(val) > 999 ? 10 : 13;
    parts.push(`<text x="${x}" y="${y}" text-anchor="middle" dy="-0.35em" fill="#fff" font-size="${fontSize}" font-family="Inter" font-weight="700" class="heap-node-text" data-heap-idx="${i}">${val}</text>`);
    parts.push(`<text x="${x}" y="${y}" text-anchor="middle" dy="0.9em"  fill="${stroke}" font-size="9" font-family="Inter" data-heap-idx="${i}">[${i}]</text>`);
  }

  svg.innerHTML = parts.join('');
}

function renderHeapArray() {
  const container = document.getElementById('heap-array');
  if (!container) return;
  const arr = state.trees.heap.array;
  const n   = arr.length - 1;
  let html  = '';
  for (let i = 1; i <= n; i++) {
    const hl = state.heapHighlight.includes(i);
    html += `<div class="heap-cell">
      <div class="heap-cell-idx">[${i}]</div>
      <div class="heap-cell-val${hl ? ' hl' : ''}">${arr[i]}</div>
    </div>`;
  }
  container.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
// CODE PANEL
// ─────────────────────────────────────────────────────────────

let _currentHighlight = [];

function showCode(op) {
  const type = state.activeStructure;
  const map  = type === 'heap'
    ? HL[`heap_${state.trees.heap.type}`]
    : HL[type];

  _currentHighlight = (map && map[op]) ? map[op] : [];
  renderCode();
}

function setCodeForStructure(type) {
  _currentHighlight = [];
  renderCode();
  const badge = document.getElementById('code-badge');
  if (badge) {
    const labels = { bst: 'BST', avl: 'AVL', rb: 'RB', heap: 'HEAP' };
    badge.textContent = labels[type] || type.toUpperCase();
  }
}

function renderCode() {
  const type = state.activeStructure;
  let lines;
  if (type === 'heap') {
    lines = CPP[`heap_${state.trees.heap.type}`];
  } else {
    lines = CPP[type];
  }
  if (!lines) return;

  const hlSet = new Set(_currentHighlight);
  const pre   = document.getElementById('code-content');
  if (!pre) return;

  let html = '';
  lines.forEach((line, i) => {
    const hl = hlSet.has(i) ? ' hl' : '';
    // Escape HTML entities
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html += `<span class="code-line${hl}">${escaped || ' '}</span>\n`;
  });
  pre.innerHTML = html;

  // Scroll first highlighted line into view
  if (_currentHighlight.length > 0) {
    const spans = pre.querySelectorAll('.code-line.hl');
    if (spans.length > 0) {
      spans[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
}

// ─────────────────────────────────────────────────────────────
// TRAVERSALS
// ─────────────────────────────────────────────────────────────

function getNodesInOrder(root, list = []) {
  if (!root) return list;
  getNodesInOrder(root.left, list);
  list.push(root);
  getNodesInOrder(root.right, list);
  return list;
}

function getNodesPreOrder(root, list = []) {
  if (!root) return list;
  list.push(root);
  getNodesPreOrder(root.left, list);
  getNodesPreOrder(root.right, list);
  return list;
}

function getNodesPostOrder(root, list = []) {
  if (!root) return list;
  getNodesPostOrder(root.left, list);
  getNodesPostOrder(root.right, list);
  list.push(root);
  return list;
}

function logVerbose_In(node, depth = 0) {
  if (!node) return;
  const ind = '  '.repeat(depth);
  if (node.left)  { log(`${ind}→ desce esquerda de ${node.value}`); logVerbose_In(node.left, depth + 1); }
  log(`${ind}✓ visita ${node.value}`);
  if (node.right) { log(`${ind}→ desce direita de ${node.value}`); logVerbose_In(node.right, depth + 1); }
}

function logVerbose_Pre(node, depth = 0) {
  if (!node) return;
  const ind = '  '.repeat(depth);
  log(`${ind}✓ visita ${node.value}`);
  if (node.left)  { log(`${ind}→ desce esquerda`); logVerbose_Pre(node.left,  depth + 1); }
  if (node.right) { log(`${ind}→ desce direita`);  logVerbose_Pre(node.right, depth + 1); }
}

function logVerbose_Post(node, depth = 0) {
  if (!node) return;
  const ind = '  '.repeat(depth);
  if (node.left)  { log(`${ind}→ desce esquerda`); logVerbose_Post(node.left,  depth + 1); }
  if (node.right) { log(`${ind}→ desce direita`);  logVerbose_Post(node.right, depth + 1); }
  log(`${ind}✓ visita ${node.value}`);
}

async function animateTraversal(nodeList) {
  state.traversalNodes = nodeList;
  state.traversalStep  = -1;

  for (let i = 0; i < nodeList.length; i++) {
    if (!state.isAnimating) break; // guard in case something went wrong
    state.traversalStep = i;
    drawTree();
    await sleep(getDelay());
  }

  state.traversalStep = -1;
  drawTree();
}

// ─────────────────────────────────────────────────────────────
// NODE INFO PANEL
// ─────────────────────────────────────────────────────────────

function updateNodeInfo(node) {
  const panel = document.getElementById('node-info');
  if (!panel) return;
  if (!node) { clearNodeInfo(); return; }

  const type = state.activeStructure;
  let rows   = `<div class="node-info-row">
    <span class="node-info-label">Valor</span>
    <span class="node-info-value">${node.value}</span>
  </div>`;

  if (type === 'bst' || type === 'avl') {
    const h = avlHeight(node);
    rows += `<div class="node-info-row">
      <span class="node-info-label">Altura</span>
      <span class="node-info-value">${h}</span>
    </div>`;
  }

  if (type === 'avl') {
    const fb = avlBalance(node);
    const fbStr = fb > 0 ? `+${fb}` : String(fb);
    const fbColor = Math.abs(fb) > 1 ? '#fca5a5' : '#c4b5fd';
    rows += `<div class="node-info-row">
      <span class="node-info-label">Fator de Bal.</span>
      <span class="node-info-value" style="color:${fbColor}">${fbStr}</span>
    </div>`;
  }

  if (type === 'rb') {
    const colorLabel = node.color === 'red' ? 'Vermelho' : 'Preto';
    rows += `<div class="node-info-row">
      <span class="node-info-label">Cor</span>
      <span class="node-color-badge ${node.color}">${colorLabel}</span>
    </div>`;
  }

  if (node.left || node.right) {
    rows += `<div class="node-info-row">
      <span class="node-info-label">Filhos</span>
      <span class="node-info-value" style="font-size:12px">
        ${node.left ? '← ' + node.left.value : ''}${node.left && node.right ? '  ' : ''}${node.right ? node.right.value + ' →' : ''}
      </span>
    </div>`;
  }

  panel.className = 'node-info-data';
  panel.innerHTML = rows;
}

function clearNodeInfo() {
  const panel = document.getElementById('node-info');
  if (!panel) return;
  panel.className = 'node-info-empty';
  panel.innerHTML = '<div class="empty-icon" aria-hidden="true">○</div><span class="muted">Clique em um nó</span>';
}

// ─────────────────────────────────────────────────────────────
// INLINE EDITOR
// ─────────────────────────────────────────────────────────────

function openInlineEdit(node) {
  if (state.isAnimating) return;
  state.editingNode = node;

  const wrapper  = document.getElementById('svg-wrapper');
  const svg      = document.getElementById('tree');
  const editor   = document.getElementById('inline-editor');
  const input    = document.getElementById('inline-input');

  if (!editor || !input || !wrapper || !svg) return;

  const wRect = wrapper.getBoundingClientRect();
  const sRect = svg.getBoundingClientRect();

  const x = sRect.left - wRect.left + node.x;
  const y = sRect.top  - wRect.top  + node.y;

  editor.style.left = `${x - 42}px`;
  editor.style.top  = `${y - 22}px`;
  editor.classList.remove('hidden');
  input.value = node.value;
  input.focus();
  input.select();
}

function closeInlineEdit() {
  const editor = document.getElementById('inline-editor');
  if (editor) editor.classList.add('hidden');
  state.editingNode    = null;
  state.editingHeapIdx = null;
}

async function confirmInlineEdit() {
  const node     = state.editingNode;
  const heapIdx  = state.editingHeapIdx;
  closeInlineEdit();
  if (!node && heapIdx === null) return;

  const raw      = document.getElementById('inline-input').value;
  const newValue = parseInt(raw, 10);
  if (isNaN(newValue)) {
    log('⚠ Valor inválido — use um número inteiro', 'terminal-warn');
    return;
  }

  // ── Heap inline edit ──
  if (heapIdx !== null) {
    const oldVal = state.trees.heap.array[heapIdx];
    if (newValue === oldVal) return;
    log(`Heap[${heapIdx}]: ${oldVal} → ${newValue}`, 'terminal-info');
    setButtonsLocked(true);
    state.selectedHeapIdx = null;
    clearNodeInfo();
    try {
      await heapRemoveValue(oldVal);
      await sleep(getDelay(0.3));
      await heapInsert(newValue);
    } finally {
      setButtonsLocked(false);
      document.getElementById('btn-remove-sel').disabled = true;
    }
    return;
  }

  if (newValue === node.value) return;

  const oldValue = node.value;
  log(`Editando: ${oldValue} → ${newValue}`, 'terminal-info');

  // Remove old, insert new
  setButtonsLocked(true);
  state.path = [];
  state.insertedNode = null;
  state.selectedNode = null;
  clearNodeInfo();

  try {
    const type = state.activeStructure;
    if (type === 'bst') {
      state.trees.bst.root = await bstRemove(state.trees.bst.root, oldValue);
      state.path = [];
      computeLayout(state.trees.bst.root);
      startAnimate();
      await sleep(getDelay(0.5));
      state.trees.bst.root = await bstInsert(state.trees.bst.root, newValue);
    } else if (type === 'avl') {
      state.trees.avl.root = await avlRemove(state.trees.avl.root, oldValue);
      state.path = [];
      computeLayout(state.trees.avl.root);
      startAnimate();
      await sleep(getDelay(0.5));
      state.trees.avl.root = await avlInsert(state.trees.avl.root, newValue);
    } else if (type === 'rb') {
      await rbRemove(oldValue);
      state.path = [];
      await sleep(getDelay(0.5));
      await rbInsert(newValue);
    } else if (type === 'heap') {
      await heapRemoveValue(oldValue);
      await sleep(getDelay(0.3));
      await heapInsert(newValue);
    }

    if (type !== 'heap') {
      state.path = [];
      computeLayout(state.trees[type].root);
      startAnimate();
    }
  } finally {
    setButtonsLocked(false);
    document.getElementById('btn-remove-sel').disabled = true;
  }
}

// ─────────────────────────────────────────────────────────────
// NODE SELECTION
// ─────────────────────────────────────────────────────────────

function selectNode(node) {
  if (state.isAnimating) return;
  if (state.selectedNode === node) {
    state.selectedNode = null;
    clearNodeInfo();
    document.getElementById('btn-remove-sel').disabled = true;
  } else {
    state.selectedNode = node;
    updateNodeInfo(node);
    document.getElementById('btn-remove-sel').disabled = false;
  }
  drawTree();
}

// ─────────────────────────────────────────────────────────────
// HEAP SELECTION & INLINE EDIT
// ─────────────────────────────────────────────────────────────

function selectHeapNode(idx) {
  if (state.isAnimating) return;
  const arr = state.trees.heap.array;
  if (!arr[idx] && arr[idx] !== 0) return;

  if (state.selectedHeapIdx === idx) {
    // Deselect
    state.selectedHeapIdx = null;
    clearNodeInfo();
    document.getElementById('btn-remove-sel').disabled = true;
  } else {
    state.selectedHeapIdx = idx;
    updateHeapNodeInfo(idx);
    document.getElementById('btn-remove-sel').disabled = false;
  }
  drawTree();
}

function updateHeapNodeInfo(idx) {
  const panel = document.getElementById('node-info');
  if (!panel) return;
  const arr    = state.trees.heap.array;
  const n      = arr.length - 1;
  const val    = arr[idx];
  const parent = idx > 1 ? arr[Math.floor(idx / 2)] : null;
  const left   = 2 * idx <= n ? arr[2 * idx] : null;
  const right  = 2 * idx + 1 <= n ? arr[2 * idx + 1] : null;
  const isMax  = state.trees.heap.type === 'max';

  let rows = `
    <div class="node-info-row">
      <span class="node-info-label">Valor</span>
      <span class="node-info-value">${val}</span>
    </div>
    <div class="node-info-row">
      <span class="node-info-label">Índice</span>
      <span class="node-info-value">[${idx}]</span>
    </div>
    <div class="node-info-row">
      <span class="node-info-label">Tipo</span>
      <span class="node-info-value" style="color:${isMax ? '#22d3ee' : '#10b981'}">${isMax ? 'Max-Heap' : 'Min-Heap'}</span>
    </div>`;

  if (parent !== null) {
    rows += `<div class="node-info-row">
      <span class="node-info-label">Pai [${Math.floor(idx/2)}]</span>
      <span class="node-info-value">${parent}</span>
    </div>`;
  }
  if (left !== null) {
    rows += `<div class="node-info-row">
      <span class="node-info-label">Filho-Esq [${2*idx}]</span>
      <span class="node-info-value">${left}</span>
    </div>`;
  }
  if (right !== null) {
    rows += `<div class="node-info-row">
      <span class="node-info-label">Filho-Dir [${2*idx+1}]</span>
      <span class="node-info-value">${right}</span>
    </div>`;
  }

  panel.className = 'node-info-data';
  panel.innerHTML = rows;
}

function openInlineEditHeap(idx) {
  if (state.isAnimating) return;
  const arr = state.trees.heap.array;
  if (!arr[idx] && arr[idx] !== 0) return;

  state.editingHeapIdx = idx;
  state.editingNode    = null; // ensure tree edit path is clear

  const pos     = _heapPositions[idx];
  if (!pos) return;

  const wrapper = document.getElementById('svg-wrapper');
  const svg     = document.getElementById('tree');
  const editor  = document.getElementById('inline-editor');
  const input   = document.getElementById('inline-input');
  if (!editor || !input || !wrapper || !svg) return;

  const wRect = wrapper.getBoundingClientRect();
  const sRect = svg.getBoundingClientRect();

  editor.style.left = `${sRect.left - wRect.left + pos.x - 42}px`;
  editor.style.top  = `${sRect.top  - wRect.top  + pos.y - 22}px`;
  editor.classList.remove('hidden');
  input.value = arr[idx];
  input.focus();
  input.select();
  log(`Editando Heap[${idx}] = ${arr[idx]}`, 'terminal-info');
}

// ─────────────────────────────────────────────────────────────
// HEAPSORT
// ─────────────────────────────────────────────────────────────

async function runHeapSort() {
  if (state.isAnimating) return;
  const heap = state.trees.heap;
  if (heap.array.length <= 1) {
    log('Heap vazia — insira valores antes de ordenar!', 'terminal-warn');
    return;
  }

  setButtonsLocked(true);
  state.selectedHeapIdx = null;
  clearNodeInfo();

  const isMax   = heap.type === 'max';
  const order   = isMax ? 'crescente (Max-Heap)' : 'decrescente (Min-Heap)';
  const sorted  = [];

  log('══════════════════════════════', 'terminal-sep');
  log(`▶ HeapSort — extração ${isMax ? 'sucessiva do máximo' : 'sucessiva do mínimo'}`, 'terminal-info');
  log(`  Ordem final esperada: ${order}`, 'terminal-info');
  log('══════════════════════════════', 'terminal-sep');

  // Work on a copy so we can restore if needed
  const backup = [...heap.array];

  try {
    while (heap.array.length > 1) {
      const extracted = heap.array[1];
      sorted.push(extracted);

      // Highlight root (element being extracted)
      state.heapHighlight = [1];
      drawTree();
      await sleep(getDelay(0.6));

      log(`  Extraindo ${isMax ? 'máx' : 'mín'}: ${extracted}  →  sorted[${sorted.length - 1}]`, 'terminal-info');

      // Move last to root and sift down
      heap.array[1] = heap.array[heap.array.length - 1];
      heap.array.pop();
      state.heapHighlight = [];

      if (heap.array.length > 1) {
        await siftDown(heap.array, 1);
      }

      drawTree();
      await sleep(getDelay(0.3));
    }

    // Show sorted result
    state.heapHighlight = [];
    heap.array = [null]; // heap now empty
    drawTree();

    const resultStr = sorted.join(' → ');
    log('──────────────────────────────', 'terminal-sep');
    log(`✓ HeapSort concluído!`, 'terminal-info');
    log(`  Resultado (${order}):`);
    log(`  ${resultStr}`);
    log('──────────────────────────────', 'terminal-sep');

    const resEl = document.getElementById('traversal-result');
    if (resEl) {
      resEl.innerHTML = `<span style="color:#fcd34d;font-size:11px">HeapSort (${order}):</span><br>${resultStr}`;
    }

  } catch (err) {
    log(`Erro no HeapSort: ${err.message}`, 'terminal-err');
    heap.array = backup; // restore on error
    drawTree();
  } finally {
    setButtonsLocked(false);
    document.getElementById('btn-remove-sel').disabled = true;
  }
}

// ─────────────────────────────────────────────────────────────
// UI HANDLERS — INSERT / REMOVE
// ─────────────────────────────────────────────────────────────

async function insertValue() {
  if (state.isAnimating) return;

  const raw   = document.getElementById('value-input').value;
  const value = parseInt(raw, 10);

  if (isNaN(value)) {
    log('⚠ Digite um número inteiro válido', 'terminal-warn');
    return;
  }

  setButtonsLocked(true);
  state.path         = [];
  state.insertedNode = null;
  state.selectedNode = null;
  clearNodeInfo();

  try {
    const type = state.activeStructure;
    if (type === 'bst') {
      state.trees.bst.root = await bstInsert(state.trees.bst.root, value);
      computeLayout(state.trees.bst.root);
      startAnimate();
    } else if (type === 'avl') {
      state.trees.avl.root = await avlInsert(state.trees.avl.root, value);
      computeLayout(state.trees.avl.root);
      startAnimate();
    } else if (type === 'rb') {
      await rbInsert(value);
    } else if (type === 'heap') {
      await heapInsert(value);
    }

    state.path = [];
    drawTree();
    document.getElementById('value-input').value = '';
    await sleep(getDelay(0.4));
    state.insertedNode = null;
    drawTree();
  } finally {
    setButtonsLocked(false);
    document.getElementById('btn-remove-sel').disabled = (state.selectedNode === null);
  }
}

async function removeByValue() {
  if (state.isAnimating) return;

  const raw   = document.getElementById('value-input').value;
  const value = parseInt(raw, 10);

  if (isNaN(value)) {
    log('⚠ Digite um número inteiro válido para remover', 'terminal-warn');
    return;
  }

  setButtonsLocked(true);
  state.path         = [];
  state.insertedNode = null;
  if (state.selectedNode && state.selectedNode.value === value) {
    state.selectedNode = null;
    clearNodeInfo();
  }

  try {
    const type = state.activeStructure;
    if (type === 'bst') {
      state.trees.bst.root = await bstRemove(state.trees.bst.root, value);
      state.path = [];
      computeLayout(state.trees.bst.root);
      startAnimate();
    } else if (type === 'avl') {
      state.trees.avl.root = await avlRemove(state.trees.avl.root, value);
      state.path = [];
      computeLayout(state.trees.avl.root);
      startAnimate();
    } else if (type === 'rb') {
      await rbRemove(value);
      state.path = [];
    } else if (type === 'heap') {
      await heapRemoveValue(value);
    }
    drawTree();
    document.getElementById('value-input').value = '';
  } finally {
    setButtonsLocked(false);
    document.getElementById('btn-remove-sel').disabled = true;
  }
}

async function removeSelected() {
  if (state.isAnimating) return;

  // Heap: remove by selected index
  if (state.activeStructure === 'heap') {
    const idx = state.selectedHeapIdx;
    if (idx === null) return;
    const val = state.trees.heap.array[idx];
    if (val === undefined) return;
    state.selectedHeapIdx = null;
    clearNodeInfo();
    document.getElementById('btn-remove-sel').disabled = true;
    setButtonsLocked(true);
    try {
      await heapRemoveValue(val);
      drawTree();
    } finally {
      setButtonsLocked(false);
    }
    return;
  }

  // Tree structures
  if (!state.selectedNode) return;
  const value = state.selectedNode.value;
  document.getElementById('value-input').value = value;
  await removeByValue();
}

// ─────────────────────────────────────────────────────────────
// UI HANDLERS — CLEAR / RANDOM
// ─────────────────────────────────────────────────────────────

async function clearTree() {
  if (state.isAnimating) return;

  if (!confirm('Limpar a árvore atual?')) return;

  const type = state.activeStructure;
  if (type === 'heap') {
    state.trees.heap.array = [null];
  } else {
    state.trees[type].root = null;
  }

  state.path         = [];
  state.insertedNode = null;
  state.selectedNode = null;
  state.traversalNodes = [];
  state.traversalStep  = -1;
  _currentHighlight    = [];

  clearNodeInfo();
  document.getElementById('btn-remove-sel').disabled = true;
  document.getElementById('traversal-result').innerHTML = '<span class="muted">Execute um percurso para ver o resultado aqui</span>';
  drawTree();
  renderCode();
  log(`Árvore ${type.toUpperCase()} limpa`, 'terminal-info');
}

function toggleRandomPanel() {
  const panel = document.getElementById('random-panel');
  if (panel) panel.classList.toggle('hidden');
}

async function generateRandom() {
  if (state.isAnimating) return;
  toggleRandomPanel();

  const n    = parseInt(document.getElementById('random-slider').value, 10);
  const type = state.activeStructure;
  const max  = type === 'heap' ? 200 : 9999;
  const min  = 1;

  // Clear first
  if (type === 'heap') state.trees.heap.array = [null];
  else state.trees[type].root = null;
  state.path = []; state.insertedNode = null; state.selectedNode = null;
  clearNodeInfo();

  log(`Gerando ${n} valores aleatórios...`, 'terminal-info');

  const used = new Set();
  for (let i = 0; i < n; i++) {
    let v;
    let attempts = 0;
    do {
      v = Math.floor(Math.random() * (max - min + 1)) + min;
      attempts++;
    } while (used.has(v) && attempts < 1000);
    used.add(v);

    document.getElementById('value-input').value = v;
    await insertValue();
    await sleep(50);
  }
  document.getElementById('value-input').value = '';
  log('Geração concluída!', 'terminal-info');
}

// ─────────────────────────────────────────────────────────────
// UI HANDLERS — TRAVERSAL
// ─────────────────────────────────────────────────────────────

async function runTraversal(type) {
  if (state.isAnimating) return;

  const struct = state.activeStructure;
  const root   = struct !== 'heap' ? state.trees[struct].root : null;

  if (struct === 'heap') {
    const arr = state.trees.heap.array;
    if (arr.length <= 1) { log('Heap vazia!', 'terminal-warn'); return; }

    const resEl = document.getElementById('traversal-result');
    if (type === 'in') {
      log('ℹ Percurso em ordem não é semanticamente significativo para Heap.', 'terminal-info');
      log('  Exibindo array subjacente:', 'terminal-info');
      const vals = arr.slice(1).join(' → ');
      log(`  Array: [${arr.slice(1).join(', ')}]`);
      if (resEl) resEl.innerHTML = `<span style="color:#94a3b8;font-size:12px">ⓘ Heap: sem percurso em ordem</span><br>${vals}`;
    } else {
      // BFS order for heap (natural array order)
      const vals = arr.slice(1).join(' → ');
      log(`Array: [${arr.slice(1).join(', ')}]`);
      if (resEl) resEl.textContent = vals;
    }
    return;
  }

  if (!root) { log('Árvore vazia!', 'terminal-warn'); return; }

  setButtonsLocked(true);
  state.traversalNodes = [];
  state.traversalStep  = -1;

  const TITLES = {
    pre:  '╔═══════════════════════════╗\n║  PRÉ-ORDEM (Raiz→Esq→Dir) ║\n╚═══════════════════════════╝',
    in:   '╔═══════════════════════════╗\n║  EM ORDEM  (Esq→Raiz→Dir) ║\n╚═══════════════════════════╝',
    post: '╔═══════════════════════════╗\n║  PÓS-ORDEM (Esq→Dir→Raiz) ║\n╚═══════════════════════════╝',
  };
  log(TITLES[type], 'terminal-sep');

  let nodes;
  if (type === 'pre') {
    showCode('traversal_pre');
    nodes = getNodesPreOrder(root);
    logVerbose_Pre(root);
  } else if (type === 'in') {
    showCode('traversal_in');
    nodes = getNodesInOrder(root);
    logVerbose_In(root);
  } else {
    showCode('traversal_post');
    nodes = getNodesPostOrder(root);
    logVerbose_Post(root);
  }

  const values = nodes.map(n => n.value);
  log(`Resultado: ${values.join(' → ')}`);

  const resEl = document.getElementById('traversal-result');
  if (resEl) resEl.textContent = values.join(' → ');

  await animateTraversal(nodes);

  setButtonsLocked(false);
  _currentHighlight = [];
  renderCode();
}

// ─────────────────────────────────────────────────────────────
// UI HANDLERS — SPEED / STRUCTURE / HEAP TYPE / CODE
// ─────────────────────────────────────────────────────────────

function setSpeed(val) {
  const v = parseInt(val, 10);
  state.speedMs = SPEEDS[v] || 900;
  const lbl = document.getElementById('speed-label');
  if (lbl) lbl.textContent = SPEED_LABELS[v] || 'Normal';
}

function switchStructure(type) {
  if (state.isAnimating) return;

  state.activeStructure = type;
  state.selectedNode    = null;
  state.path            = [];
  state.insertedNode    = null;
  state.traversalNodes  = [];
  state.traversalStep   = -1;
  state.heapHighlight   = [];

  // Update tabs
  document.querySelectorAll('.tab').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  const tab = document.getElementById(`tab-${type}`);
  if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); }

  // Update title and badge
  const titles = {
    bst:  'Árvore Binária de Busca',
    avl:  'Árvore AVL',
    rb:   'Árvore Rubro-Negra',
    heap: 'Heap',
  };
  const badgeClasses = { bst: 'badge-bst', avl: 'badge-avl', rb: 'badge-rb', heap: 'badge-heap' };

  const titleEl = document.getElementById('tree-title');
  if (titleEl) titleEl.textContent = titles[type] || type;

  const badge = document.getElementById('tree-badge');
  if (badge) {
    badge.className = 'badge ' + (badgeClasses[type] || 'badge-bst');
    badge.textContent = type === 'heap'
      ? `${state.trees.heap.type === 'max' ? 'Max' : 'Min'}-Heap`
      : type.toUpperCase();
  }

  // Show/hide heap-specific elements
  const heapToggle = document.getElementById('heap-type-toggle');
  const heapStrip  = document.getElementById('heap-strip-card');
  const heapSort   = document.getElementById('btn-heapsort');
  if (type === 'heap') {
    heapToggle?.classList.remove('hidden');
    heapStrip?.classList.remove('hidden');
    heapSort?.classList.remove('hidden');
  } else {
    heapToggle?.classList.add('hidden');
    heapStrip?.classList.add('hidden');
    heapSort?.classList.add('hidden');
  }

  clearNodeInfo();
  document.getElementById('btn-remove-sel').disabled = true;

  // Update code panel
  setCodeForStructure(type);

  // Recompute layout and draw
  if (type !== 'heap') computeLayout(state.trees[type].root);
  drawTree();

  log(`Estrutura: ${titles[type]}`, 'terminal-info');
}

function setHeapType(type) {
  if (state.isAnimating) return;
  state.trees.heap.type = type;

  const maxBtn = document.getElementById('btn-heap-max');
  const minBtn = document.getElementById('btn-heap-min');
  if (maxBtn) maxBtn.classList.toggle('active', type === 'max');
  if (minBtn) minBtn.classList.toggle('active', type === 'min');

  const badge = document.getElementById('tree-badge');
  if (badge) badge.textContent = `${type === 'max' ? 'Max' : 'Min'}-Heap`;

  setCodeForStructure('heap');
  drawTree();
  log(`Tipo de heap: ${type === 'max' ? 'Max-Heap' : 'Min-Heap'}`, 'terminal-info');
}

function toggleCodePanel() {
  const col  = document.getElementById('info-col');
  const btn  = document.getElementById('btn-code');
  if (!col) return;
  col.classList.toggle('hidden');
  btn?.classList.toggle('active');
}

// ─────────────────────────────────────────────────────────────
// EVENT SETUP
// ─────────────────────────────────────────────────────────────

function setupEventListeners() {
  // SVG event delegation — timer-based click vs double-click detection
  // (needed because drawTree() replaces innerHTML, killing native dblclick)
  const svg = document.getElementById('tree');
  if (svg) {
    svg.addEventListener('click', (e) => {
      if (state.isAnimating) return;

      // ── Tree nodes (BST / AVL / RB) ──
      const el = e.target.closest('[data-id]');
      if (el) {
        const nodeId = el.dataset.id;
        if (_clickTimer && _clickTimer.id === nodeId) {
          // Second click on same node within 280ms → treat as dblclick
          clearTimeout(_clickTimer.timer);
          _clickTimer = null;
          const node = nodeMap.get(nodeId);
          if (node) openInlineEdit(node);
        } else {
          // First click — wait to see if a second comes
          if (_clickTimer) { clearTimeout(_clickTimer.timer); _clickTimer = null; }
          const timer = setTimeout(() => {
            _clickTimer = null;
            const node = nodeMap.get(nodeId);
            if (node) selectNode(node);
          }, 280);
          _clickTimer = { id: nodeId, timer };
        }
        return;
      }

      // ── Heap nodes ──
      const heapEl = e.target.closest('[data-heap-idx]');
      if (heapEl) {
        const idx = parseInt(heapEl.dataset.heapIdx, 10);
        const heapKey = `heap_${idx}`;
        if (_clickTimer && _clickTimer.id === heapKey) {
          // Double-click on heap node → open inline edit
          clearTimeout(_clickTimer.timer);
          _clickTimer = null;
          openInlineEditHeap(idx);
        } else {
          if (_clickTimer) { clearTimeout(_clickTimer.timer); _clickTimer = null; }
          const timer = setTimeout(() => {
            _clickTimer = null;
            selectHeapNode(idx);
          }, 280);
          _clickTimer = { id: heapKey, timer };
        }
      }
    });
  }

  // Inline editor keyboard handler
  const inlineInput = document.getElementById('inline-input');
  if (inlineInput) {
    inlineInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter')  { e.preventDefault(); confirmInlineEdit(); }
      if (e.key === 'Escape') { e.preventDefault(); closeInlineEdit(); }
    });
  }

  // Close inline editor when clicking outside
  document.addEventListener('click', (e) => {
    const editor = document.getElementById('inline-editor');
    if (editor && !editor.classList.contains('hidden') && !editor.contains(e.target)) {
      closeInlineEdit();
    }
  }, true);

  // Resize: recompute layout
  window.addEventListener('resize', () => {
    const type = state.activeStructure;
    if (type !== 'heap') computeLayout(state.trees[type].root);
    drawTree();
  });
}

// ─────────────────────────────────────────────────────────────
// EXPOSE GLOBALS (called from inline onclick)
// ─────────────────────────────────────────────────────────────

window.switchStructure   = switchStructure;
window.insertValue       = insertValue;
window.removeByValue     = removeByValue;
window.removeSelected    = removeSelected;
window.clearTree         = clearTree;
window.toggleRandomPanel = toggleRandomPanel;
window.generateRandom    = generateRandom;
window.runTraversal      = runTraversal;
window.setSpeed          = setSpeed;
window.setHeapType       = setHeapType;
window.toggleCodePanel   = toggleCodePanel;
window.clearTerminal     = clearTerminal;
window.runHeapSort       = runHeapSort;

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  switchStructure('bst');
  log('AbsTree iniciado  🌸', 'terminal-info');
  log('Dica: duplo clique em um nó para editar seu valor');
});