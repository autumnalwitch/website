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
  
  
  // ====== Wave and Resume Page Animations ======
  const waveCanvas = document.getElementById('waveCanvas');
  const ctx = waveCanvas.getContext('2d');
  const container = document.getElementById('container');
  const content = document.getElementById('content');
  const contentText = document.getElementById('contentText');
  const backBtn = document.getElementById('backBtn');
  const sides = document.querySelectorAll('.side');
  
  const footerHeight = 70;
  let width, height;
  let baseY;
  let smallAmp;
  let largeAmp;
  let phase = 0;
  let animating = true;
  let deltaSide = null;
  let state = "wave"; 
  
  let deltaOpacity = 0;
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
  
    waveCanvas.width = width * devicePixelRatio;
    waveCanvas.height = height * devicePixelRatio;
    waveCanvas.style.width = width + 'px';
    waveCanvas.style.height = height + 'px';
  
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);
  
    baseY = (height - footerHeight) * 0.55;
    smallAmp = (height - footerHeight) * 0.15;
    largeAmp = (height - footerHeight) * 0.4;
  
    container.style.height = (height - footerHeight) + 'px';
  }
  
  function generateWavePoints() {
    const points = [];
    const step = 5;
    for(let x = 0; x <= width; x += step){
      let y = baseY;
      y -= smallAmp * Math.sin((x / width) * Math.PI * 4 + phase);
      y -= 0.5 * smallAmp * Math.sin((x / width) * Math.PI * 8 + phase * 1.5);
      y -= largeAmp * 0.6 * Math.sin((x / width) * Math.PI * 2 + phase / 2);
      points.push({x, y});
    }
    return points;
  }
  
  function drawWave(points) {
    ctx.clearRect(0, 0, width, height);
  
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(204, 85, 0, 0.8)`;
    ctx.shadowColor = 'rgba(204, 85, 0, 0.6)';
    ctx.shadowBlur = 50;
    ctx.beginPath();
  
    points.forEach((p, i) => {
      if(i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
  
    ctx.stroke();
  
    ctx.shadowBlur = 0;
  }
  
  function drawDelta(side, opacity) {
    if(opacity <= 0) return;
  
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(204, 85, 0, ${opacity})`;
    ctx.shadowColor = `rgba(204, 85, 0, ${opacity * 0.8})`;
    ctx.shadowBlur = 25;
  
    const base = baseY*1.9;
    const spikeHeight = largeAmp * 2.0;
  
    // Adjust peak position closer to center of side
    const centerX = side === 'left' ? width * 0.3 : width * 0.7;
    const spikeWidth = 60;
    const leftX = centerX - spikeWidth / 2;
    const rightX = centerX + spikeWidth / 2;
  
    ctx.beginPath();
  
    // Left flat line (across whole canvas left to leftX)
    ctx.moveTo(0, base);
    ctx.lineTo(leftX, base);
  
    // Up curve (Bezier)
    ctx.bezierCurveTo(
      leftX + spikeWidth * 0.25, base,
      centerX - spikeWidth * 0.15, base - spikeHeight,
      centerX, base - spikeHeight
    );
  
    // Down curve (Bezier)
    ctx.bezierCurveTo(
      centerX + spikeWidth * 0.15, base - spikeHeight,
      rightX - spikeWidth * 0.25, base,
      rightX, base
    );
  
    // Right flat line (rightX to canvas width)
    ctx.lineTo(width, base);
  
    ctx.stroke();
  
    ctx.shadowBlur = 0;
  }
  
  function fadeOut(element, duration = 1500) {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = 0;
      setTimeout(() => resolve(), duration);
    });
  }
  
  function fadeIn(element, duration = 2000) {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = 1;
      setTimeout(() => resolve(), duration);
    });
  }
  

// ...keep all previous declarations and functions

async function animate() {
  if(state === "wave" && !animating) return;

  phase += 0.05;

  if(state === "wave" || state === "back"){
    const points = generateWavePoints();
    drawWave(points);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  if(state === "toDelta") {
    deltaOpacity += 0.02;
    if(deltaOpacity >= 1){
      deltaOpacity = 1;
      state = "toContent";
      
      // Instead of display none, just fade out sides opacity smoothly
      // But actual fadeOut was triggered in showContent already

      content.style.display = 'flex';
      content.style.opacity = 0;
      setTimeout(() => {
        content.style.transition = 'opacity 2500ms ease';
        content.style.opacity = 1;
      }, 100);
    }
    drawDelta(deltaSide, deltaOpacity);

  } else if(state === "toContent") {
    // Slowly fade delta out after content shown
    deltaOpacity -= 0.01;
    if(deltaOpacity <= 0){
      deltaOpacity = 0;
    } else {
      drawDelta(deltaSide, deltaOpacity);
    }

  } else if(state === "back") {
    // Fade delta out and wave back in
    deltaOpacity -= 0.02;
    if(deltaOpacity <= 0){
      deltaOpacity = 0;
      deltaSide = null;
      animating = true;
      state = "wave";

      content.style.display = 'none';
      content.style.opacity = 0;

      // Instead of toggling display on sides, just fade their opacity back in
      sides.forEach(s => {
        fadeIn(s, 2000);
      });
    } else {
      drawDelta(deltaSide, deltaOpacity);
    }
  }

  requestAnimationFrame(animate);
}

async function showContent(side) {
  if(state !== "wave") return;

  animating = false;
  deltaSide = side;
  state = "toDelta";

  // Fade out main sides AND their blur pseudo-element
  sides.forEach(sideEl => {
    sideEl.style.transition = 'opacity 1500ms ease';
    sideEl.style.opacity = 0;
    sideEl.classList.add('blur-hidden');  // completely hide ::before blur
  });

  content.style.display = 'none'; // content shown later in animate()
  content.style.opacity = 0;
  backBtn.style.display = 'inline-block';

  if (side === 'left') {
    contentText.innerHTML = `<h2>Resume</h2><p>Your resume content here.</p>`;
  } else {
    contentText.innerHTML = `<h2>Skills</h2><ul><li>Quantum Mechanics</li><li>Data Science</li><li>Frontend Dev</li></ul>`;
  }
}

async function reset() {
  if(state !== "toContent" && state !== "wave") return;

  state = "back";

  content.style.transition = 'opacity 1500ms ease';
  content.style.opacity = 0;

  backBtn.style.display = 'none';
  contentText.innerHTML = '';

  setTimeout(() => {
    sides.forEach(sideEl => {
      sideEl.style.transition = 'opacity 2000ms ease';
      sideEl.style.opacity = 1;
      sideEl.classList.remove('blur-hidden');  // show ::before blur again
    });
  }, 1200);
}



  
  container.addEventListener('click', (e) => {
    if(e.target.classList.contains('side') && state === "wave") {
      showContent(e.target.dataset.side);
    }
  });
  
  backBtn.addEventListener('click', () => {
    reset();
  });
  
  window.addEventListener('resize', resize);
  
  resize();
  reset();
  animate();
  