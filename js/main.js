/* ─── DARK / LIGHT THEME ──────────────────────────── */
const root         = document.documentElement;
const themeToggle  = document.getElementById('theme-toggle');

// On load: use saved preference, else default to light
const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
/* ─── NAV: scroll class ───────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── BURGER MENU ─────────────────────────────────── */
const burger  = document.getElementById('burger');
const overlay = document.getElementById('mobile-overlay');
let open = false;

burger.addEventListener('click', () => {
  open = !open;
  overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';

  const [s1, , s3] = burger.querySelectorAll('span');
  burger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  burger.querySelectorAll('span')[1].style.opacity   = open ? '0' : '1';
  burger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    open = false;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

/* ─── SCROLL REVEAL ───────────────────────────────── */
const srEls = document.querySelectorAll('.sr');

const srObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      srObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

srEls.forEach(el => srObs.observe(el));

/* ─── SKILL BARS ──────────────────────────────────── */
const fills = document.querySelectorAll('.skill-item__fill');

const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.pct + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

fills.forEach(f => barObs.observe(f));

/* ─── SCROLLSPY ───────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const spyObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.style.color = '';
        if (l.getAttribute('href') === '#' + e.target.id) {
          l.style.color = 'var(--blue)';
        }
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => spyObs.observe(s));

/* ─── EMAILJS SETUP ───────────────────────────────── */
emailjs.init('FNS6mpplNPehK-1qM'); // ← paste your Public Key here

/* ─── CONTACT FORM ────────────────────────────────── */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', e => {
  e.preventDefault();

  const name  = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const msg   = form.querySelector('#message').value.trim();

  // Validation
  if (!name || !email || !msg) { shakeForm(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { shakeForm(); return; }

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Send via EmailJS
  emailjs.send(
    'service_p195gib',   // ← paste your Service ID here
    'template_jfh2vkk',  // ← paste your Template ID here
    {
      from_name:  name,
      from_email: email,
      message:    msg,
    }
  )
  .then(() => {
    success.textContent = '✓ Message sent! I`ll get back to you shortly.' ;
    success.style.color = 'var(--green)';
    success.classList.add('show');
    form.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => success.classList.remove('show'), 5000);
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    success.textContent = '✗ Something went wrong. Please email me directly.';
    success.style.color = '#e05a5a';
    success.classList.add('show');
    btn.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => success.classList.remove('show'), 5000);
  });
});

function shakeForm() {
  form.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' },
     { transform: 'translateX(7px)' }, { transform: 'translateX(-5px)' },
     { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }],
    { duration: 380, easing: 'ease' }
  );
}

/* ─── BACK TO TOP ─────────────────────────────────── */
document.getElementById('back-to-top').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── CONSOLE EASTER EGG ──────────────────────────── */
console.log('%c{ } Backend Developer · Class of 2026', 'font-size:1rem;font-weight:600;color:#4071a0;font-family:monospace;');
console.log('%cOpen to backend roles. Ping me at yashuyashu31166@gmail.com', 'font-size:0.85rem;color:#8a98ad;font-family:monospace;');

/* ─── CONTENT PROTECTION ──────────────────────────── */

// Disable right-click context menu
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable common keyboard shortcuts
document.addEventListener('keydown', e => {
  const blocked =
    (e.ctrlKey && ['u', 'U', 's', 'S', 'c', 'C', 'a', 'A', 'p', 'P'].includes(e.key)) || // Ctrl+U/S/C/A/P
    (e.ctrlKey && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) ||         // Ctrl+Shift+I/J/C
    e.key === 'F12';                                                                          // F12 DevTools

  if (blocked) e.preventDefault();
});

// Disable drag-to-select on images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', e => e.preventDefault());
});