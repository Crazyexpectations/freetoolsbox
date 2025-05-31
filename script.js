document.addEventListener('DOMContentLoaded', () => {
  const ghost = document.querySelector('.cursor-ghost');
  const speechBubble = ghost?.querySelector('.speech-bubble');
  const messages = [
    "Hi!", "What are you doing?", "Let's play!", "👻 Boo!",
    "Don't ignore me!", "I'm following you!", "Wanna code together?"
  ];
  let idleTimeout, messageInterval, isIdle = false;
  const now = new Date();

  if (now.getHours() >= 19 || now.getHours() <= 5) ghost?.classList.add('night');
  const costumes = ['hat', 'shades', null];
  const chosen = costumes[Math.floor(Math.random() * costumes.length)];
  if (chosen) ghost?.classList.add(chosen);

  let mouseX = 0, mouseY = 0;
  let spawn = localStorage.getItem('ghostSpawn');
  let ghostX, ghostY;
  if (spawn) {
    try {
      const { x, y } = JSON.parse(spawn);
      ghostX = x; ghostY = y;
      localStorage.removeItem('ghostSpawn');
    } catch {
      ghostX = window.innerWidth / 2; ghostY = window.innerHeight / 2;
    }
  } else {
    ghostX = window.innerWidth / 2; ghostY = window.innerHeight / 2;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (isIdle) ghost?.classList.remove('sleepy'), isIdle = false;
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      ghost?.classList.add('sleepy'); isIdle = true;
    }, 4000);
  });

  function followGhost() {
    ghostX += (mouseX - ghostX) * 0.1;
    ghostY += (mouseY - ghostY) * 0.1;
    if (ghost) {
      ghost.style.left = `${ghostX}px`;
      ghost.style.top = `${ghostY}px`;
    }
    requestAnimationFrame(followGhost);
  }
  followGhost();

  setTimeout(() => {
    if (ghost && speechBubble) {
      speechBubble.textContent = "Hi there!";
      ghost.classList.add('show-bubble');
      setTimeout(() => ghost.classList.remove('show-bubble'), 2000);
    }
  }, 400);

  document.addEventListener('click', () => {
    ghost?.classList.add('surprised');
    setTimeout(() => ghost?.classList.remove('surprised'), 600);
  });

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => ghost?.classList.add('happy'));
    btn.addEventListener('mouseleave', () => ghost?.classList.remove('happy'));
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      const spawn = {
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 40
      };
      localStorage.setItem('ghostSpawn', JSON.stringify(spawn));
    });
  });

  function setRandomMessage() {
    if (!ghost || !speechBubble) return;
    speechBubble.textContent = messages[Math.floor(Math.random() * messages.length)];
    ghost.classList.add('show-bubble');
    setTimeout(() => ghost.classList.remove('show-bubble'), 2200);
  }

  messageInterval = setInterval(setRandomMessage, 8000);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(messageInterval);
    else messageInterval = setInterval(setRandomMessage, 8000);
  });

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    const scrollY = window.scrollY || window.pageYOffset;
    mouse.x = e.clientX;
    mouse.y = e.clientY + scrollY - 70;
  });

  // === CANVAS BACKGROUND EFFECTS ===
  function networkEffect(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    const PARTICLE_COUNT = Math.floor((width * height) / 7000);
    const LINK_DIST = 120, MOUSE_DIST = 150;
    let particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: 1.5 + Math.random()
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#00bcd4';
      particles.forEach(p1 => {
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach(p2 => {
          if (p1 === p2) return;
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
        });

        if (mouse.x && mouse.y) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            ctx.strokeStyle = 'rgba(0,188,212,0.3)';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        p1.x += p1.vx;
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function rippleEffect(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const rings = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      shape: Math.random() > 0.5 ? 'square' : 'triangle',
      size: 4 + Math.random() * 3
    }));

    function drawShape(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#00bcd4';
      if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rings.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        drawShape(p);
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            p.vx += dx / dist * 0.05;
            p.vy += dy / dist * 0.05;
          }
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function blobEffect(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 4 + Math.random() * 8,
      alpha: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.3,
      vx: 0,
      vy: 0
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.phase += 0.02;
        p.alpha = 0.3 + Math.sin(p.phase) * 0.3;
        if (mouse.x && mouse.y) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * 0.3;
            p.vy += Math.sin(angle) * 0.3;
          }
        }
        p.vy -= p.speed * 0.03;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.vx = p.vy = 0;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 188, 212, ${p.alpha})`;
        ctx.shadowColor = '#00bcd4';
        ctx.shadowBlur = 10;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function starEffect(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 1.5,
      speed: 0.5 + Math.random()
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00bcd4';
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        if (mouse.x && mouse.y) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          if (Math.sqrt(dx * dx + dy * dy) < 100) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(0,188,212,0.3)';
            ctx.stroke();
          }
        }
        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  if (document.getElementById("network-bg")) networkEffect("network-bg");
  if (document.getElementById("services-bg")) rippleEffect("services-bg");
  if (document.getElementById("about-bg")) blobEffect("about-bg");
  if (document.getElementById("contact-bg")) starEffect("contact-bg");

  // === DARK MODE TOGGLE ===
  const themeToggle = document.getElementById('theme-toggle');
  const logoImg = document.getElementById('logo-img');
  const footerLogo = document.querySelector('.footer-brand img');

  function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark);
    if (logoImg) logoImg.src = isDark ? 'logo-light.png' : 'logo.png';
    if (footerLogo) footerLogo.src = isDark ? 'logo-light.png' : 'logo.png';
    if (themeToggle) themeToggle.checked = isDark;
    console.log('Theme applied:', isDark ? 'Dark' : 'Light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      console.log('Theme toggle changed');
      applyTheme(themeToggle.checked);
    });

    const saved = localStorage.getItem('darkMode');
    const savedTheme = saved === null ? false : saved === 'true';
    console.log('Initial dark mode:', savedTheme);
    applyTheme(savedTheme);
  } else {
    console.warn('Theme toggle element not found!');
  }

  // === Navbar Login/Profile Icon ===
  const isLoggedIn = localStorage.getItem("softwork_logged_in") === "true";
  const loginBtn = document.getElementById("login-button");
  const profileIconLink = document.getElementById("profile-icon-link");
  
  if (isLoggedIn) {
    if (loginBtn) loginBtn.style.display = "none";
    if (profileIconLink) profileIconLink.style.display = "inline-flex";
  }

});


// === GSAP SECTION ANIMATIONS ===
gsap.registerPlugin(ScrollTrigger);

// Animate hero on page load
gsap.from(".hero h1", { opacity: 0, y: -50, duration: 1 });
gsap.from(".hero p", { opacity: 0, y: 30, delay: 0.3, duration: 1 });
gsap.from(".cta-buttons a", {
  opacity: 0,
  y: 40,
  delay: 0.6,
  stagger: 0.2,
  duration: 1
});

// Animate each section on scroll
document.querySelectorAll("section").forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power2.out"
  });
});

// Animate service cards with stagger
gsap.utils.toArray(".service-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    delay: i * 0.1,
    ease: "power2.out"
  });
});

// Animate value cards
gsap.utils.toArray(".value-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
    },
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    delay: i * 0.1,
    ease: "back.out(1.7)"
  });
});

// Animate testimonials
gsap.utils.toArray(".testimonial-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
    },
    opacity: 0,
    x: i % 2 === 0 ? -50 : 50,
    duration: 0.8,
    delay: i * 0.1,
    ease: "power2.out"
  });
});

// For log in service things to open
const formSection = document.querySelector('.onboarding-form-section');
const formElement = formSection?.querySelector('.onboarding-form');
const loggedMessage = formSection?.querySelector('.logged-message');
const guestMessage = formSection?.querySelector('.guest-message');

if (formSection) {
  const isLoggedIn = localStorage.getItem('softwork_logged_in') === 'true';
  if (!isLoggedIn) {
    if (formElement) formElement.style.display = 'none';
    if (guestMessage) guestMessage.style.display = 'block';
  } else {
    if (loggedMessage) loggedMessage.style.display = 'block';
  }
}

const isLoggedIn = localStorage.getItem("softwork_logged_in") === "true";
const loginBtn = document.getElementById("login-button");
const profileIconLink = document.getElementById("profile-icon-link");

if (isLoggedIn) {
  if (loginBtn) loginBtn.style.display = "none";
  if (profileIconLink) profileIconLink.style.display = "inline-flex";
}
