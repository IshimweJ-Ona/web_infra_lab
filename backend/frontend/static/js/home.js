console.log("Home page loaded");
fetch("/status")
  .then((res) => res.json())
  .then((data) => {
    const loggedIn = data.loggedIn;

    const loginLink = document.querySelector('a[href="/login"]');
    const registerLink = document.querySelector('a[href="/register"]');

    if (loggedIn) {
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";

      const logoutLi = document.createElement('li');
      const logoutLink = document.createElement('a');
      logoutLink.href = "#";
      logoutLink.innerText = "Logout";
      logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await fetch("/logout", { method: "POST" });
        window.location.reload();
      });

      logoutLi.appendChild(logoutLink);
      document.querySelector(".nav-links")?.appendChild(logoutLi);
    }
  });


window.addEventListener("DOMContentLoaded", () => {
  fetch("/status")
    .then((res) => res.json())
    .then((data) => console.log("Session status:", data))
    .catch((err) => console.error("Status check failed:", err));
});

document.addEventListener('DOMContentLoaded', function() {
  const letters = ['P', 'a', 'y', 'R', 'w', 'a'];
  const colors = ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6', '#1abc9c'];

  function initializeLogo(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      letters.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'logo-letter';
        span.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(span);
      });
    }
  }

  initializeLogo('logo');
  initializeLogo('home-logo');

  const navbar = document.querySelector('.navbar');
  const menuBtn = document.querySelector('.menu-btn');
  const closeBtn = document.querySelector('.close-btn');
  const navLinks = document.querySelectorAll('.nav-links a');
  const overlay = document.querySelector('.overlay');

  function toggleMenu(show) {
    navbar.classList.toggle('active', show);
    document.body.classList.toggle('menu-open', show);
    if (overlay) overlay.style.display = show ? 'block' : 'none';
  }

  if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
  if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

  if (navLinks) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navbar.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && navbar.classList.contains('active')) {
        toggleMenu(false);
      }
    }, 250);
  });
});