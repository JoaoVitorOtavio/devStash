// ============ Footer year ============
document.getElementById('year').textContent = new Date().getFullYear();

// ============ Navbar opacity on scroll ============
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ============ Scroll reveal ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// ============ Pricing toggle ============
const pricingToggle = document.getElementById('pricingToggle');
const monthlyLabel = document.querySelector('[data-period-label="monthly"]');
const yearlyLabel = document.querySelector('[data-period-label="yearly"]');
const priceAmount = document.querySelector('.amount[data-monthly]');
const pricePeriod = document.querySelector('.period[data-monthly]');

function setPricingPeriod(isYearly) {
  pricingToggle.setAttribute('aria-checked', String(isYearly));
  monthlyLabel.classList.toggle('active-period', !isYearly);
  yearlyLabel.classList.toggle('active-period', isYearly);
  priceAmount.textContent = isYearly ? priceAmount.dataset.yearly : priceAmount.dataset.monthly;
  pricePeriod.textContent = isYearly ? pricePeriod.dataset.yearly : pricePeriod.dataset.monthly;
}

pricingToggle.addEventListener('click', () => {
  const isYearly = pricingToggle.getAttribute('aria-checked') !== 'true';
  setPricingPeriod(isYearly);
});
setPricingPeriod(false);

// ============ Chaos icons animation ============
const chaosIcons = [
  { label: 'Notion', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>' },
  { label: 'GitHub', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>' },
  { label: 'Slack', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>' },
  { label: 'VS Code', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>' },
  { label: 'Browser Tabs', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="9" x2="9" y2="21"></line></svg>' },
  { label: 'Terminal', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>' },
  { label: 'Text File', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>' },
  { label: 'Bookmark', svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>' },
];

const chaosBox = document.getElementById('chaosBox');
const ICON_SIZE = 46;

const initialBounds = chaosBox.getBoundingClientRect();
const initialWidth = initialBounds.width || 300;
const initialHeight = initialBounds.height || 320;

const particles = chaosIcons.map((icon, i) => {
  const el = document.createElement('div');
  el.className = 'chaos-icon';
  el.innerHTML = icon.svg;
  el.title = icon.label;
  chaosBox.appendChild(el);

  // Spread icons across the whole box, and give every icon a
  // constant, non-decaying drift speed/heading so it keeps floating
  // instead of settling once initial velocity damps out.
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.3 + Math.random() * 0.35;

  return {
    el,
    x: Math.random() * Math.max(initialWidth - ICON_SIZE, 1),
    y: Math.random() * Math.max(initialHeight - ICON_SIZE, 1),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 0.3,
    pulsePhase: Math.random() * Math.PI * 2,
  };
});

let mouseX = -9999;
let mouseY = -9999;
chaosBox.addEventListener('mousemove', (e) => {
  const rect = chaosBox.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});
chaosBox.addEventListener('mouseleave', () => {
  mouseX = -9999;
  mouseY = -9999;
});

let frame = 0;
function animateChaos() {
  frame++;
  const bounds = chaosBox.getBoundingClientRect();
  const width = bounds.width || 300;
  const height = bounds.height || 320;

  particles.forEach((p) => {
    // Constant drift — never damped, so icons keep floating forever
    // instead of freezing in place after the first second.
    p.x += p.vx;
    p.y += p.vy;

    // Repel from mouse: a one-off positional nudge for this frame only.
    // Doesn't touch p.vx/p.vy, so speed never ratchets up on repeated hovers
    // and icons resume their normal drift as soon as the cursor moves away.
    const dx = p.x + ICON_SIZE / 2 - mouseX;
    const dy = p.y + ICON_SIZE / 2 - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 90;
    if (dist < repelRadius) {
      const force = (repelRadius - dist) / repelRadius;
      p.x += (dx / (dist || 1)) * force * 4;
      p.y += (dy / (dist || 1)) * force * 4;
    }

    // Bounce off walls (reflect the constant drift heading, don't kill it)
    if (p.x <= 0) { p.x = 0; p.vx = Math.abs(p.vx); }
    if (p.x >= width - ICON_SIZE) { p.x = width - ICON_SIZE; p.vx = -Math.abs(p.vx); }
    if (p.y <= 0) { p.y = 0; p.vy = Math.abs(p.vy); }
    if (p.y >= height - ICON_SIZE) { p.y = height - ICON_SIZE; p.vy = -Math.abs(p.vy); }

    p.rotation += p.rotSpeed;
    const scale = 1 + Math.sin(frame * 0.02 + p.pulsePhase) * 0.08;

    p.el.style.transform =
      `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${scale})`;
  });

  requestAnimationFrame(animateChaos);
}
requestAnimationFrame(animateChaos);
