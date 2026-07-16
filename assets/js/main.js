/* ============================================================
   N.D. CHOUGALE NAGARI PATH SANSTHA — main.js
   Premium Interactive Banking Website
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // initPreloader();
  initTheme();
  initLanguage();
  initNavbar();
  initMobileDrawer();
  initScrollReveal();
  initStats();
  initTestimonialSlider();
  initEmiCalculator();
  initFaqAccordion();
  initRatesTabs();
  initDownloadsFilter();
  initBranchLocator();
  initGalleryLightbox();
  // initCookieNotice();
  initSearchOverlay();
  initScrollTop();
  initGalleryFilter();
  initQuickTabs();
  initHeroSlider();
  initNotificationsModal();
});

/* ============================================================
   1. PRELOADER
   ============================================================ */
function initPreloader() {
  const loader = document.querySelector('.preloader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // Fallback: always hide after 2.5s
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);
}

/* ============================================================
   2. THEME (Dark / Light) — persisted in localStorage
   ============================================================ */
function initTheme() {
  const root = document.body;
  root.classList.remove('dark');
}

/* ============================================================
   3. LANGUAGE TOGGLE (Marathi ⟷ English)
   ============================================================ */
function initLanguage() {
  const btn = document.querySelector('.lang-btn');
  const topLinks = document.querySelectorAll('.lang-switch-link');
  const html = document.documentElement;
  const stored = localStorage.getItem('lang') || 'mr';

  const applyLang = (lang) => {
    html.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
    if (btn) btn.textContent = lang === 'mr' ? 'EN' : 'मराठी';
    topLinks.forEach(link => {
      const linkLang = link.getAttribute('data-lang-set');
      link.classList.toggle('active', linkLang === lang);
    });
    // Dynamically update dropdown options to match selected language
    document.querySelectorAll('select option[data-lang-mr]').forEach(opt => {
      const translated = lang === 'mr' ? opt.getAttribute('data-lang-mr') : opt.getAttribute('data-lang-en');
      opt.textContent = translated;
    });
  };

  applyLang(stored);

  if (btn) {
    btn.addEventListener('click', () => {
      const next = html.getAttribute('lang') === 'mr' ? 'en' : 'mr';
      applyLang(next);
    });
  }

  topLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const next = link.getAttribute('data-lang-set');
      applyLang(next);
    });
  });
}

/* ============================================================
   4. NAVBAR — shrink on scroll
   ============================================================ */
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // Dynamically inject full width header logo banner at the top of site-header
  if (!header.querySelector('.header-banner-wrap')) {
    const banner = document.createElement('div');
    banner.className = 'header-banner-wrap';
    banner.innerHTML = '<img src="assets/images/headerlogo.jpeg" alt="N.D. Chougale Header Logo" class="header-banner-img">';
    header.insertBefore(banner, header.firstChild);
  }

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   5. MOBILE DRAWER
   ============================================================ */
function initMobileDrawer() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  if (!hamburger || !drawer) return;

  const open = () => {
    hamburger.classList.add('active');
    drawer.classList.add('open');
    overlay && overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('active');
    drawer.classList.remove('open');
    overlay && overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? close() : open();
  });

  overlay && overlay.addEventListener('click', close);

  drawer.querySelectorAll('.mobile-drawer-link').forEach(l => l.addEventListener('click', close));
}

/* ============================================================
   6. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ============================================================
   7. STATISTICS COUNTER
   ============================================================ */
function initStats() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const val = target * easeOut(progress);
      const display = Number.isInteger(target) ? Math.floor(val).toLocaleString('en-IN') : val.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================================
   8. TESTIMONIALS SLIDER
   ============================================================ */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  const slides = track.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-nav');
  if (!slides.length) return;

  let current = 0;
  let timer;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'tg-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer && dotsContainer.appendChild(dot);
  });

  const goTo = (idx) => {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.tg-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current + 1);

  timer = setInterval(next, 5000);

  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => { timer = setInterval(next, 5000); });

  // Touch swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });
}

/* ============================================================
   9. EMI CALCULATOR
   ============================================================ */
