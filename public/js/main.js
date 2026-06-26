/**
 * MediclawAI — Main JS
 * Waitlist form submission + smooth UX
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Smooth nav scroll with offset for fixed nav ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- Nav active highlight on scroll ---
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isMatch = link.getAttribute('href') === `#${id}`;
          link.style.color = isMatch ? 'var(--blue)' : '';
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-64px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));

  // --- Waitlist form ---
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const message = document.getElementById('form-message');

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `form-message ${type}`;
    message.hidden = false;
    message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.hidden = loading;
    btnLoading.hidden = !loading;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    message.hidden = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name) {
      showMessage('Please enter your full name.', 'error');
      form.name.focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      form.email.focus();
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        organization: form.organization.value.trim(),
        building: form.building.value.trim()
      };

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(data.message || "Thank you — we'll be in touch.", 'success');
        form.reset();
        // Track if gtag available
        if (typeof gtag === 'function') {
          gtag('event', 'waitlist_signup', { event_category: 'engagement' });
        }
      } else {
        showMessage(data.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showMessage('Network error — please try again in a moment.', 'error');
      console.error('[waitlist] submit error:', err);
    } finally {
      setLoading(false);
    }
  });

  // --- Subtle entrance animations ---
  const animateObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const animTargets = document.querySelectorAll('.feature-card, .audience-card, .proof-feature, .sidebar-item');
  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
    animateObserver.observe(el);
  });

});
