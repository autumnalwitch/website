  // ====== PUBLICATION FILTERING ======
(() => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-item');
  
    function updateFilters() {
      const active = document.querySelector('.filter-btn.active');
      const filter = active ? active.getAttribute('data-filter') : 'all';
  
      publications.forEach(pub => {
        const type = pub.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          pub.style.display = 'block';
        } else {
          pub.style.display = 'none';
        }
      });
    }
  
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateFilters();
      });
    });
  
    updateFilters();
  })();
  
  
  // ====== RESUME SIDEBAR & SCROLL ANIMATIONS ======
  (() => {
    const sections = document.querySelectorAll('.section-card');
    const navItems = document.querySelectorAll('.resume-sidebar nav ul li');
    const indicatorDot = document.querySelector('.indicator-dot');
  
    let currentActive = -1;
  
    const observer = new IntersectionObserver((entries) => {
      let bestIndex = -1;
      let closestToCenter = Infinity;
  
      entries.forEach(entry => {
        const index = Array.from(sections).indexOf(entry.target);
  
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
  
          const rect = entry.boundingClientRect;
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);
  
          if (distance < closestToCenter) {
            closestToCenter = distance;
            bestIndex = index;
          }
        } else {
          entry.target.classList.remove('visible');
        }
      });
  
      if (bestIndex !== -1 && bestIndex !== currentActive) {
        currentActive = bestIndex;
  
        navItems.forEach(item => item.classList.remove('active'));
        navItems[bestIndex]?.classList.add('active');
  
        if (navItems[bestIndex]) {
          const activeItem = navItems[bestIndex];
          indicatorDot.style.top =
            activeItem.offsetTop +
            (activeItem.offsetHeight / 2) -
            (indicatorDot.offsetHeight / 2) + 'px';
        }
      }
    }, {
      threshold: [0.3, 0.6, 0.9] // multiple thresholds help trigger visibility consistently
    });
  
    sections.forEach(section => observer.observe(section));
  })();
  
  