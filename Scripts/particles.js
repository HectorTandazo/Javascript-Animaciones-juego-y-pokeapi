// Sistema de partículas para efectos visuales
var ParticleSystem = Class.extend({
    init: function(level) {
        this.level = level;
        this.particles = [];
    },

    createCoinEffect: function(x, y) {
        for (var i = 0; i < 5; i++) {
            this.particles.push(new Particle(x, y, {
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * -3 - 2,
                life: 30,
                color: '#FFD700',
                size: 3
            }));
        }
    },

    createDeathEffect: function(x, y) {
        for (var i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, {
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * -4 - 1,
                life: 40,
                color: '#FF4444',
                size: 2
            }));
        }
    },

    createJumpEffect: function(x, y) {
        for (var i = 0; i < 3; i++) {
            this.particles.push(new Particle(x + Math.random() * 20, y, {
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 2,
                life: 15,
                color: '#FFFFFF',
                size: 1
            }));
        }
    },

    update: function() {
        for (var i = this.particles.length - 1; i >= 0; i--) {
            var particle = this.particles[i];
            particle.update();
            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    },

    render: function(ctx) {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].render(ctx);
        }
    }
});

var Particle = Class.extend({
    init: function(x, y, options) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.life = options.life || 30;
        this.maxLife = this.life;
        this.color = options.color || '#FFFFFF';
        this.size = options.size || 2;
        this.gravity = options.gravity || 0.1;
    },

    update: function() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
    },

    isDead: function() {
        return this.life <= 0;
    },

    render: function(ctx) {
        var alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
});