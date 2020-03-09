import { Vec } from './vec.mjs';
import { Line } from './line.mjs';

const cnv = document.createElement('canvas');
document.body.appendChild(cnv);
const c = cnv.getContext('2d');
let s = Math.min(innerWidth, innerHeight)*2/3;
cnv.width = cnv.height = s;
c.translate(s/2, s/2);
let center = new Vec(0, 0);

class Particle {
    constructor() {
        this.pos = new Vec(Math.random() * s/2, 0);
        this.pos.rads = this.pos.rads + Math.random()*Math.PI*2;
        this.vel = new Vec();
        this.acc = new Vec();
    }

    force(f) {
        this.acc.add(f);
    }

    repel(array) {
        for (let i = 0; i < array.length; i++) {
            const other = array[i];
            if (this === other) continue;
            const dist = Vec.dist(this.pos, other.pos);
            const str = Math.min(s/100*2, (1/dist * s/50)**2);
            const f = Vec.sub(this.pos, other.pos);
            f.mag = str;
            this.force(f);
        }
    }

    move() {
        const str = (this.pos.dist(center)/s/2)**3;
        const f = Vec.sub(center, this.pos);
        f.mag = str;
        this.force(f);

        const rand = new Vec(Math.random()**2 / 1, 0);
        rand.rads = rand.rads + Math.random()*Math.PI*2;
        this.force(rand);

        this.vel.add(this.acc);
        this.vel.mag *= 0.99;
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    draw() {
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, s/100, 0, Math.PI*2);
        c.fill();
    }
}

const particles = [];
for (let i = 0; i < 20; i++) {
    particles.push(new Particle());
}

draw();

c.fillStyle = '#000';
c.globalAlpha = 0.75;

function draw() {
    c.clearRect(-s/2, -s/2, s, s);

    for (let i = 0; i < particles.length; i++) {
        particles[i].repel(particles);
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].move();
    }

    const lines = [];
    for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
            lines.push(new Line.segment(particles[i].pos, particles[j].pos))
        }
    }

    for (let i = 0; i < lines.length; i++) {
        //lines[i].draw(cnv);
        for (let j = i+1; j < lines.length; j++) {
            const intxn = Line.segment.intersection(lines[i], lines[j]);
            if (intxn) {
                c.beginPath();
                c.arc(intxn.x, intxn.y, s/500, 0, Math.PI*2);
                c.fill();
            }
        }
    }

    // c.fillStyle = '#00f';
    // for (let i = 0; i < particles.length; i++) {
    //     c.beginPath();
    //     c.arc(particles[i].pos.x, particles[i].pos.y, s/100, 0, Math.PI*2);
    //     c.fill();
    // }

    requestAnimationFrame(draw)
}
