//src/ParticleSystem.js

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particlesArray = [];
        this.numberOfParticles = 3000;
        this.swirlTimeout = null;
        this.freezeFrame = null;

        this.audioAnalyzer = new AudioAnalyzer();

        this.init();
        this.animate();
    }

    init() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particlesArray.push(new Particle(this.canvas, this.ctx));
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const frequencyData = this.audioAnalyzer.getFrequencyData();

        this.particlesArray.forEach(particle => {
            particle.update(frequencyData);
            particle.draw();
        });

        this.applyAudioEffects(frequencyData);

        requestAnimationFrame(this.animate.bind(this));
    }

    applyAudioEffects(frequencyData) {
        const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;

        if (Math.random() < 0.2) this.explodeParticles(avgFrequency); // 20% chance
        if (Math.random() < 0.1) this.implodeParticles(avgFrequency); // 10% chance
        if (Math.random() < 0.2) this.wobbleParticles(avgFrequency); // 20% chance
        if (Math.random() < 0.2) this.scatterParticles(avgFrequency); // 20% chance
        if (Math.random() < 0.1) this.shakeParticles(avgFrequency); // 10% chance
        if (Math.random() < 0.1) this.clusterParticles(avgFrequency); // 10% chance
        if (Math.random() < 0.1) this.rotateParticles(avgFrequency); // 10% chance
        if (Math.random() < 0.2) this.flashParticles(avgFrequency); // 20% chance
        if (Math.random() < 0.2) this.vibrateParticles(avgFrequency); // 20% chance
        if (Math.random() < 0.2) this.twinkleParticles(avgFrequency); // 20% chance
        if (Math.random() < 0.5) this.growParticles(); // 50% chance
        if (Math.random() < 0.1) this.bounceParticles(avgFrequency); // 10% chance

        if (!this.swirlTimeout && Math.random() < 0.01) { // 1% chance to start swirling
            this.startSwirl(avgFrequency);
        }
    }

    explodeParticles(avgFrequency) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.particlesArray.forEach(particle => {
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * avgFrequency * 2 + 50; // Reduced sensitivity
            particle.x = centerX + Math.cos(angle) * distance;
            particle.y = centerY + Math.sin(angle) * distance;
        });
    }

    implodeParticles(avgFrequency) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.particlesArray.forEach(particle => {
            const dx = centerX - particle.x;
            const dy = centerY - particle.y;
            particle.x += dx * 0.01 * (avgFrequency / 256); // Reduced sensitivity
            particle.y += dy * 0.01 * (avgFrequency / 256); // Reduced sensitivity
        });
    }

    wobbleParticles(avgFrequency) {
        this.particlesArray.forEach(particle => {
            particle.x += (Math.random() - 0.5) * 10 * (avgFrequency / 256);
            particle.y += (Math.random() - 0.5) * 10 * (avgFrequency / 256);
        });
    }

    scatterParticles(avgFrequency) {
        this.particlesArray.forEach(particle => {
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * avgFrequency * 2 + 50;
            particle.x += Math.cos(angle) * distance;
            particle.y += Math.sin(angle) * distance;
        });
    }

    shakeParticles(avgFrequency) {
        this.particlesArray.forEach(particle => {
            particle.x += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
            particle.y += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
        });
    }

    clusterParticles(avgFrequency) {
        const clusterX = Math.random() * this.canvas.width;
        const clusterY = Math.random() * this.canvas.height;
        this.particlesArray.forEach(particle => {
            const dx = clusterX - particle.x;
            const dy = clusterY - particle.y;
            particle.x += dx * 0.05 * (avgFrequency / 256);
            particle.y += dy * 0.05 * (avgFrequency / 256);
        });
    }

    rotateParticles(avgFrequency) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.particlesArray.forEach(particle => {
            const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
            const distance = Math.hypot(particle.x - centerX, particle.y - centerY);
            particle.x = centerX + Math.cos(angle + 0.1 * (avgFrequency / 256)) * distance;
            particle.y = centerY + Math.sin(angle + 0.1 * (avgFrequency / 256)) * distance;
        });
    }

    flashParticles(avgFrequency) {
        this.particlesArray.forEach(particle => {
            particle.color = `rgba(255, 255, 255, ${avgFrequency / 128})`; // Increased brightness
        });
    }

    vibrateParticles(avgFrequency) {
        this.particlesArray.forEach(particle => {
            particle.x += (Math.random() - 0.5) * 20 * (avgFrequency / 256);
            particle.y += (Math.random() - 0.5) * 20 * (avgFrequency / 256);
        });
    }

    twinkleParticles(avgFrequency) {
        this.particlesArray.forEach(particle => {
            particle.size = Math.random() * 2 + 0.5 * (avgFrequency / 256);
        });
    }

    growParticles() {
        this.particlesArray.forEach(particle => {
            if (particle.growing) {
                particle.size += 0.1; // Adjust growth speed as needed
                if (particle.size > 6) { // Adjust max size as needed
                    particle.growing = false;
                }
            } else {
                particle.size -= 0.1; // Adjust shrinking speed as needed
                if (particle.size < 1) { // Adjust min size as needed
                    particle.growing = true;
                }
            }
        });
    }

    bounceParticles(avgFrequency) {
        this.particlesArray.forEach(particle => {
            particle.x += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
            particle.y += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
        });
    }

    startSwirl(avgFrequency) {
        if (this.freezeFrame) {
            this.particlesArray.forEach((particle, index) => {
                particle.x = this.freezeFrame[index].x;
                particle.y = this.freezeFrame[index].y;
            });
        } else {
            this.freezeFrame = this.particlesArray.map(particle => ({
                x: particle.x,
                y: particle.y,
            }));
        }

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const swirlDuration = 5000 + avgFrequency * 300; // Longer duration

        this.particlesArray.forEach(particle => {
            const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
            const distance = Math.hypot(particle.x - centerX, particle.y - centerY);
            particle.swirlData = {
                originalX: particle.x,
                originalY: particle.y,
                angle,
                distance
            };
        });

        this.swirlTimeout = setInterval(() => {
            this.particlesArray.forEach(particle => {
                if (particle.swirlData) {
                    const { angle, distance } = particle.swirlData;
                    const swirlAngle = angle + 0.1;
                    particle.x = centerX + Math.cos(swirlAngle) * distance;
                    particle.y = centerY + Math.sin(swirlAngle) * distance;
                }
            });
        }, 16);

        setTimeout(() => {
            clearInterval(this.swirlTimeout);
            this.swirlTimeout = null;
            this.particlesArray.forEach(particle => delete particle.swirlData);
        }, swirlDuration);
    }
}