function initEmiCalculator() {
  const amtEl     = document.getElementById('emi-amount');
  const rateEl    = document.getElementById('emi-rate');
  const tenureEl  = document.getElementById('emi-tenure');
  const amtDisp   = document.getElementById('emi-amount-display');
  const rateDisp  = document.getElementById('emi-rate-display');
  const tenDisp   = document.getElementById('emi-tenure-display');
  const emiVal    = document.getElementById('emi-monthly-val');
  const totalInt  = document.getElementById('emi-total-interest');
  const totalAmt  = document.getElementById('emi-total-amount');
  const donutPrin = document.getElementById('donut-principal');
  const donutInt  = document.getElementById('donut-interest');

  if (!amtEl) return;

  const circumference = 2 * Math.PI * 80; // r=80

  const calculate = () => {
    const P = parseFloat(amtEl.value);
    const r = parseFloat(rateEl.value) / 12 / 100;
    const n = parseInt(tenureEl.value) * 12;

    // Display values
    amtDisp.textContent  = '₹' + Number(P).toLocaleString('en-IN');
    rateDisp.textContent = rateEl.value + '%';
    tenDisp.textContent  = tenureEl.value + ' Yr';

    if (r === 0) {
      const emi = P / n;
      emiVal.textContent  = '₹' + Math.round(emi).toLocaleString('en-IN');
      totalAmt.textContent = '₹' + Math.round(P).toLocaleString('en-IN');
      totalInt.textContent = '₹0';
      return;
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - P;
    const prinRatio = P / total;

    emiVal.textContent   = '₹' + Math.round(emi).toLocaleString('en-IN');
    totalInt.textContent = '₹' + Math.round(interest).toLocaleString('en-IN');
    totalAmt.textContent = '₹' + Math.round(total).toLocaleString('en-IN');

    // Update donut SVG
    if (donutPrin && donutInt) {
      const offset = circumference * (1 - prinRatio);
      donutPrin.style.strokeDasharray  = `${circumference * prinRatio} ${circumference}`;
      donutPrin.style.strokeDashoffset = '0';
      donutInt.style.strokeDasharray   = `${circumference * (1 - prinRatio)} ${circumference}`;
      donutInt.style.strokeDashoffset  = `-${circumference * prinRatio}`;
    }
  };

  [amtEl, rateEl, tenureEl].forEach(el => el.addEventListener('input', calculate));
  calculate();
}

/* ============================================================
   10. FAQ ACCORDION
   ============================================================ */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open clicked (if wasn't open)
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ============================================================
   11. RATES TABS
   ============================================================ */
function initRatesTabs() {
  const tabs = document.querySelectorAll('.rates-tab-btn');
  const panels = document.querySelectorAll('.rates-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('rates-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ============================================================
   12. DOWNLOADS FILTER
   ============================================================ */
function initDownloadsFilter() {
  const input = document.querySelector('.dl-search-input');
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll('.doc-card').forEach(card => {
      const name = card.querySelector('.doc-name');
      const match = !query || (name && name.textContent.toLowerCase().includes(query));
      card.style.display = match ? '' : 'none';
    });
  });
}

/* ============================================================
   13. BRANCH LOCATOR
   ============================================================ */
function initBranchLocator() {
  const tabs = document.querySelectorAll('.branch-tab');
  const panels = document.querySelectorAll('.branch-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.branch;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('branch-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ============================================================
   14. GALLERY LIGHTBOX & FILTER
   ============================================================ */
function initGalleryLightbox() {
  const lightbox   = document.querySelector('.lightbox');
  const lbImg      = lightbox && lightbox.querySelector('img');
  const lbClose    = lightbox && lightbox.querySelector('.lightbox-close');
  const lbPrev     = lightbox && lightbox.querySelector('.lightbox-prev');
  const lbNext     = lightbox && lightbox.querySelector('.lightbox-next');
  if (!lightbox) return;

  let items = [];
  let idx = 0;

  const open = (i) => {
    idx = i;
    const src = items[idx].dataset.src || items[idx].querySelector('svg') ? '' : items[idx].querySelector('img')?.src || '';
    if (lbImg) lbImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const nav = (dir) => {
    idx = (idx + dir + items.length) % items.length;
    const src = items[idx].querySelector('img')?.src || '';
    if (lbImg) lbImg.src = src;
  };

  lbClose && lbClose.addEventListener('click', close);
  lbPrev  && lbPrev.addEventListener('click', () => nav(-1));
  lbNext  && lbNext.addEventListener('click', () => nav(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });

  // Bind gallery items
  const rebind = () => {
    items = Array.from(document.querySelectorAll('.gallery-item'));
    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
    });
  };

  rebind();
}

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.gallery-item').forEach(item => {
        const cat = item.dataset.category || 'all';
        const show = filter === 'all' || cat === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ============================================================
   15. COOKIE NOTICE
   ============================================================ */
function initCookieNotice() {
  const banner = document.querySelector('.cookie-banner');
  const acceptBtn = banner && banner.querySelector('.cookie-accept');
  if (!banner) return;

  if (!localStorage.getItem('cookie_accepted')) {
    setTimeout(() => banner.classList.add('show'), 2000);
  }

  acceptBtn && acceptBtn.addEventListener('click', () => {
    banner.classList.remove('show');
    localStorage.setItem('cookie_accepted', '1');
  });
}

/* ============================================================
   16. SEARCH OVERLAY
   ============================================================ */
function initSearchOverlay() {
  const trigger = document.querySelector('.search-trigger');
  const overlay = document.querySelector('.search-overlay');
  const input   = overlay && overlay.querySelector('.search-overlay-input');
  const closeEl = overlay && overlay.querySelector('.search-overlay-close');
  if (!trigger || !overlay) return;

  const open = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 200);
  };

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  trigger.addEventListener('click', open);
  closeEl && closeEl.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ============================================================
   17. SCROLL TO TOP
   ============================================================ */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   18. QUICK SERVICES TABS
   ============================================================ */
function initQuickTabs() {
  const tabButtons = document.querySelectorAll('.quick-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (tabButtons.length === 0 || tabPanels.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');

      // Toggle active classes on tab buttons
      tabButtons.forEach(b => b.classList.toggle('active', b === btn));

      // Toggle active classes on content panels
      tabPanels.forEach(panel => {
        const panelId = panel.getAttribute('id');
        panel.classList.toggle('active', panelId === targetId);
      });
    });
  });
}

