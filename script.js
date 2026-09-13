(function(){
  var slide2Fix = document.createElement('link');
  slide2Fix.rel = 'stylesheet';
  slide2Fix.href = 'slide2-fix.css?v=' + Date.now();
  document.head.appendChild(slide2Fix);

  var slide2VisualStyles = document.createElement('style');
  slide2VisualStyles.textContent = `
    /* Slide 2: unified percentage + integrated treatment-cost visual */
    #s2 .stat-hero .unit{display:none!important;}
    #s2 .stat-hero .num.stat-percent{
      white-space:nowrap!important;
      font-family:var(--serif)!important;
      font-size:clamp(5.8rem,11.4vw,9.6rem)!important;
      font-weight:600!important;
      line-height:.86!important;
      letter-spacing:-.045em!important;
      font-variant-numeric:tabular-nums;
    }

    #s2 .cost-rise{
      position:absolute;
      right:clamp(5.5rem,7.2vw,8rem);
      top:50%;
      width:min(33vw,510px);
      transform:translateY(-44%);
      z-index:3;
      pointer-events:none;
    }
    #s2 .cost-rise-kicker{
      margin:0 0 clamp(.7rem,1.1vw,1rem) 0;
      font-family:var(--sans);
      font-size:clamp(.72rem,.86vw,.88rem);
      font-weight:700;
      line-height:1.15;
      letter-spacing:.15em;
      text-transform:uppercase;
      color:var(--scarlet);
      opacity:0;
      transform:translateY(10px);
    }
    #s2 .cost-rise-stage{
      position:relative;
      height:clamp(285px,41vh,410px);
      width:100%;
    }
    #s2 .cost-rise-svg{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      overflow:visible;
    }
    #s2 .cost-rise-line{
      fill:none;
      stroke:var(--scarlet);
      stroke-width:7;
      stroke-linecap:round;
      stroke-dasharray:520;
      stroke-dashoffset:520;
      filter:drop-shadow(0 0 8px rgba(200,16,46,.22));
    }
    #s2 .cost-rise-head{
      fill:var(--scarlet);
      opacity:0;
      transform-box:fill-box;
      transform-origin:center;
      transform:scale(.7);
      filter:drop-shadow(0 0 8px rgba(200,16,46,.18));
    }
    #s2 .cost-rise-value{
      position:absolute;
      right:0;
      top:clamp(.2rem,1vh,.7rem);
      font-family:var(--serif);
      font-size:clamp(3.1rem,5.2vw,5.25rem);
      font-weight:600;
      line-height:.88;
      letter-spacing:-.055em;
      color:var(--white);
      white-space:nowrap;
      opacity:0;
      transform:translateY(12px);
      font-variant-numeric:tabular-nums;
    }
    #s2 .cost-rise-caption{
      position:absolute;
      right:.15rem;
      top:clamp(4.5rem,8.8vh,6.3rem);
      width:min(13.5rem,52%);
      font-family:var(--sans);
      font-size:clamp(.76rem,.95vw,.94rem);
      font-weight:500;
      line-height:1.4;
      text-align:right;
      color:var(--stone-500);
      opacity:0;
      transform:translateY(8px);
    }
    #s2.active .cost-rise-kicker{
      animation:costMetaIn 520ms cubic-bezier(.2,.8,.2,1) 310ms forwards;
    }
    #s2.active .cost-rise-line{
      animation:costArrowDraw 1350ms cubic-bezier(.16,1,.3,1) 430ms forwards;
    }
    #s2.active .cost-rise-head{
      animation:costArrowHead 420ms cubic-bezier(.16,1,.3,1) 1510ms forwards;
    }
    #s2.active .cost-rise-value{
      animation:costMetaIn 520ms cubic-bezier(.2,.8,.2,1) 520ms forwards;
    }
    #s2.active .cost-rise-caption{
      animation:costMetaIn 520ms cubic-bezier(.2,.8,.2,1) 720ms forwards;
    }
    @keyframes costArrowDraw{to{stroke-dashoffset:0;}}
    @keyframes costArrowHead{to{opacity:1;transform:scale(1);}}
    @keyframes costMetaIn{to{opacity:1;transform:translateY(0);}}

    @media (max-width:1100px){
      #s2 .cost-rise{right:4.5rem;width:min(34vw,455px);}
    }
    @media (max-width:900px){
      #s2{overflow-y:auto!important;}
      #s2 .cost-rise{
        position:relative;
        right:auto;
        top:auto;
        width:88vw;
        transform:none;
        margin-top:2.6rem;
        padding-bottom:3.5rem;
      }
      #s2 .cost-rise-stage{height:300px;}
    }
  `;
  document.head.appendChild(slide2VisualStyles);

  var s2 = document.getElementById('s2');
  if(s2){
    var eyebrow = s2.querySelector('.eyebrow');
    var definition = s2.querySelector('h2.display');
    var firstStat = s2.querySelector('.chip-row .chip:first-child .chip-num');
    var cite = s2.querySelector('.cite');
    var heroNum = s2.querySelector('.stat-hero .num');
    var heroUnit = s2.querySelector('.stat-hero .unit');

    if(eyebrow) eyebrow.textContent = 'What is Glioblastoma Multiforme';
    if(definition) definition.textContent = 'Most aggressive form of brain cancer with no known cause or cure';

    if(firstStat){
      firstStat.removeAttribute('data-count');
      firstStat.removeAttribute('data-format');
      firstStat.textContent = '108,810';
    }

    if(heroNum){
      heroNum.classList.add('stat-percent');
      heroNum.textContent = '0%';
    }
    if(heroUnit) heroUnit.textContent = '';

    if(cite) cite.textContent = '';

    s2.querySelectorAll('.s2-visual').forEach(function(el){ el.remove(); });
    s2.querySelectorAll('.treatment-burden').forEach(function(el){ el.remove(); });
    s2.querySelectorAll('.cost-rise').forEach(function(el){ el.remove(); });

    var costRise = document.createElement('div');
    costRise.className = 'cost-rise';
    costRise.setAttribute('aria-label', 'Treatment burden: first-year direct medical costs can exceed 200 thousand dollars');
    costRise.innerHTML =
      '<div class="cost-rise-kicker">Treatment Burden</div>' +
      '<div class="cost-rise-stage">' +
        '<svg class="cost-rise-svg" viewBox="0 0 500 330" aria-hidden="true">' +
          '<path class="cost-rise-line" d="M38 292 L408 86"></path>' +
          '<polygon class="cost-rise-head" points="414,82 379,90 395,116"></polygon>' +
        '</svg>' +
        '<div class="cost-rise-value" data-cost-target="200">$0K+</div>' +
        '<div class="cost-rise-caption">first-year direct medical costs</div>' +
      '</div>';
    s2.appendChild(costRise);
  }
})();

