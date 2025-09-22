/* script.js
   DOM interactions, event handling, simple slider, form validation
*/

document.addEventListener('DOMContentLoaded', () => {
  // Insert current year into all #year spans
  const years = document.querySelectorAll('#year');
  const currentYear = new Date().getFullYear();
  years.forEach(y => y.textContent = currentYear);

  // Mobile nav toggle
  const navToggle = document.getElementById('btn-nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('open');
      // animate hamburger to X
      navToggle.classList.toggle('open');
    });
  }

  // Highlight current page nav link
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.href === location.href || link.href === location.pathname || link.getAttribute('href') === location.pathname.split('/').pop() ) {
      link.classList.add('active');
      link.style.color = '#fff';
    }
  });

  // Smooth scroll for internal anchor clicks (if any)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'smooth', block:'center'});
    });
  });

  // Simple card slider
  const slider = document.getElementById('card-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    let idx = 0;
    slides.forEach((s, i) => { s.style.transform = `translateX(${i * 100}%)`; });

    const nextSlide = document.getElementById('next-slide');
    const prevSlide = document.getElementById('prev-slide');

    function goTo(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.style.transform = `translateX(${(i - idx) * 100}%)`;
      });
    }
    if (nextSlide) nextSlide.addEventListener('click', () => goTo(idx + 1));
    if (prevSlide) prevSlide.addEventListener('click', () => goTo(idx - 1));

    // auto slide every 6s
    setInterval(() => goTo(idx + 1), 6000);
  }

  // Contact form validation & mock submission (client-side only)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      let ok = true;

      if (!name.value.trim()) {
        showError('error-name', 'Please enter your name.');
        ok = false;
      }
      if (!validateEmail(email.value)) {
        showError('error-email', 'Please enter a valid email.');
        ok = false;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError('error-message', 'Please enter a message (10+ characters).');
        ok = false;
      }

      if (!ok) return;

      // Mock send: show success message and clear form
      const feedback = document.getElementById('form-feedback');
      feedback.textContent = 'Thanks! Your message has been received. We will respond shortly.';
      form.reset();
      // Add simple DOM manipulation: show a temporary highlight
      feedback.classList.add('flash');
      setTimeout(() => feedback.classList.remove('flash'), 2200);
    });
  }

  // Helper functions
  function showError(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text;
    }
  }
  function clearErrors() {
    ['error-name','error-email','error-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    const fb = document.getElementById('form-feedback');
    if (fb) fb.textContent = '';
  }
  function validateEmail(email) {
    // simple email regex (client-side)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Accessibility: close nav when clicking outside on mobile
  document.addEventListener('click', (ev) => {
    const navOpen = mainNav && mainNav.classList.contains('open');
    if (!navOpen) return;
    const target = ev.target;
    if (!mainNav.contains(target) && !navToggle.contains(target)) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('open');
    }
  });

  // small visual feedback CSS insertion (flash)
  const style = document.createElement('style');
  style.innerHTML = `.form-feedback.flash{animation: pop .35s ease both} @keyframes pop{from{transform:scale(.98); opacity:0} to{transform:scale(1); opacity:1}}`;
  document.head.appendChild(style);
});