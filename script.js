/**
 * ===================================================================
 * PORTFOLIO SCRIPT
 * Plain JavaScript (ES6+) - No external dependencies or build step
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------
     1. THEME SWITCHER (Dark & Light Mode)
     ------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const rootElement = document.documentElement;

  // Check saved theme in localStorage, default to dark if not set
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersLight) {
    // If you prefer dark mode as default regardless of OS preference, you can comment this out:
    // rootElement.setAttribute('data-theme', 'light');
    rootElement.setAttribute('data-theme', 'dark');
  } else {
    rootElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  /* -------------------------------------------------------------------
     2. STICKY NAVBAR & BACK-TO-TOP VISIBILITY
     ------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar background blur/border enhancement
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* -------------------------------------------------------------------
     3. MOBILE NAVIGATION MENU
     ------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close menu when a navigation item is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK ON SCROLL (ScrollSpy)
     ------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  /* -------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, no need to keep observing
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* -------------------------------------------------------------------
     6. CONTACT FORM (MAILTO DISPATCHER)
     ------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Default recipient email address
      const recipient = contactForm.getAttribute('data-recipient') || 'jaswanthkamaraj@gmail.com';

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('msgSubject').value.trim();
      const message = document.getElementById('msgBody').value.trim();

      // Format mailto body
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent from ${window.location.href}`
      );

      // Launch email client
      const mailtoUrl = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;
      window.location.href = mailtoUrl;

      // UX Feedback
      if (formStatus) {
        formStatus.textContent = '✓ Opening your email client to dispatch message...';
        formStatus.className = 'form-status show success';

        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
          contactForm.reset();
        }, 6000);
      }
    });
  }

  /* -------------------------------------------------------------------
     7. DYNAMIC COPYRIGHT YEAR
     ------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------
     8. LINEAR-STYLE INTERACTIVE SPOTLIGHT GLOW ON CARDS
     ------------------------------------------------------------------- */
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  if (spotlightCards.length) {
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', `-999px`);
        card.style.setProperty('--mouse-y', `-999px`);
      });
    });
  }

  /* -------------------------------------------------------------------
     9. INTERACTIVE 3D PERSPECTIVE TILT ON HERO PORTRAIT SHOWCASE
     ------------------------------------------------------------------- */
  const showcaseContainer = document.getElementById('heroShowcase');
  const portraitCard = document.getElementById('portraitCard');

  if (showcaseContainer && portraitCard && window.matchMedia('(pointer: fine)').matches) {
    showcaseContainer.addEventListener('mousemove', (e) => {
      const rect = showcaseContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
    });

    showcaseContainer.addEventListener('mouseleave', () => {
      portraitCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }

  /* -------------------------------------------------------------------
     10. INTERACTIVE CERTIFICATE VIEWER MODAL
     ------------------------------------------------------------------- */
  const certModal = document.getElementById('certModal');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalImg = document.getElementById('certModalImg');
  const certModalMeta = document.getElementById('certModalMeta');
  const certModalDownload = document.getElementById('certModalDownload');
  const certModalClose = document.getElementById('certModalClose');
  const certModalDismiss = document.getElementById('certModalDismiss');

  const CERT_DATA = {
    'ml-spec': {
      title: 'Machine Learning Specialization — DeepLearning.AI & Stanford Online',
      file: 'cert-machine-learning.svg',
      downloadName: 'Jaswanth_Kamaraj_Machine_Learning_Certificate.svg',
      meta: 'Verified Credential: ID DLAI-ML-8492041 • DeepLearning.AI & Stanford Online'
    },
    'hackathon': {
      title: 'Inter-College AI Hackathon Innovation Award — Top 10 Finalist',
      file: 'cert-hackathon.svg',
      downloadName: 'Jaswanth_Kamaraj_Hackathon_Certificate.svg',
      meta: 'Verified Credential: Ref MZCET-HACK-T10 • Institution Innovation Council'
    },
    'data-science': {
      title: 'Applied Data Science with Python — University of Michigan & Kaggle',
      file: 'cert-data-science.svg',
      downloadName: 'Jaswanth_Kamaraj_Data_Science_Certificate.svg',
      meta: 'Verified Credential: ID UOM-DS-9382104 • University of Michigan & Kaggle'
    }
  };

  window.openCertModal = function(certId) {
    const cert = CERT_DATA[certId];
    if (!cert || !certModal) return;

    if (certModalTitle) certModalTitle.textContent = '📜 ' + cert.title;
    if (certModalImg) {
      certModalImg.src = cert.file;
      certModalImg.alt = cert.title;
    }
    if (certModalMeta) certModalMeta.textContent = cert.meta;
    if (certModalDownload) {
      certModalDownload.href = cert.file;
      certModalDownload.download = cert.downloadName;
    }

    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeCertModal = function() {
    if (!certModal) return;
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
  }
  if (certModalDismiss) {
    certModalDismiss.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

});

