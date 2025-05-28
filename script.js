document.addEventListener('DOMContentLoaded', () => {
  const ghost = document.querySelector('.cursor-ghost');
  let idleTimeout;
  let isIdle = false;

  // Cursor follows mouse
  document.addEventListener('mousemove', (e) => {
    if (!ghost) return;

    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY + -25}px`;

    // Reset idle timer
    if (isIdle) {
      ghost.classList.remove('sleepy');
      isIdle = false;
    }
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      ghost.classList.add('sleepy');
      isIdle = true;
    }, 5000);
  });

  // Click = Surprised face
  document.addEventListener('click', () => {
    if (!ghost) return;
    ghost.classList.add('surprised');
    setTimeout(() => ghost.classList.remove('surprised'), 800);
  });

  // Hover over buttons = Happy ghost
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      ghost.classList.add('happy');
    });
    btn.addEventListener('mouseleave', () => {
      ghost.classList.remove('happy');
    });
  });

  // Animated tech-style network background inside .hero
  (function () {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let particles = [];
    const PARTICLE_COUNT = Math.floor((width * height) / 7000);
    const LINK_DIST = 120;
    const MOUSE_DIST = 150;
    let mouse = { x: null, y: null };

    function resize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    function randomVel() {
      return (Math.random() - 0.5) * 0.7;
    }

    function Particle() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = randomVel();
      this.vy = randomVel();
      this.radius = 2 + Math.random() * 1.5;
    }

    Particle.prototype.move = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    };

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    createParticles();

    // Adjust for ghost offset + page scroll
    window.addEventListener('mousemove', (e) => {
      const scrollY = window.scrollY || window.pageYOffset;
      mouse.x = e.clientX;
      mouse.y = e.clientY + scrollY - 70;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#00bcd4';

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DIST) {
            ctx.strokeStyle = 'rgba(0,188,212,0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_DIST) {
            ctx.strokeStyle = 'rgba(0,188,212,0.3)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.move();
      }

      requestAnimationFrame(animate);
    }

    animate();
  })();
});
