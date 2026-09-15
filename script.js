(function(){
  var slide2Fix = document.createElement('link');
  slide2Fix.rel = 'stylesheet';
  slide2Fix.href = 'slide2-fix.css?v=' + Date.now();
  document.head.appendChild(slide2Fix);

  var slide2VisualStyles = document.createElement('style');
  slide2VisualStyles.textContent = `
    /* Slide 2: unified percentage + integrated total treatment-cost visual */
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
      right:clamp(5rem,6.5vw,8rem);
      top:calc(52% + 48px);
      width:min(39vw,650px);
      transform:translateY(-42%);
      z-index:3;
      pointer-events:none;
      opacity:0;
      transition:opacity 700ms cubic-bezier(.2,.8,.2,1);
      will-change:opacity;
    }
    #s2.active .cost-rise{opacity:1;}
    #s2 .cost-rise-stage{
      position:relative;
      height:clamp(345px,49vh,485px);
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
      filter:drop-shadow(0 0 9px rgba(200,16,46,.2));
    }
    #s2 .cost-rise-head{
      fill:var(--scarlet);
      stroke:var(--scarlet);
      stroke-width:1;
      stroke-linejoin:round;
      shape-rendering:geometricPrecision;
      filter:drop-shadow(0 0 8px rgba(200,16,46,.18));
    }
    #s2 .cost-rise-value-text{
      font-family:var(--serif);
      font-size:clamp(42px,4.35vw,66px);
      font-weight:600;
      letter-spacing:-.055em;
      fill:var(--white);
      font-variant-numeric:tabular-nums;
    }
    #s2 .cost-rise-caption-text{
      font-family:var(--sans);
      font-size:14px;
      font-weight:500;
      letter-spacing:.01em;
      fill:var(--stone-500);
    }

    @media (max-width:1100px){
      #s2 .cost-rise{right:4.5rem;width:min(38vw,550px);}
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
      #s2 .cost-rise-stage{height:330px;}
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
    costRise.setAttribute('aria-label', 'Estimated total treatment cost can exceed 300 thousand dollars');
    costRise.innerHTML =
      '<div class="cost-rise-stage">' +
        '<svg class="cost-rise-svg" viewBox="0 0 640 420" aria-hidden="true">' +
          '<path class="cost-rise-line" d="M58 366 L578 42"></path>' +
          '<g class="cost-rise-head-wrap" opacity="0">' +
            '<path class="cost-rise-head" d="M58 366 L58 366 L58 366 Z"></path>' +
          '</g>' +
          '<g class="cost-rise-value-wrap" opacity="0">' +
            '<text class="cost-rise-value-text" x="-18" y="-24" text-anchor="end">$0k</text>' +
          '</g>' +
          '<text class="cost-rise-caption-text" x="58" y="392" text-anchor="middle">estimated total cost of treatment</text>' +
        '</svg>' +
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
  var pillarStep = -1;
  var s4TypeRun = 0;
  var s4ResetTimer = null;
  var pillarTransitioning = false;
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
    if(current === 3 && i !== 3){
      var s4Leaving = document.getElementById('s4');
      if(s4Leaving){
        s4Leaving.classList.add('is-exiting');
        var oldTagline = s4Leaving.querySelector('.s4-tagline');
        if(oldTagline) oldTagline.classList.remove('is-typing');
      }
      s4TypeRun++;
      pillarStep = -1;
      clearTimeout(s4ResetTimer);
      s4ResetTimer = setTimeout(function(){
        if(current !== 3 && s4Leaving){
          s4Leaving.classList.remove('pillars-on','core-out','team-on');
          s4Leaving.classList.remove('is-exiting');
          pillarTransitioning = false;
        }
      },950);
    }
    if(i === 3){
      clearTimeout(s4ResetTimer);
      var s4Entering = document.getElementById('s4');
      if(s4Entering){
        s4Entering.classList.remove('pillars-on','core-out','team-on');
        s4Entering.classList.remove('is-exiting');
        pillarTransitioning = false;
      }
      pillarStep = -1;
    }
    current = i;
    deck.style.transform = 'translateY(-' + (i*100) + 'vh)';
    slides.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
    dots.forEach(function(d, idx){ d.classList.toggle('on', idx === i); });
    counter.textContent = pad(i+1) + ' / ' + pad(slides.length);
    document.getElementById('bg-canvas').classList.toggle('show', slides[i].classList.contains('dark'));
    updateButtons();
    if(i === 3){
      runSlide4Typing();
    }
    if(i === 4){
      runSpringTotal();
    }
    if(i === 1){
      runCounters();
      runCostRise();
    }
    if(i === 2){
      runGfgImpact();
    }
  }
  function updateButtons(){
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }
  function runSpringTotal(){
    var el = document.querySelector('#spring-snapshot [data-spring-total]');
    if(!el) return;
    var target = parseInt(el.getAttribute('data-spring-total'),10) || 500;

    if(reduced){
      el.textContent = target;
      return;
    }

    el.textContent = '0';
    var startTime = null;
    var duration = 2300;

    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration,1);
      var eased = 1 - Math.pow(1 - progress,4);
      el.textContent = Math.round(target * eased);
      if(progress < 1 && slides[4].classList.contains('active')){
        requestAnimationFrame(step);
      }else if(progress >= 1){
        el.textContent = target;
      }
    }

    setTimeout(function(){
      if(slides[4].classList.contains('active')) requestAnimationFrame(step);
    },650);
  }

  function runSlide4Typing(){
    var line = document.querySelector('#s4 .s4-tagline');
    if(!line) return;
    var fullText = line.getAttribute('data-type-text') || '';
    var runId = ++s4TypeRun;
    line.textContent = '';
    line.classList.remove('is-typing');

    if(reduced){
      line.textContent = fullText;
      return;
    }

    setTimeout(function(){
      if(runId !== s4TypeRun || current !== 3) return;
      line.classList.add('is-typing');
      var index = 0;
      function typeNext(){
        if(runId !== s4TypeRun || current !== 3) return;
        index++;
        line.textContent = fullText.slice(0,index);
        if(index < fullText.length){
          setTimeout(typeNext,42);
        }else{
          line.classList.remove('is-typing');
        }
      }
      typeNext();
    },700);
  }

  function setPillarCenter(items, center){
    items.forEach(function(item){
      item.classList.toggle('is-center', parseInt(item.getAttribute('data-pillar'),10) === center);
    });
  }

  function updatePillarCarousel(step){
    var s4 = document.getElementById('s4');
    if(!s4) return false;
    var coreItems = Array.prototype.slice.call(s4.querySelectorAll('.s4-core-pillars .s4-pillar'));
    var teamItems = Array.prototype.slice.call(s4.querySelectorAll('.s4-team-pillars .s4-pillar'));
    if(coreItems.length !== 3 || teamItems.length !== 3) return false;

    pillarStep = step;
    if(step < 0){
      s4.classList.remove('pillars-on','core-out','team-on');
      setPillarCenter(coreItems,0);
      setPillarCenter(teamItems,0);
      pillarTransitioning = false;
      return true;
    }

    s4.classList.add('pillars-on');

    if(step <= 2){
      setPillarCenter(coreItems,step);
      if(s4.classList.contains('team-on')){
        pillarTransitioning = true;
        s4.classList.add('core-out');
        s4.classList.remove('team-on');
        setTimeout(function(){
          if(current === 3 && pillarStep <= 2){
            s4.classList.remove('core-out');
            pillarTransitioning = false;
          }
        },520);
      }else{
        s4.classList.remove('core-out');
      }
      return true;
    }

    setPillarCenter(teamItems,step - 3);
    if(!s4.classList.contains('team-on')){
      pillarTransitioning = true;
      s4.classList.add('core-out');
      setTimeout(function(){
        if(current === 3 && pillarStep >= 3){
          s4.classList.add('team-on');
          s4.classList.remove('core-out');
          pillarTransitioning = false;
        }
      },520);
    }
    return true;
  }

  function next(){
    if(current === 3){
      if(pillarTransitioning) return;
      if(pillarStep < 0){ updatePillarCarousel(0); return; }
      if(pillarStep < 5){ updatePillarCarousel(pillarStep + 1); return; }
    }
    goTo(current+1);
  }
  function prev(){
    if(current === 3 && pillarStep >= 0){
      if(pillarTransitioning) return;
      if(pillarStep > 0){ updatePillarCarousel(pillarStep - 1); return; }
      updatePillarCarousel(-1); return;
    }
    goTo(current-1);
  }

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

  function runGfgImpact(){
    var el = document.querySelector('#s3 [data-impact-count]');
    var stage = document.querySelector('#s3 .s3-bar-stage');
    var bar = document.querySelector('#s3 .s3-bar-fill');
    var valueWrap = document.querySelector('#s3 .s3-bar-value-wrap');
    if(!el || !stage || !bar || !valueWrap) return;

    var target = parseInt(el.getAttribute('data-impact-count'), 10);
    var stageHeight = stage.getBoundingClientRect().height;
    var maxHeight = Math.round(stageHeight * 0.58);
    var base = parseFloat(window.getComputedStyle(bar).bottom) || 32;
    var valueGap = 14;

    function render(progress){
      var height = maxHeight * progress;
      bar.style.height = height.toFixed(2) + 'px';
      valueWrap.style.bottom = (base + height + valueGap).toFixed(2) + 'px';
      el.textContent = Math.round(target * progress);
    }

    if(reduced){
      render(1);
      return;
    }

    render(0);
    var startTime = null;
    var duration = 3000;

    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = progress * progress * (3 - 2 * progress);
      render(eased);

      if(progress < 1 && slides[2].classList.contains('active')){
        requestAnimationFrame(step);
      }else if(progress >= 1){
        render(1);
      }
    }

    setTimeout(function(){
      if(slides[2].classList.contains('active')) requestAnimationFrame(step);
    }, 420);
  }

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
    var path = document.querySelector('#s2 .cost-rise-line');
    var head = document.querySelector('#s2 .cost-rise-head-wrap');
    var headShape = document.querySelector('#s2 .cost-rise-head');
    var valueWrap = document.querySelector('#s2 .cost-rise-value-wrap');
    var valueText = document.querySelector('#s2 .cost-rise-value-text');
    if(!path || !head || !headShape || !valueWrap || !valueText) return;

    var target = 300;
    var length = path.getTotalLength();
    var fullHeadLength = 30;
    var fullHeadHalfWidth = 16;
    var shaftOverlap = 3;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    head.setAttribute('opacity', '0');
    valueWrap.setAttribute('opacity', '0');
    valueText.textContent = '$0k';

    function placeAt(progress){
      var distance = Math.max(0, Math.min(length, length * progress));
      var point = path.getPointAtLength(distance);
      var delta = Math.min(2.5, length);
      var beforeDistance;
      var afterDistance;

      if(distance <= delta){
        beforeDistance = distance;
        afterDistance = Math.min(length, distance + delta);
      }else if(distance >= length - delta){
        beforeDistance = Math.max(0, distance - delta);
        afterDistance = distance;
      }else{
        beforeDistance = distance - delta;
        afterDistance = distance + delta;
      }

      var before = path.getPointAtLength(beforeDistance);
      var after = path.getPointAtLength(afterDistance);
      var dx = after.x - before.x;
      var dy = after.y - before.y;
      var tangentLength = Math.sqrt(dx * dx + dy * dy);

      if(tangentLength < 0.001){
        before = path.getPointAtLength(Math.max(0, distance - 1));
        after = path.getPointAtLength(Math.min(length, distance + 1));
        dx = after.x - before.x;
        dy = after.y - before.y;
        tangentLength = Math.sqrt(dx * dx + dy * dy) || 1;
      }

      var ux = dx / tangentLength;
      var uy = dy / tangentLength;
      var perpendicularX = -uy;
      var perpendicularY = ux;
      var headScale = Math.min(1, distance / fullHeadLength);
      var headLength = fullHeadLength * headScale;
      var halfWidth = fullHeadHalfWidth * headScale;
      var baseX = point.x - ux * headLength;
      var baseY = point.y - uy * headLength;
      var cornerAX = baseX + perpendicularX * halfWidth;
      var cornerAY = baseY + perpendicularY * halfWidth;
      var cornerBX = baseX - perpendicularX * halfWidth;
      var cornerBY = baseY - perpendicularY * halfWidth;

      /* Keep the tip as the literal first vertex at the revealed path endpoint.
         Building the head in path coordinates avoids a second transform whose
         endpoint rounding previously caused the final-frame rotation glitch. */
      headShape.setAttribute('d',
        'M' + point.x.toFixed(3) + ' ' + point.y.toFixed(3) +
        ' L' + cornerAX.toFixed(3) + ' ' + cornerAY.toFixed(3) +
        ' L' + cornerBX.toFixed(3) + ' ' + cornerBY.toFixed(3) + ' Z'
      );
      valueWrap.setAttribute('transform', 'translate(' + point.x + ' ' + point.y + ')');
      return distance - Math.max(0, headLength - shaftOverlap * headScale);
    }

    function revealAt(progress){
      var shaftEnd = placeAt(progress);
      path.style.strokeDashoffset = length - Math.max(0, shaftEnd);
    }

    if(reduced){
      revealAt(1);
      head.setAttribute('opacity', '1');
      valueWrap.setAttribute('opacity', '1');
      valueText.textContent = '$300k+';
      return;
    }

    revealAt(0);
    var start = null;
    var dur = 3500;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      var eased = p * p * (3 - 2 * p);

      revealAt(eased);

      if(p > .015){
        head.setAttribute('opacity', '1');
        valueWrap.setAttribute('opacity', '1');
      }

      var shown = Math.round(target * eased);
      valueText.textContent = '$' + shown + 'k' + (p >= .995 ? '+' : '');

      if(p < 1 && slides[1].classList.contains('active')) requestAnimationFrame(step);
      else if(p >= 1){
        revealAt(1);
        head.setAttribute('opacity', '1');
        valueWrap.setAttribute('opacity', '1');
        valueText.textContent = '$300k+';
      }
    }

    setTimeout(function(){
      if(slides[1].classList.contains('active')) requestAnimationFrame(step);
    }, 520);
  }

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