(function(){
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var deck = document.getElementById('deck');
  var dotsWrap = document.getElementById('dots');
  var counter = document.getElementById('counter');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var current = 0;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach(function(s, i){
    var d = document.createElement('button');
    d.className = 'dot' + (i===0 ? ' on' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i+1));
    d.addEventListener('click', function(){ goTo(i); });
    dotsWrap.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.dot'));

  function pad(n){ return n < 10 ? '0'+n : ''+n; }

  function goTo(i){
    if(i < 0 || i >= slides.length || i === current) { updateButtons(); return; }
    current = i;
    deck.style.transform = 'translateY(-' + (i*100) + 'vh)';
    slides.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
    dots.forEach(function(d, idx){ d.classList.toggle('on', idx === i); });
    counter.textContent = pad(i+1) + ' / ' + pad(slides.length);
    document.getElementById('bg-canvas').classList.toggle('show', slides[i].classList.contains('dark'));
    updateButtons();
    if(i === 1){
      runCounters();
      runCostRise();
    }
  }
  function updateButtons(){
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }
  function next(){ goTo(current+1); }
  function prev(){ goTo(current-1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  window.addEventListener('keydown', function(e){
    if(['ArrowDown','ArrowRight','PageDown',' '].indexOf(e.key) > -1){ e.preventDefault(); next(); }
    else if(['ArrowUp','ArrowLeft','PageUp'].indexOf(e.key) > -1){ e.preventDefault(); prev(); }
    else if(e.key === 'Home'){ goTo(0); }
    else if(e.key === 'End'){ goTo(slides.length-1); }
  });

  var wheelLock = false;
  window.addEventListener('wheel', function(e){
    if(wheelLock) return;
    if(Math.abs(e.deltaY) < 18) return;
    wheelLock = true;
    if(e.deltaY > 0) next(); else prev();
    setTimeout(function(){ wheelLock = false; }, 750);
  }, { passive:true });

  var touchStartY = null;
  window.addEventListener('touchstart', function(e){ touchStartY = e.touches[0].clientY; }, {passive:true});
  window.addEventListener('touchend', function(e){
    if(touchStartY === null) return;
    var dy = touchStartY - e.changedTouches[0].clientY;
    if(Math.abs(dy) > 50){ dy > 0 ? next() : prev(); }
    touchStartY = null;
  }, {passive:true});

  document.getElementById('fs-btn').addEventListener('click', function(){
    if(!document.fullscreenElement){ document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); }
    else{ document.exitFullscreen && document.exitFullscreen(); }
  });

  document.querySelectorAll('.committee-card').forEach(function(c){
    c.addEventListener('click', function(){ c.classList.toggle('flipped'); });
  });

  function runCounters(){
    var el = document.querySelector('#s2 .stat-hero [data-count]');
    if(!el) return;
    var target = parseInt(el.getAttribute('data-count'), 10);
    if(reduced){ el.textContent = target + '%'; return; }
    el.textContent = '0%';
    var start = null;
    var dur = 1400;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(target * eased) + '%';
      if(p < 1 && slides[1].classList.contains('active')) requestAnimationFrame(step);
    }
    setTimeout(function(){
      if(slides[1].classList.contains('active')) requestAnimationFrame(step);
    }, 420);
  }

  function runCostRise(){
    var el = document.querySelector('#s2 .cost-rise-value[data-cost-target]');
    if(!el) return;
    var target = parseInt(el.getAttribute('data-cost-target'), 10);
    if(reduced){ el.textContent = '$' + target + 'K+'; return; }
    el.textContent = '$0K+';
    var start = null;
    var dur = 1350;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = '$' + Math.round(target * eased) + 'K+';
      if(p < 1 && slides[1].classList.contains('active')) requestAnimationFrame(step);
    }
    setTimeout(function(){
      if(slides[1].classList.contains('active')) requestAnimationFrame(step);
    }, 500);
  }

  var sealDrawn = false;
  var origGoTo = goTo;
  goTo = function(i){
    origGoTo(i);
    if(slides[i].id === 's3' && !sealDrawn){
      sealDrawn = true;
      var outer = document.getElementById('seal-ring-outer');
      var inner = document.getElementById('seal-ring-inner');
      setTimeout(function(){ outer.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(.2,.8,.2,1)'; outer.style.strokeDashoffset = '0'; }, 250);
      setTimeout(function(){ inner.style.transition = 'stroke-dashoffset 900ms cubic-bezier(.2,.8,.2,1)'; inner.style.strokeDashoffset = '0'; }, 550);
    }
  };

  try{
    var qr = qrcode(4, 'M');
    qr.addData('https://rutgersg4g.org/committee-application');
    qr.make();
    document.getElementById('qr-target').innerHTML = qr.createSvgTag({cellSize:5, margin:2});
  }catch(err){}

  var canvas = document.getElementById('bg-canvas');
  var ctx = canvas.getContext('2d');
  var W, H, points = [];
  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  var N = Math.min(46, Math.floor((window.innerWidth*window.innerHeight)/34000));
  for(var i=0;i<N;i++){
    points.push({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*0.12, vy:(Math.random()-.5)*0.12 });
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<points.length;i++){
      var p = points[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > W) p.vx *= -1;
      if(p.y < 0 || p.y > H) p.vy *= -1;
    }
    for(var i=0;i<points.length;i++){
      for(var j=i+1;j<points.length;j++){
        var dx = points[i].x - points[j].x, dy = points[i].y - points[j].y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 160){
          ctx.strokeStyle = 'rgba(150,148,145,' + (0.14 * (1 - dist/160)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y); ctx.stroke();
        }
      }
    }
    ctx.fillStyle = 'rgba(200,16,46,0.55)';
    for(var i=0;i<points.length;i++){
      ctx.beginPath(); ctx.arc(points[i].x, points[i].y, 1.4, 0, Math.PI*2); ctx.fill();
    }
    if(!reduced) requestAnimationFrame(draw);
  }
  draw();

  slides[0].classList.add('active');
  canvas.classList.add('show');
  updateButtons();
})();
