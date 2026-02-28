// ==================== MOBILE MENU TOGGLE ====================
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  menuIconOpen.classList.toggle('hidden', isOpen);
  menuIconClose.classList.toggle('hidden', !isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  menuIconOpen.classList.remove('hidden');
  menuIconClose.classList.add('hidden');
  menuToggle.setAttribute('aria-label', 'Otwórz menu');
}

menuToggle.addEventListener('click', toggleMenu);

mobileLinks.forEach(function (link) {
  link.addEventListener('click', closeMenu);
});

// Close mobile menu on resize to desktop
window.addEventListener('resize', function () {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});

// ==================== NAVBAR SHADOW ON SCROLL ====================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 10) {
    navbar.classList.add('shadow-md');
    navbar.classList.remove('shadow-sm');
  } else {
    navbar.classList.remove('shadow-md');
    navbar.classList.add('shadow-sm');
  }
});

// ==================== SECTION FADE-IN ON SCROLL ====================
const fadeSections = document.querySelectorAll('.section-fade');

const fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

fadeSections.forEach(function (section) {
  fadeObserver.observe(section);
});

// ==================== CAROUSEL ====================
(function () {
  var carousel = document.getElementById('carousel');
  var track = document.getElementById('carousel-track');
  if (!carousel || !track) return;

  // Duplicate all cards for seamless loop
  var cards = track.innerHTML;
  track.innerHTML = cards + cards;

  // Image fade cycling for cards with multiple images
  var projectOffsets = {};
  var offsetCounter = 0;

  track.querySelectorAll('.carousel-card').forEach(function (card) {
    var imgs = card.querySelectorAll('.carousel-img');
    if (imgs.length <= 1) return;

    var project = card.dataset.project;
    if (!(project in projectOffsets)) {
      projectOffsets[project] = offsetCounter * 1000;
      offsetCounter++;
    }

    var cardImgs = Array.from(imgs);
    var current = 0;

    setTimeout(function () {
      setInterval(function () {
        cardImgs[current].style.opacity = '0';
        current = (current + 1) % cardImgs.length;
        cardImgs[current].style.opacity = '1';
      }, 5000);
    }, projectOffsets[project]);
  });

  var autoSpeed = 0.5;
  var scrollPos = 0;
  var isDragging = false;
  var startX = 0;
  var scrollStart = 0;
  var halfWidth = 0;

  function updateHalfWidth() {
    halfWidth = track.scrollWidth / 2;
  }

  function wrapPosition() {
    if (scrollPos >= halfWidth) {
      scrollPos -= halfWidth;
    } else if (scrollPos < 0) {
      scrollPos += halfWidth;
    }
  }

  function autoScroll() {
    if (!isDragging) {
      scrollPos += autoSpeed;
      wrapPosition();
      track.style.transform = 'translateX(' + (-scrollPos) + 'px)';
    }
    requestAnimationFrame(autoScroll);
  }

  function startDrag(x) {
    isDragging = true;
    startX = x;
    scrollStart = scrollPos;
    carousel.style.cursor = 'grabbing';
  }

  function moveDrag(x) {
    if (!isDragging) return;
    var diff = startX - x;
    scrollPos = scrollStart + diff;
    wrapPosition();
    track.style.transform = 'translateX(' + (-scrollPos) + 'px)';
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';
  }

  // Mouse events
  carousel.addEventListener('mousedown', function (e) {
    e.preventDefault();
    startDrag(e.clientX);
  });
  window.addEventListener('mousemove', function (e) {
    moveDrag(e.clientX);
  });
  window.addEventListener('mouseup', endDrag);

  // Touch events
  carousel.addEventListener('touchstart', function (e) {
    startDrag(e.touches[0].clientX);
  }, { passive: true });
  carousel.addEventListener('touchmove', function (e) {
    moveDrag(e.touches[0].clientX);
  }, { passive: true });
  carousel.addEventListener('touchend', endDrag);

  updateHalfWidth();
  window.addEventListener('resize', updateHalfWidth);
  requestAnimationFrame(autoScroll);
})();

// ==================== CURRENT YEAR IN FOOTER ====================
document.getElementById('current-year').textContent = new Date().getFullYear();

// ==================== EMAILJS CONTACT FORM ====================
// Configure these with your EmailJS credentials:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service and template
// 3. Replace the placeholder values below
var EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
var EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// Initialize EmailJS (uncomment when credentials are configured)
// emailjs.init(EMAILJS_PUBLIC_KEY);

var contactForm = document.getElementById('contact-form');
var submitBtn = document.getElementById('submit-btn');
var formStatus = document.getElementById('form-status');

function showStatus(message, isSuccess) {
  formStatus.textContent = message;
  formStatus.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'bg-red-50', 'text-red-700');
  if (isSuccess) {
    formStatus.classList.add('bg-green-50', 'text-green-700');
  } else {
    formStatus.classList.add('bg-red-50', 'text-red-700');
  }
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Check if EmailJS is configured
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    showStatus('Formularz kontaktowy zostanie aktywowany wkrótce. Proszę o kontakt telefoniczny lub mailowy.', false);
    return;
  }

  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Wysyłanie...';

  var templateParams = {
    from_name: document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function () {
      showStatus('Wiadomość została wysłana pomyślnie! Skontaktuję się wkrótce.', true);
      contactForm.reset();
    })
    .catch(function () {
      showStatus('Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub skontaktuj się telefonicznie.', false);
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Wyślij wiadomość';
    });
});
