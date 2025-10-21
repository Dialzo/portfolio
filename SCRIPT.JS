// Formulaire avec Formspree (avec garde si l'élément manque)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : 'Envoyer';

    if (submitButton) {
      // Afficher l'état de chargement
      submitButton.textContent = "Envoi en cours...";
      submitButton.disabled = true;
    }

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          alert("✅ Message envoyé avec succès ! Je vous répondrai rapidement.");
          form.reset();
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      })
      .catch(error => {
        alert("❌ Erreur lors de l'envoi. Veuillez réessayer ou me contacter directement.");
        console.error('Erreur:', error);
      })
      .finally(() => {
        // Restaurer le bouton
        if (submitButton) {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      });
  });
}


// Burger menu
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
if (burger && mobileMenu) {
  function openMenu() {
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    // focus sur le premier lien
    const firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.focus();
  }

  burger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('hidden')) openMenu(); else closeMenu();
  });

  // Keyboard support for burger (Enter / Space)
  burger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (mobileMenu.classList.contains('hidden')) openMenu(); else closeMenu();
    }
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Close on Escape when menu open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  });

  // Fermer le menu en cliquant sur un lien
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close when clicking outside menu (mobile)
  document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('hidden')) {
      const isClickInside = mobileMenu.contains(e.target) || burger.contains(e.target);
      if (!isClickInside) closeMenu();
    }
  });
}

// Animation des statistiques
function animateCounter(elementId, targetValue, suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;

  let currentValue = 0;
  const increment = targetValue / 100;
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(currentValue) + suffix;
  }, 20);
}

// Observer pour déclencher les animations (créé après DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        if (target.id === 'projectsCount') {
          animateCounter('projectsCount', 50, '+');
        } else if (target.id === 'satisfactionRate') {
          animateCounter('satisfactionRate', 100, '%');
        } else if (target.id === 'deliveryTime') {
          animateCounter('deliveryTime', 5, 'j');
        } else if (target.id === 'performanceScore') {
          animateCounter('performanceScore', 95, '+');
        }
      }
    });
  }, { threshold: 0.5 });

  // Observer les éléments de statistiques
  const statsElements = ['projectsCount', 'satisfactionRate', 'deliveryTime', 'performanceScore'];
  statsElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) observer.observe(element);
  });
  // Theme toggle initialization
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function applyTheme(isDark) {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      if (themeIcon) themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />';
    } else {
      html.classList.remove('dark');
      if (themeIcon) themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-9H21M3 12H4.34M18.36 5.64l-.7.7M6.34 17.66l-.7.7M18.36 18.36l-.7-.7M6.34 6.34l-.7-.7" />';
    }
  }

  // Determine initial theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    applyTheme(true);
  } else if (savedTheme === 'light') {
    applyTheme(false);
  } else {
    // respect system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      applyTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});