/* ============================================================
   19. HERO CAROUSEL SLIDER
   ============================================================ */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.hero-slider-dot');
  const prevBtn = slider.querySelector('.hero-slider-prev');
  const nextBtn = slider.querySelector('.hero-slider-next');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  const intervalTime = 5000; // 5 seconds autoplay

  const goTo = (idx) => {
    current = (idx + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAutoplay = () => {
    stopAutoplay();
    timer = setInterval(next, intervalTime);
  };

  const stopAutoplay = () => {
    if (timer) clearInterval(timer);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prev();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      next();
      startAutoplay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(i);
      startAutoplay();
    });
  });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  let startX = 0;
  slider.addEventListener('touchstart', e => { 
    startX = e.touches[0].clientX; 
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
      startAutoplay();
    }
  });

  startAutoplay();
}

/* ============================================================
   22. NOTIFICATIONS MODAL
   ============================================================ */
function initNotificationsModal() {
  // 1. Dynamically inject the trigger button into .nav-actions of the header
  const navActions = document.querySelector('.nav-actions');
  if (navActions && !navActions.querySelector('.notification-trigger')) {
    const hamburger = navActions.querySelector('.hamburger');
    const notifBtn = document.createElement('button');
    notifBtn.className = 'nav-icon-btn notification-trigger';
    notifBtn.id = 'notification-trigger';
    notifBtn.setAttribute('aria-label', 'Notifications');
    notifBtn.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span class="notification-badge-dot"></span>
    `;
    if (hamburger) {
      navActions.insertBefore(notifBtn, hamburger);
    } else {
      navActions.appendChild(notifBtn);
    }
  }

  // 2. Dynamically inject the notifications modal into the body if not present
  let modal = document.getElementById('notifications-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'notifications-modal';
    modal.className = 'notifications-modal-overlay';
    modal.innerHTML = `
      <div class="notifications-modal-card">
        <div class="notifications-modal-header">
          <div class="notifications-modal-title-group">
            <svg class="icon notifications-modal-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <h3>
              <span data-lang="mr">महत्वाचे अपडेट्स आणि सूचना</span>
              <span data-lang="en">Latest Updates & Notices</span>
            </h3>
          </div>
          <button class="notifications-modal-close" aria-label="Close Modal">&times;</button>
        </div>
        <div class="notifications-modal-body">
          <!-- Notification Item 1 -->
          <div class="notification-detail-item">
            <div class="notification-meta">
              <span class="notification-badge"><span data-lang="mr">नवीन</span><span data-lang="en">New</span></span>
              <span class="notification-date">July 13, 2026</span>
            </div>
            <h4 class="notification-title">
              <span data-lang="mr">मुदत ठेव योजना आकर्षक व्याजदर</span>
              <span data-lang="en">Fixed Deposit Scheme Attractive Interest Rates</span>
            </h4>
            <p class="notification-desc">
              <span data-lang="mr">एन. डी. चौगुले नागरी पतसंस्थेत आपल्या ठेवींवर ९.५% पर्यंत व्याज मिळवा! आजच गुंतवणूक करा आणि सुरक्षित परतावा मिळवा.</span>
              <span data-lang="en">Get up to 9.5% interest on your Fixed Deposits at N.D. Chougale Credit Society! Invest today for secure and guaranteed returns.</span>
            </p>
            <a href="deposits.html" class="notification-link">
              <span data-lang="mr">अधिक वाचा</span><span data-lang="en">Read More</span> &rarr;
            </a>
          </div>
          <!-- Notification Item 2 -->
          <div class="notification-detail-item">
            <div class="notification-meta">
              <span class="notification-badge"><span data-lang="mr">नवीन</span><span data-lang="en">New</span></span>
              <span class="notification-date">July 10, 2026</span>
            </div>
            <h4 class="notification-title">
              <span data-lang="mr">सुरक्षित इंटरनेट बँकिंग आणि ऑनलाइन खाते</span>
              <span data-lang="en">Secure Internet Banking & Online Account Opening</span>
            </h4>
            <p class="notification-desc">
              <span data-lang="mr">नवीन सुरक्षा वैशिष्ट्यांसह इंटरनेट बँकिंग सेवा आता थेट उपलब्ध आहे. आपण घरबसल्या खाते उघडू शकता आणि व्यवहार व्यवस्थापित करू शकता.</span>
              <span data-lang="en">Our new secure Internet Banking features and Online Account Opening forms are now live. Manage your account from the comfort of your home.</span>
            </p>
            <a href="services.html#internet-banking" class="notification-link">
              <span data-lang="mr">अधिक वाचा</span><span data-lang="en">Read More</span> &rarr;
            </a>
          </div>
          <!-- Notification Item 3 -->
          <div class="notification-detail-item">
            <div class="notification-meta">
              <span class="notification-date">July 05, 2026</span>
            </div>
            <h4 class="notification-title">
              <span data-lang="mr">सुवर्ण कर्ज व्याजदर सवलत</span>
              <span data-lang="en">Gold Loan Interest Rate Discount</span>
            </h4>
            <p class="notification-desc">
              <span data-lang="mr">चौगुले पतसंस्थेमध्ये सोन्यावर सर्वात जलद कर्ज मिळवा. कमीत कमी कागदपत्रे आणि सवलतीच्या व्याजदरात त्वरित मंजुरी.</span>
              <span data-lang="en">Avail gold loans at the lowest interest rates with fast processing and minimal paperwork. Quick approvals and hassle-free disbursements.</span>
            </p>
            <a href="gold-loan.html" class="notification-link">
              <span data-lang="mr">अधिक वाचा</span><span data-lang="en">Read More</span> &rarr;
            </a>
          </div>
          <!-- Notification Item 4 -->
          <div class="notification-detail-item">
            <div class="notification-meta">
              <span class="notification-date">June 28, 2026</span>
            </div>
            <h4 class="notification-title">
              <span data-lang="mr">२०२५-२६ वार्षिक ऑडिट अहवाल प्रसिद्ध</span>
              <span data-lang="en">2025-26 Annual Audit Report Released</span>
            </h4>
            <p class="notification-desc">
              <span data-lang="mr">एन. डी. चौगुले पतसंस्थेचे आर्थिक वर्ष २०२५-२६ चे अधिकृत वित्तीय अहवाल आणि वार्षिक लेखापरीक्षण अहवाल प्रसिद्ध झाले आहेत.</span>
              <span data-lang="en">The official financial statements and annual audit reports for the fiscal year 2025-26 are now available for download.</span>
            </p>
            <a href="downloads.html" class="notification-link">
              <span data-lang="mr">अधिक वाचा</span><span data-lang="en">Read More</span> &rarr;
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // 3. Set up triggers
  const tickerLabelTrigger = document.querySelector('.ticker-label');
  const headerTrigger = document.querySelector('.notification-trigger');
  const closeEl = modal.querySelector('.notifications-modal-close');
  const badgeDot = headerTrigger ? headerTrigger.querySelector('.notification-badge-dot') : null;

  // Manage Badge Read/Unread State
  if (badgeDot && localStorage.getItem('notifications_read') === 'true') {
    badgeDot.style.display = 'none';
  }

  const open = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Hide badge and mark as read
    if (badgeDot) {
      badgeDot.style.display = 'none';
      localStorage.setItem('notifications_read', 'true');
    }
  };

  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (tickerLabelTrigger) {
    tickerLabelTrigger.style.cursor = 'pointer';
    tickerLabelTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  }

  if (headerTrigger) {
    headerTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  }

  if (closeEl) {
    closeEl.addEventListener('click', close);
  }

  // Close when clicking overlay background
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      close();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      close();
    }
  });
}
