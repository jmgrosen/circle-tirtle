import { Graphic } from "https://unpkg.com/svg-turtle@0.1.9/dist/svg-turtle.esm.js";

/*
class ArcInterval {
  constructor(low, high) {
    if (low < 0 || high < 0 || low > 360 || high > 360) {
      throw "interval ends must be within [0, 360]";
    }
    if (low === high) {
      throw "cannot have an empty interval";
    }
    this.low = low;
    this.high = high;
  }

  intersectionWith(other) {
    if (this.low < this.high) {
      
    } else {
    }
  }
}

class Layer {
  constructor() {
    this.pieces = [];
  }

  addPiece([low, high]) {
  }
}

class State {
  constructor(numLayers) {
    this.layers = [];
    for (let i = 0; i < numLayers; i++) {
      this.layers.push(new Layer());
    }
  }
}
*/

class Path {
  constructor(initialLayer, initialTheta) {
    this.initialLayer = initialLayer;
    this.initialTheta = initialTheta;
    this.runs = [];
  }

  addRun(dir, dtheta) {
    this.runs.push([dir, dtheta]);
  }
}

function makePath() {
  let p = new Path(0, 0);
  for (let i = 0; i < NUM_LAYERS; i++) {
    let arc = Math.random() * 340;
    p.addRun(true, arc);
  }
  return p;
}

const INITIAL_RADIUS = 10;
const LAYER_THICKNESS = 10;
const NUM_LAYERS = 10;

Graphic.prototype.curve = function(dir, ...args) {
  if (dir) {
    this.curveRight(...args);
  } else {
    this.curveLeft(...args);
  }
};

function runTurtle(p) {
  let g = new Graphic();
  let radius = INITIAL_RADIUS + p.initialLayer * LAYER_THICKNESS;
  // TODO: handle initialTheta
  let dir = false;
  let first = true;
  for (let i = 0; i < p.runs.length; i++) {
    const [switch_, arc] = p.runs[i];
    dir = switch_ ? !dir : dir;
    if (first) {
      first = false;
    } else {
      g.curve(dir, 180, LAYER_THICKNESS/2);
      radius += (switch_ ? 1 : -1) * LAYER_THICKNESS;
    }
    g.curve(dir, arc, radius);
  }
  return g.asSVG();
}

const wrapper = document.getElementById("canvas");
wrapper.innerHTML = runTurtle(makePath());

