/* ===========================
   TECHTOP 2026 — script.js
   =========================== */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

/* Close mobile menu on link click */
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ── Intersection Observer: reveal on scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      /* Staggered delay for grid children */
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
        /* Animate score bars inside this element */
        animateBarsIn(entry.target);
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, index) => {
  /* Add staggered delays for grid siblings */
  const parent = el.parentElement;
  const siblings = parent ? [...parent.children].filter(c => c.classList.contains('reveal')) : [];
  const sibIndex = siblings.indexOf(el);
  el.dataset.delay = sibIndex * 80;
  revealObserver.observe(el);
});

/* ── Score bar animation ── */
function animateBarsIn(container) {
  const fills = container.querySelectorAll('.score-fill');
  fills.forEach(fill => {
    const target = fill.dataset.width || 0;
    fill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = target + '%';
      });
    });
  });
}

/* Also trigger bars inside the featured card when it becomes visible */
const featuredCard = document.querySelector('.laptop-card.featured');
if (featuredCard) {
  const featuredObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateBarsIn(featuredCard);
      featuredObserver.disconnect();
    }
  }, { threshold: 0.2 });
  featuredObserver.observe(featuredCard);
}

/* ── Counter animation (hero stats) ── */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    /* Ease out quad */
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('es-ES');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-num[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    statNumbers.forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

if (statNumbers.length) {
  statsObserver.observe(statNumbers[0].closest('.hero-stats'));
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; /* navbar height */
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Newsletter form ── */
const form = document.getElementById('newsletterForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Procesando…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 900);
  });
}

/* ── Subtle parallax on hero glows ── */
const glow1 = document.querySelector('.glow-1');
const glow2 = document.querySelector('.glow-2');

if (glow1 && glow2) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    glow1.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
    glow2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  }, { passive: true });
}

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle(
          'active-link',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* Active link style (injected) */
const style = document.createElement('style');
style.textContent = `.nav-links a.active-link { color: var(--text); background: var(--surface); }`;
document.head.appendChild(style);

/* ── Comparator: highlight best column on hover ── */
const compCols = document.querySelectorAll('.comp-model');
const compVals = document.querySelectorAll('.comp-val');

compCols.forEach((col, colIdx) => {
  col.addEventListener('mouseenter', () => {
    compVals.forEach((val, i) => {
      if (i % 3 === colIdx) val.style.background = 'rgba(99,102,241,0.08)';
    });
    col.style.background = 'rgba(99,102,241,0.06)';
  });
  col.addEventListener('mouseleave', () => {
    compVals.forEach(val => {
      if (!val.classList.contains('winner')) val.style.background = '';
    });
    col.style.background = '';
  });
});

/* ── Page load: remove no-JS classes ── */
document.documentElement.classList.add('js-loaded');