window.ParticleSystem = ParticleSystem;





// class ParticleSystem {
//     constructor() {
//         this.canvas = document.getElementById('particleCanvas');
//         this.ctx = this.canvas.getContext('2d');
//         this.canvas.width = window.innerWidth;
//         this.canvas.height = window.innerHeight;
//         this.particlesArray = [];
//         this.numberOfParticles = 3000;

//         this.audioAnalyzer = new AudioAnalyzer();

//         this.init();
//         this.animate();
//     }

//     init() {
//         for (let i = 0; i < this.numberOfParticles; i++) {
//             this.particlesArray.push(new Particle(this.canvas, this.ctx));
//         }
//     }

//     animate() {
//         this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         const frequencyData = this.audioAnalyzer.getFrequencyData();

//         this.particlesArray.forEach(particle => {
//             particle.update(frequencyData);
//             particle.draw();
//         });

//         this.applyAudioEffects(frequencyData);

//         requestAnimationFrame(this.animate.bind(this));
//     }

//     applyAudioEffects(frequencyData) {
//         // Apply audio effects based on frequency data
//         this.explodeParticles(frequencyData);
//         this.implodeParticles(frequencyData);
//         this.wobbleParticles(frequencyData);
//         this.scatterParticles(frequencyData);
//         this.spiralParticles(frequencyData);
//         this.shakeParticles(frequencyData);
//         this.clusterParticles(frequencyData);
//         this.rotateParticles(frequencyData);
//         this.flashParticles(frequencyData);
//         this.vibrateParticles(frequencyData);
//         this.twinkleParticles(frequencyData);
//         this.growParticles(frequencyData);
//         this.bounceParticles(frequencyData);
//     }

//     explodeParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const angle = Math.random() * 2 * Math.PI;
//             const distance = Math.random() * avgFrequency + 50;
//             particle.x = centerX + Math.cos(angle) * distance;
//             particle.y = centerY + Math.sin(angle) * distance;
//         });
//     }

