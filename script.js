// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav: background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// --- Background color morphing on scroll ---

function hexToRgb(hex) {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const e = easeInOut(Math.max(0, Math.min(1, t)));
  return [
    Math.round(a[0] + (b[0] - a[0]) * e),
    Math.round(a[1] + (b[1] - a[1]) * e),
    Math.round(a[2] + (b[2] - a[2]) * e),
  ];
}

function applyBg([r, g, b]) {
  document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
  nav.style.setProperty('--nav-bg', `rgba(${r},${g},${b},0.88)`);
}

function updateBackground() {
  const scrollY = window.scrollY;
  const windowH = window.innerHeight;
  const secs = Array.from(document.querySelectorAll('[data-bg]'));

  if (!secs.length) return;

  let rgb = hexToRgb(secs[0].dataset.bg);

  for (let i = 1; i < secs.length; i++) {
    const secTop = secs[i].offsetTop;

    // Transition zone: section enters viewport → its top reaches 40% of viewport height
    const start = secTop - windowH;
    const end = secTop - windowH * 0.4;

    if (scrollY <= start) break;

    if (scrollY < end) {
      const t = (scrollY - start) / (end - start);
      rgb = lerpColor(secs[i - 1].dataset.bg, secs[i].dataset.bg, t);
      break;
    }

    rgb = hexToRgb(secs[i].dataset.bg);
  }

  applyBg(rgb);
}

// Run immediately, then again after full load to ensure correct offsetTop values
updateBackground();
window.addEventListener('load', updateBackground);
window.addEventListener('scroll', () => requestAnimationFrame(updateBackground), { passive: true });

// =============================================
// BOLD ANIMATIONS
// =============================================

// ---- Intro loader ----
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;

  document.body.style.overflow = 'hidden';

  // Show brand name
  requestAnimationFrame(() => requestAnimationFrame(() => {
    intro.classList.add('show-text');
  }));

  // Split panels open
  setTimeout(() => intro.classList.add('open'), 980);

  // Reveal page content and start hero animations
  setTimeout(() => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    document.body.style.overflow = '';
  }, 2000);

  // Remove intro from rendering
  setTimeout(() => intro.classList.add('done'), 2250);
})();

// ---- Hero parallax background text ----
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    heroBgText.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }, { passive: true });
}

// ---- Custom cursor ----
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
  });

  document.querySelectorAll('a, button, .service-row, .tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
      dot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
      dot.classList.remove('hover');
    });
  });

  (function tick() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(tick);
  })();
})();
