
let stack = [];
let g = 0.98;
let FRICTION = 1;
let buffer;

class Pendulum {
  constructor(r, angle, mass) {
    this.index = stack.length;
    if (this.index != 0) {
      this.head = createVector(
        r * sin(angle) + stack[this.index - 1].head.x,
        r * cos(angle) + stack[this.index - 1].head.y
      )
      this.start = stack[this.index - 1].head;
    }
    else {
      this.head = createVector(
        r * sin(angle),
        r * cos(angle)
      );
      this.start = createVector(
        0,
        0
      );
    }
    this.r = r;
    this.angle = angle;
    this.aVelocity = 0.0;
    this.aAcceleration = 0.0;
    this.mass = mass;
    this.shape = mass * 1000
  }


  update() {
    this.aVelocity += this.calculateAcceleration() * FRICTION;
    this.aVelocity = this.aVelocity % (2 * PI);
    this.angle += this.aVelocity;
    if (this.index != 0) {
      this.head = createVector(
        this.r * sin(this.angle) + stack[this.index - 1].head.x,
        this.r * cos(this.angle) + stack[this.index - 1].head.y
      )
      this.start = stack[this.index - 1].head;
    }
    else {
      this.head = createVector(
        this.r * sin(this.angle),
        this.r * cos(this.angle)
      )
      this.start = createVector(0, 0);
    }
  }

  calculateAcceleration() {
    let num1;
    let num2;
    let num3;
    let num4;
    let den;
    if (this.index != 0) { // pend 2

      num1 = 2 * sin(stack[this.index - 1].angle  - this.angle);
      num2 = (stack[this.index - 1].aVelocity * stack[this.index - 1].aVelocity * stack[this.index - 1].r * (stack[this.index - 1].mass + this.mass));
      num3 = g * (stack[this.index - 1].mass + this.mass) * cos(stack[this.index - 1].angle);
      num4 = this.aVelocity * this.aVelocity * this.r * this.mass * cos(stack[this.index - 1].angle - this.angle);
      den = this.r * (2 * stack[this.index - 1].mass + this.mass - this.mass * cos(2 * stack[this.index - 1].angle - 2 * this.angle));

      return (num1 * (num2 + num3 + num4)) / den;
    } else { // pend 1

      num1 = -g * (2 * this.mass + stack[this.index + 1].mass) * sin(this.angle);
      num2 = -stack[this.index + 1].mass * g * sin(this.angle - 2 * stack[this.index + 1].angle);
      num3 = -2 * sin(this.angle - stack[this.index + 1].angle) * stack[this.index + 1].mass;
      num4 = stack[this.index + 1].aVelocity * stack[this.index + 1].aVelocity * stack[this.index + 1].r + this.aVelocity * this.aVelocity * this.r * cos(this.angle - stack[this.index + 1].angle);
      den = this.r * (2 * this.mass + stack[this.index + 1].mass - stack[this.index + 1].mass * cos(2 * this.angle - 2 * stack[this.index + 1].angle));

      return (num1 + num2 + num3 * num4) / den;
    }
  }
}

function setup() {
  createCanvas(screen.width, window.innerHeight);

  stack.push(new Pendulum(125, PI/2, 0.010));
  stack.push(new Pendulum(125, PI/2, 0.010));

  buffer = createGraphics(screen.width, window.innerHeight);
  buffer.background(175);
  buffer.translate(width/2, height/3);
}

function draw() {
  background(220);
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);
  translate(width/2, height/3);

  stroke(0);
  strokeWeight(2);

  let history;
  for (let i = 0; i < stack.length; i++) {
    line(stack[i].start.x, stack[i].start.y, stack[i].head.x, stack[i].head.y);
    fill(1);
    ellipse(stack[i].head.x, stack[i].head.y, stack[i].shape, stack[i].shape);
    stack[i].update();
    if (i == stack.length - 1) 
      history = stack[i];
  }


  buffer.stroke(0);
  if (frameCount > 1) {
    let last = stack[stack.length - 1];
    buffer.line(history.head.x, history.head.y, last.head.x, last.head.y);
  }

  // stop()
}