//     implodeParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const dx = centerX - particle.x;
//             const dy = centerY - particle.y;
//             particle.x += dx * 0.05 * (avgFrequency / 256);
//             particle.y += dy * 0.05 * (avgFrequency / 256);
//         });
//     }

//     wobbleParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 10 * (avgFrequency / 256);
//             particle.y += (Math.random() - 0.5) * 10 * (avgFrequency / 256);
//         });
//     }

//     scatterParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             const angle = Math.random() * 2 * Math.PI;
//             const distance = Math.random() * avgFrequency * 2 + 50;
//             particle.x += Math.cos(angle) * distance;
//             particle.y += Math.sin(angle) * distance;
//         });
//     }

//     spiralParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
//             const distance = Math.hypot(particle.x - centerX, particle.y - centerY);
//             particle.x = centerX + Math.cos(angle + 0.1 * (avgFrequency / 256)) * distance;
//             particle.y = centerY + Math.sin(angle + 0.1 * (avgFrequency / 256)) * distance;
//         });
//     }

//     shakeParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
//             particle.y += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
//         });
//     }

//     clusterParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         const clusterX = Math.random() * this.canvas.width;
//         const clusterY = Math.random() * this.canvas.height;
//         this.particlesArray.forEach(particle => {
//             const dx = clusterX - particle.x;
//             const dy = clusterY - particle.y;
//             particle.x += dx * 0.05 * (avgFrequency / 256);
//             particle.y += dy * 0.05 * (avgFrequency / 256);
//         });
//     }

//     rotateParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
//             const distance = Math.hypot(particle.x - centerX, particle.y - centerY);
//             particle.x = centerX + Math.cos(angle + 0.1 * (avgFrequency / 256)) * distance;
//             particle.y = centerY + Math.sin(angle + 0.1 * (avgFrequency / 256)) * distance;
//         });
//     }

//     flashParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             particle.color = `rgba(255, 255, 255, ${avgFrequency / 256})`;
//         });
//     }

//     vibrateParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 20 * (avgFrequency / 256);
//             particle.y += (Math.random() - 0.5) * 20 * (avgFrequency / 256);
//         });
//     }

//     twinkleParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             particle.size = Math.random() * 2 + 0.5 * (avgFrequency / 256);
//         });
//     }

//     growParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             particle.size += 1 * (avgFrequency / 256);
//         });
//     }

//     bounceParticles(frequencyData) {
//         const avgFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
//             particle.y += (Math.random() - 0.5) * 50 * (avgFrequency / 256);
//         });
//     }
// }

// window.ParticleSystem = ParticleSystem;


// class ParticleSystem {
//     constructor() {
//         this.canvas = document.getElementById('particleCanvas');
//         this.ctx = this.canvas.getContext('2d');
//         this.canvas.width = window.innerWidth;
//         this.canvas.height = window.innerHeight;
//         this.particlesArray = [];
//         this.numberOfParticles = 3000;
//         this.mouse = { x: null, y: null, down: false };

//         window.addEventListener('resize', () => {
//             this.canvas.width = window.innerWidth;
//             this.canvas.height = window.innerHeight;
//         });

//         this.canvas.addEventListener('mousedown', (event) => {
//             this.mouse.x = event.clientX;
//             this.mouse.y = event.clientY;
//             this.mouse.down = true;
//         });

//         this.canvas.addEventListener('mouseup', () => {
//             this.mouse.down = false;
//         });

//         this.canvas.addEventListener('mousemove', (event) => {
//             this.mouse.x = event.clientX;
//             this.mouse.y = event.clientY;
//         });

//         this.init();
//         this.animate();
//         this.addKeyboardListeners();
//     }

//     init() {
//         for (let i = 0; i < this.numberOfParticles; i++) {
//             this.particlesArray.push(new Particle(this.canvas, this.ctx));
//         }
//     }

//     animate() {
//         this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         this.particlesArray.forEach(particle => {
//             particle.update(this.mouse);
//             particle.draw();
//         });

//         requestAnimationFrame(this.animate.bind(this));
//     }

