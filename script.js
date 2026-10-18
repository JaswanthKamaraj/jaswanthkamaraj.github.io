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

  /* -------------------------------------------------------------------
     11. PHOTOGRAPHY GALLERY FILTERING & INTERACTIVE LIGHTBOX
     ------------------------------------------------------------------- */
  const photoFilterBtns = document.querySelectorAll('.photo-filter-btn');
  const photoItems = document.querySelectorAll('.photo-item');
  const photoLightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxDownload = document.getElementById('lightboxDownload');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const PHOTO_GALLERY_DATA = [
    {
      src: 'photography/shot1-still-life-reading.jpg',
      title: 'Atomic Habits & Morning Reflections',
      meta: 'Flat-lay Composition • Sunglasses & Phone Portrait',
      category: 'creative'
    },
    {
      src: 'photography/shot2-macro-sprout-natural.jpg',
      title: 'Genesis of Life • The Sprout',
      meta: 'Ground-Level Perspective • Red Soil & Soft Bokeh',
      category: 'nature'
    },
    {
      src: 'photography/shot3-miniature-perspective.jpg',
      title: 'Miniature Flight & Spatial Depth',
      meta: 'Handheld Perspective • Depth of Field & Campus Backdrop',
      category: 'creative'
    },
    {
      src: 'photography/shot4-jasmine-buds-macro.jpg',
      title: 'Jasmine Bloom Cluster (Mogra)',
      meta: 'Botanical Macro • Delicate Petals & Soft Textures',
      category: 'nature'
    },
    {
      src: 'photography/shot5-artistic-sprout-grading.jpg',
      title: 'Ethereal Flora • Cinematic Grade',
      meta: 'Color Grading & Lighting • Atmospheric Particle Edit',
      category: 'cinematic'
    }
  ];

  let currentPhotoIndex = 0;

  // Filter Categories
  if (photoFilterBtns.length && photoItems.length) {
    photoFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        photoFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        photoItems.forEach(item => {
          const cat = item.getAttribute('data-category') || '';
          const catList = cat.split(' ');
          if (filter === 'all' || catList.includes(filter)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // Lightbox functions
  window.openPhotoLightbox = function(index) {
    if (!photoLightbox || index < 0 || index >= PHOTO_GALLERY_DATA.length) return;
    currentPhotoIndex = index;
    renderLightboxFilmstrip();
    updateLightboxContent();
    photoLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closePhotoLightbox = function() {
    if (!photoLightbox) return;
    photoLightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  function updateLightboxContent() {
    const data = PHOTO_GALLERY_DATA[currentPhotoIndex];
    if (!data) return;

    if (lightboxImg) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.title;
    }
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxMeta) lightboxMeta.textContent = data.meta;
    if (lightboxCounter) lightboxCounter.textContent = `${currentPhotoIndex + 1} of ${PHOTO_GALLERY_DATA.length}`;
    if (lightboxDownload) {
      lightboxDownload.href = data.src;
      lightboxDownload.download = `Jaswanth_Kamaraj_Shot_${currentPhotoIndex + 1}.jpg`;
    }

    // Update filmstrip active state
    const allThumbs = document.querySelectorAll('.filmstrip-thumb-btn');
    allThumbs.forEach((th, i) => {
      if (i === currentPhotoIndex) {
        th.classList.add('active');
        th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        th.classList.remove('active');
      }
    });
  }

  function renderLightboxFilmstrip() {
    const track = document.getElementById('lightboxFilmstripTrack');
    if (!track) return;
    track.innerHTML = '';

    PHOTO_GALLERY_DATA.forEach((photo, idx) => {
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = `filmstrip-thumb-btn ${idx === currentPhotoIndex ? 'active' : ''}`;
      thumbBtn.setAttribute('aria-label', `Switch to Photo ${idx + 1}: ${photo.title}`);
      thumbBtn.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" class="filmstrip-thumb-img">
        <span class="filmstrip-thumb-num">${idx + 1}</span>
      `;
      thumbBtn.addEventListener('click', () => {
        currentPhotoIndex = idx;
        updateLightboxContent();
      });
      track.appendChild(thumbBtn);
    });
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % PHOTO_GALLERY_DATA.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + PHOTO_GALLERY_DATA.length) % PHOTO_GALLERY_DATA.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closePhotoLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);

  if (photoLightbox) {
    photoLightbox.addEventListener('click', (e) => {
      if (e.target === photoLightbox) {
        closePhotoLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!photoLightbox || !photoLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closePhotoLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  /* -------------------------------------------------------------------
     15. 3D FANNED-OUT PHOTO DECK & EXPLOSION LOGIC
     ------------------------------------------------------------------- */
  const photoDeckShowcase = document.getElementById('photoDeckShowcase');
  const photoExpandedShowcase = document.getElementById('photoExpandedShowcase');
  const deck3dStage = document.getElementById('deck3dStage');
  const btnDeckExplode = document.getElementById('btnDeckExplode');
  const btnRestackDeck = document.getElementById('btnRestackDeck');
  const btnReplayAnim = document.getElementById('btnReplayAnim');
  const filterAllBtn = document.getElementById('filterAllBtn');

  // Web Audio Synthesized Camera Shutter Click Sound
  function playCameraShutterSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Shutter snap 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(850, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.07);
      gain1.gain.setValueAtTime(0.28, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.08);

      // Shutter mirror return snap 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1200, ctx.currentTime + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.16);
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.17);
    } catch (err) {
      // Audio playback silently ignored if device doesn't permit
    }
  }

  // Explode 3D Deck into Full Interactive Grid
  let isExploding = false;
  function explodePhotoDeck(shouldScroll = false) {
    if (isExploding) return;
    isExploding = true;

    playCameraShutterSound();

    // 1. Flip sealed cards in 3D to reveal photos on the deck first
    const flippers = document.querySelectorAll('.card-inner-flip');
    flippers.forEach((flip, idx) => {
      setTimeout(() => {
        flip.classList.add('flipped');
      }, idx * 50);
    });

    // 2. Explode outward into the full interactive grid
    setTimeout(() => {
      if (photoDeckShowcase) {
        photoDeckShowcase.style.display = 'none';
      }
      if (photoExpandedShowcase) {
        photoExpandedShowcase.classList.add('active');
        photoExpandedShowcase.style.display = 'block';
      }

      const flash = document.getElementById('cameraFlashOverlay');
      const items = document.querySelectorAll('.photo-item');
      const filterBtns = document.querySelectorAll('.photo-filter-btn');

      // Reset filter to 'All Frames (5)'
      filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
          btn.classList.add('active');
        } else if (btn.getAttribute('data-filter')) {
          btn.classList.remove('active');
        }
      });

      // Unhide all photos and trigger staggered explosion entrance
      items.forEach(item => {
        item.classList.remove('hidden');
        item.classList.remove('animating-in');
      });

      // Camera flash burst
      if (flash) {
        flash.classList.remove('flashing');
        void flash.offsetWidth;
        flash.classList.add('flashing');
      }

      // Staggered 3D spring cascade
      items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.08}s`;
        void item.offsetWidth;
        item.classList.add('animating-in');
      });

      if (shouldScroll) {
        const photoSection = document.getElementById('photography');
        if (photoSection) {
          photoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      isExploding = false;
    }, 320);
  }

  // Collapse Full Grid back into 3D Photo Deck (Re-seal vault)
  function collapseToPhotoDeck() {
    playCameraShutterSound();

    if (photoExpandedShowcase) {
      photoExpandedShowcase.classList.remove('active');
      photoExpandedShowcase.style.display = 'none';
    }

    // Reset card flips back to sealed state
    const flippers = document.querySelectorAll('.card-inner-flip');
    flippers.forEach(flip => {
      flip.classList.remove('flipped');
    });

    if (photoDeckShowcase) {
      photoDeckShowcase.style.display = 'flex';
      photoDeckShowcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 3D Mouse Parallax Tilt on Hovering the Deck Stage
  if (deck3dStage) {
    deck3dStage.addEventListener('mousemove', (e) => {
      const rect = deck3dStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 14;
      const rotateY = (x / (rect.width / 2)) * 18;
      deck3dStage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    deck3dStage.addEventListener('mouseleave', () => {
      deck3dStage.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    deck3dStage.addEventListener('click', () => {
      explodePhotoDeck(false);
    });
  }

  if (btnDeckExplode) {
    btnDeckExplode.addEventListener('click', (e) => {
      e.stopPropagation();
      explodePhotoDeck(false);
    });
  }

  if (btnRestackDeck) {
    btnRestackDeck.addEventListener('click', (e) => {
      e.preventDefault();
      collapseToPhotoDeck();
    });
  }

  if (btnReplayAnim) {
    btnReplayAnim.addEventListener('click', () => {
      explodePhotoDeck(false);
    });
  }

  if (filterAllBtn) {
    filterAllBtn.addEventListener('click', () => {
      const items = document.querySelectorAll('.photo-item');
      items.forEach((item, index) => {
        item.classList.remove('animating-in');
        item.style.animationDelay = `${index * 0.08}s`;
        void item.offsetWidth;
        item.classList.add('animating-in');
      });
    });
  }

  // 3D Parallax Tilt on Expanded Photo Cards
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });

  // Clicking "Photography" in Navbar: Smoothly scrolls to photography section
  const navPhotographyLinks = document.querySelectorAll('a[href="#photography"]');
  navPhotographyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const photoSection = document.getElementById('photography');
      if (photoSection) {
        e.preventDefault();
        photoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

