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
    const sidebar = document.querySelector('.resume-sidebar nav');
    if (!sidebar) return; // safely exit if sidebar not present
  
    const navItems = sidebar.querySelectorAll('li');
    const indicatorDot = sidebar.querySelector('.indicator-dot');
    const sections = document.querySelectorAll('.section-card');
  
    function updateActiveSection() {
      let index = sections.length - 1;
  
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.25) {
          index = i - 1;
          break;
        }
      }
      if (index < 0) index = 0;
  
      navItems.forEach(item => item.classList.remove('active'));
      navItems[index].classList.add('active');
  
      if (indicatorDot && navItems[index]) {
        indicatorDot.style.top = navItems[index].offsetTop + (navItems[index].offsetHeight / 2) - (indicatorDot.offsetHeight / 2) + 'px';
      }
  
      sections.forEach((section, i) => {
        if (i === index) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    }
  
    window.addEventListener('scroll', updateActiveSection);
    window.addEventListener('load', updateActiveSection);
  })();