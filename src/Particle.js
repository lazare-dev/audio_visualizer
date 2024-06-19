//src/Particle.js

class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.baseX = Math.random() * this.canvas.width;
        this.baseY = Math.random() * this.canvas.height;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 2 + 1; // Increased minimum size
        this.colorPalettes = this.getColorPalettes();
        this.currentPaletteIndex = 0;
        this.colorStep = 0;
        this.colorTransitionSpeed = 0.01;
        this.trail = [{ x: this.baseX, y: this.baseY }];
        this.trailMaxLength = 2;
        this.color = this.colorPalettes[this.currentPaletteIndex][Math.floor(Math.random() * 3)];
        this.growing = true;
    }

    getColorPalettes() {
        return [
            ['#FF4500', '#FF6347', '#FFFFFF'],
            ['#FFD700', '#FFEB3B', '#FFFFFF'],
            ['#32CD32', '#98FB98', '#FFFFFF'],
            ['#1E90FF', '#87CEFA', '#FFFFFF'],
            ['#9370DB', '#D8BFD8', '#FFFFFF'],
            ['#8B0000', '#FA8072', '#FFFFFF'],
        ];
    }

    interpolateColor(color1, color2, factor) {
        const hex = (x) => {
            const result = x.toString(16);
            return result.length === 1 ? '0' + result : result;
        };
        const r = Math.ceil(parseInt(color1.substring(1, 3), 16) * (1 - factor) + parseInt(color2.substring(1, 3), 16) * factor);
        const g = Math.ceil(parseInt(color1.substring(3, 5), 16) * (1 - factor) + parseInt(color2.substring(3, 5), 16) * factor);
        const b = Math.ceil(parseInt(color1.substring(5, 7), 16) * (1 - factor) + parseInt(color2.substring(5, 7), 16) * factor);
        return `#${hex(r)}${hex(g)}${hex(b)}`;
    }

    update(frequencyData) {
        this.colorStep += this.colorTransitionSpeed;
        if (this.colorStep >= 1) {
            this.colorStep = 0;
            this.currentPaletteIndex = (this.currentPaletteIndex + 1) % this.colorPalettes.length;
        }

        const currentPalette = this.colorPalettes[this.currentPaletteIndex];
        const nextPalette = this.colorPalettes[(this.currentPaletteIndex + 1) % this.colorPalettes.length];
        const colorIndex = Math.floor(Math.random() * 3);
        const transitionColor = this.interpolateColor(currentPalette[colorIndex], nextPalette[colorIndex], this.colorStep);

        const dx = (this.baseX - this.x) * 0.01;
        const dy = (this.baseY - this.y) * 0.01;
        this.x += dx;
        this.y += dy;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailMaxLength) this.trail.shift();

        this.color = transitionColor;

        // Handle growing and shrinking
        if (this.growing) {
            this.size += 0.1; // Adjust growth speed as needed
            if (this.size > 8) { // Adjust max size as needed
                this.growing = false;
            }
        } else {
            this.size -= 0.1; // Adjust shrinking speed as needed
            if (this.size < 1) { // Adjust min size as needed
                this.growing = true;
            }
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        // Ensure size is never negative
        const drawSize = Math.max(this.size, 0.1); 
        this.ctx.arc(this.x, this.y, drawSize, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
            this.ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        this.ctx.strokeStyle = this.color;
        this.ctx.globalAlpha = 0.5; // More transparent trails
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
    }
}

window.Particle = Particle;
