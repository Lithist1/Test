import {
  Vector2 as vec2,
  MathUtils as mu,
  Clock
} from "https://unpkg.com/three@0.173.0/build/three.module.js";

console.clear();

// load fonts
await (async function () {
  async function loadFont(fontface) {
    await fontface.load();
    document.fonts.add(fontface);
  }
  let fonts = [
    new FontFace(
      "GreatVibes",
      "url(https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2) format('woff2')"
    )
  ];
  for (let font in fonts) {
    await loadFont(fonts[font]);
  }
})();

class Heart {
  constructor(radius, color) {
    this.radius = radius;
    this.color = color;
    let pointsAmount = 150;
    let pointStep = (Math.PI * 2) / pointsAmount;
    this.points = Array.from({ length: pointsAmount }, (_, pIdx) => {
      let a = pIdx * pointStep;
      let v = new vec2(
        // https://mathworld.wolfram.com/HeartCurve.html
        Math.sqrt(2) * (Math.sin(a) ** 3),
        -(-(Math.cos(a) ** 3) - Math.cos(a) ** 2 + 2 * Math.cos(a))
      ).multiplyScalar(radius);
      v.y -= radius * 0.75;
      return v;
    });
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    this.points.forEach((p, pIdx) => {
      ctx[pIdx == 0 ? "moveTo" : "lineTo"](u(p.x), u(p.y));
    })
    ctx.fill();
  }
}

class Hearts {
  constructor(amount = 7) {
    this.items = Array.from({ length: amount }, (_, idx) => {
      return new Heart(
        (15 + (idx * (45 - 15)) / amount) * 0.8,
        `hsl(0, 100%, ${25 + (25 / amount) * idx}%)`
      );
    }).reverse();
  }

  update(t) {
    let tl = -t * 2.5;
    this.items.forEach((heart, hIdx) => {
      ctx.save();
        let tStep = (tl - hIdx);
        ctx.translate(
          u(50 + Math.cos(tStep * 0.31 + Math.cos(tStep * 0.66) - Math.sin(tStep * 0.25)) * hIdx), 
          u(50 + Math.sin(tStep * 0.27 - Math.cos(tStep * 0.34) + Math.sin(tStep * 0.13)) * hIdx)
        );
        let rStep = (tl * 0.27 - hIdx * 0.25);
        ctx.rotate(Math.sin(rStep + Math.cos(rStep * 0.25) + Math.sin(rStep * 0.5)) * Math.PI * 0.05);
        heart.draw();
      ctx.restore();
    });
    
    ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.translate(u(50), u(80));
      ctx.rotate(mu.degToRad(-15));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${u(13)}px GreatVibes`;
      let text = "St.Valentine's Day ";
      ctx.fillStyle = "hsl(0, 100%, 40%)";
      ctx.strokeStyle = "#ffc";
      ctx.lineWidth = u(1.5);
      ctx.strokeText(text, 0, 0);
      ctx.fillText(text, 0, 0);
    ctx.restore();
  }
}

let c = cnv;
let ctx = c.getContext("2d");
let unit = 0;
let u = (val) => val * unit;

let resize = () => {
  let minVal = Math.min(innerWidth, innerHeight);
  c.width = c.height = minVal * 0.95;
  unit = c.height * 0.01;

  c.style.border = `${u(1)}px solid red`;
  c.style.borderRadius = `${u(15)}px`;
};
window.addEventListener("resize", resize);
resize();

let hearts = new Hearts();

let clock = new Clock();
let t = 0;

(function draw() {
  
  requestAnimationFrame(draw);
  
  let dt = clock.getDelta();
  t += dt;

  ctx.fillStyle = "hsl(350, 90%, 80%)";
  ctx.fillRect(0, 0, c.width, c.height);

  hearts.update(t);
})();