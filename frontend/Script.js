// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Contact form — submits to the backend API (POST /api/contact)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      const data = Object.fromEntries(new FormData(form).entries());

      status.style.display = 'block';
      status.style.color = 'var(--ink-soft)';
      status.textContent = '> sending...';
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        if (res.ok && result.ok) {
          status.style.color = 'var(--teal)';
          status.textContent = '> ' + (result.message || 'Message sent — we\'ll be in touch.');
          form.reset();
        } else {
          status.style.color = 'var(--coral)';
          status.textContent = '> ' + (result.error || 'Something went wrong. Please try again.');
        }
      } catch (err) {
        status.style.color = 'var(--coral)';
        status.textContent = '> Could not reach the server. Is the backend running?';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});