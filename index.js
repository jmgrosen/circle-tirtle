import { Graphic } from "https://unpkg.com/svg-turtle@0.1.9/dist/svg-turtle.esm.js";
import { perlin2D } from "https://unpkg.com/@leodeslf/perlin-noise@1.1.2/perlin.min.js";

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

function makePath(seeds, t) {
  let p = new Path(0, 0);
  for (let i = 0; i < seeds.length; i++) {
    const x = perlin2D(i*10, t);
    let arc = (perlin2D(seeds[i], t) * 0.5 + 0.5) * 340;
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
  g.moveTo(200, 200);
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
const seeds = []
for (let i = 0; i < NUM_LAYERS; i++) {
  seeds.push(Math.random() * 10);
}

window.stop = false;

const TIME_SCALE = 0.001;
let initialTimeStamp;
function step(timeStamp) {
  if (initialTimeStamp === undefined) {
    initialTimeStamp = timeStamp;
  }
  
  wrapper.innerHTML = runTurtle(makePath(seeds, TIME_SCALE * (timeStamp - initialTimeStamp)));
  const svg = wrapper.firstChild;
  svg.style.width = "400px";
  svg.style.height = "400px";
  svg.removeAttribute("viewBox");

  if (!window.stop) {
    requestAnimationFrame(step);
  }
}

requestAnimationFrame(step);

