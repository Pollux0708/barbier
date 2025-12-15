// script.js — animation fade-in (stagger), gestion du menu et disparition vidéo
document.addEventListener('DOMContentLoaded', () => {

  // ---------- MENU ----------
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    // fermer le menu quand on clique sur un lien
    sidebar.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        sidebar.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ---------- HERO VIDEO OPACITY ON SCROLL ----------
  const hero = document.querySelector(".hero");
  const bgVideo = document.querySelector(".hero-video");

  function updateHeroOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const fadeAt = Math.max(200, window.innerHeight * 0.25); // distance de fade
    const opacity = Math.max(0, 1 - (scrollY / fadeAt));
    if (bgVideo) bgVideo.style.opacity = opacity;
    if (scrollY > 20) document.body.classList.add('scrolled');
    else document.body.classList.remove('scrolled');
  }
  updateHeroOnScroll();
  window.addEventListener('scroll', updateHeroOnScroll, { passive: true });

  // ---------- FADE-IN + STAGGER POUR CARDS ET TITLES ----------
  // s'assurer qu'il n'y a pas de doublons dans la liste d'observation
  // ajouter classes si manquantes
  document.querySelectorAll('.card').forEach(card => {
    if (!card.classList.contains('fade-in')) card.classList.add('fade-in');
  });
  document.querySelectorAll('section h2').forEach(title => {
    if (!title.classList.contains('fade-title')) title.classList.add('fade-title');
  });

  const appearOptions = {
    threshold: 0.18,
    rootMargin: "0px 0px -50px 0px"
  };

  // Observer pour les cartes (stagger localisé par groupe .content-grid)
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      // trouver le groupe (content-grid) auquel appartient la card
      const group = el.closest('.content-grid') || el.parentElement;
      let items = [];
      if (group) items = Array.from(group.querySelectorAll('.card'));
      else items = [el];

      const index = items.indexOf(el);
      const delay = (index >= 0 ? index : 0) * 120; // 120ms par élément

      setTimeout(() => {
        el.classList.add('visible');
        // on arrête d'observer cet élément
        observer.unobserve(el);
      }, delay);
    });
  }, appearOptions);

  // observe only .card.fade-in elements
  document.querySelectorAll('.card.fade-in').forEach(card => {
    cardObserver.observe(card);
  });

  // Observer pour les titres (pas de stagger)
  const titleObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, appearOptions);

  document.querySelectorAll('section h2.fade-title').forEach(title => {
    titleObserver.observe(title);
  });

  // ---------- CONTACT FORM (démo) ----------
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple confirmation visuelle (à remplacer par envoi réel)
      alert('Rendez-vous: formulaire envoyé (démo).');
      form.reset();
    });
  }

}); // end DOMContentLoaded
