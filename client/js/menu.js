document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link');
  const title = document.getElementById('section-title');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const section = link.dataset.section;
      title.textContent = section.charAt(0).toUpperCase() + section.slice(1);
    });
  });
});
