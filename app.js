document.addEventListener('DOMContentLoaded', () => {
  // Session timer
  const timerElement = document.getElementById('session-timer');
  let secondsElapsed = 0;

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  window.setInterval(() => {
    secondsElapsed += 1;
    timerElement.textContent = formatTime(secondsElapsed);
  }, 1000);

  // Switching between sections without reloading the web page
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');
  const defaultSectionId = 'catalog';

  const renderRoute = () => {
    const currentHash = window.location.hash.replace('#', '');
    const isValidSection = Array.from(sections).some(
      (section) => section.id === currentHash
    );
    const targetId = isValidSection ? currentHash : defaultSectionId;

    // Managing visibility of sections
    sections.forEach((section) => {
      if (section.id === targetId) {
        section.classList.remove('is-hidden');
      } else {
        section.classList.add('is-hidden');
      }
    });

    // Visual indication of the active menu item
    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute('href').replace('#', '');
      link.classList.toggle('is-active', linkTarget === targetId);
    });
  };

  // Listening for changes in the URL fragment (clicks on links and Back/Forward buttons)
  window.addEventListener('hashchange', renderRoute);

  // Initializing the initial state when the page loads
  renderRoute();
});