//     addKeyboardListeners() {
//         window.addEventListener('keydown', (event) => {
//             if (event.shiftKey) {
//                 switch (event.code) {
//                     case 'KeyQ':
//                         this.changeParticleColors();
//                         break;
//                     case 'KeyA':
//                         this.explodeParticles();
//                         break;
//                     case 'KeyZ':
//                         this.implodeParticles();
//                         break;
//                     case 'KeyW':
//                         this.wobbleParticles();
//                         break;
//                     case 'KeyS':
//                         this.scatterParticles();
//                         break;
//                     case 'KeyX':
//                         this.resetParticles();
//                         break;
//                     case 'KeyE':
//                         this.spiralParticles();
//                         break;
//                     case 'KeyD':
//                         this.shakeParticles();
//                         break;
//                     case 'KeyC':
//                         this.clusterParticles();
//                         break;
//                     case 'KeyR':
//                         this.rotateParticles();
//                         break;
//                     case 'KeyF':
//                         this.flashParticles();
//                         break;
//                     case 'KeyV':
//                         this.vibrateParticles();
//                         break;
//                     case 'KeyT':
//                         this.twinkleParticles();
//                         break;
//                     case 'KeyG':
//                         this.growParticles();
//                         break;
//                     case 'KeyB':
//                         this.bounceParticles();
//                         break;
//                 }
//             }
//         });
//     }

//     changeParticleColors() {
//         this.particlesArray.forEach(particle => {
//             particle.currentPaletteIndex = (particle.currentPaletteIndex + 1) % particle.colorPalettes.length;
//             particle.colorStep = 0;
//             particle.color = particle.colorPalettes[particle.currentPaletteIndex][Math.floor(Math.random() * 3)];
//         });
//     }

//     explodeParticles() {
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const angle = Math.random() * 2 * Math.PI;
//             const distance = Math.random() * 200 + 50;
//             particle.x = centerX + Math.cos(angle) * distance;
//             particle.y = centerY + Math.sin(angle) * distance;
//         });
//     }

//     implodeParticles() {
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const dx = centerX - particle.x;
//             const dy = centerY - particle.y;
//             particle.x += dx * 0.05;
//             particle.y += dy * 0.05;
//         });
//     }

//     wobbleParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 20;
//             particle.y += (Math.random() - 0.5) * 20;
//         });
//     }

//     scatterParticles() {
//         this.particlesArray.forEach(particle => {
//             const angle = Math.random() * 2 * Math.PI;
//             const distance = Math.random() * 400 + 100;
//             particle.x += Math.cos(angle) * distance;
//             particle.y += Math.sin(angle) * distance;
//         });
//     }

//     resetParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.x = particle.baseX;
//             particle.y = particle.baseY;
//             particle.trail = [{ x: particle.baseX, y: particle.baseY }];
//         });
//     }

//     spiralParticles() {
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
//             const distance = Math.hypot(particle.x - centerX, particle.y - centerY);
//             particle.x = centerX + Math.cos(angle + 0.1) * distance;
//             particle.y = centerY + Math.sin(angle + 0.1) * distance;
//         });
//     }

//     shakeParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 50;
//             particle.y += (Math.random() - 0.5) * 50;
//         });
//     }

//     clusterParticles() {
//         const clusterX = Math.random() * this.canvas.width;
//         const clusterY = Math.random() * this.canvas.height;
//         this.particlesArray.forEach(particle => {
//             const dx = clusterX - particle.x;
//             const dy = clusterY - particle.y;
//             particle.x += dx * 0.05;
//             particle.y += dy * 0.05;
//         });
//     }

//     rotateParticles() {
//         const centerX = this.canvas.width / 2;
//         const centerY = this.canvas.height / 2;
//         this.particlesArray.forEach(particle => {
//             const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
//             const distance = Math.hypot(particle.x - centerX, particle.y - centerY);
//             particle.x = centerX + Math.cos(angle + 0.1) * distance;
//             particle.y = centerY + Math.sin(angle + 0.1) * distance;
//         });
//     }

//     flashParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.color = '#FFFFFF';
//         });
//     }

//     vibrateParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 20;
//             particle.y += (Math.random() - 0.5) * 20;
//         });
//     }

//     twinkleParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.size = Math.random() * 2 + 0.5;
//         });
//     }

//     growParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.size += 1;
//         });
//     }

//     bounceParticles() {
//         this.particlesArray.forEach(particle => {
//             particle.x += (Math.random() - 0.5) * 50;
//             particle.y += (Math.random() - 0.5) * 50;
//         });
//     }
// }

// window.ParticleSystem = ParticleSystem;
