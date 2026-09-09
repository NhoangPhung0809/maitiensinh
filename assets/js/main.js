(function(){
  var grid = document.getElementById('galleryGrid');
  var carousel = grid.closest('.carousel');
  var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
  var filterBtns = document.querySelectorAll('.gallery-filters button');
  var STEP = 308; /* item width 280 + gap 28 */

  function updateActiveItem(){
    var center = grid.scrollLeft + grid.clientWidth / 2;
    var closest = null, closestDist = Infinity;
    items.forEach(function(item){
      if(item.classList.contains('hidden')) return;
      var mid = item.offsetLeft + item.offsetWidth / 2;
      var dist = Math.abs(mid - center);
      if(dist < closestDist){ closestDist = dist; closest = item; }
    });
    items.forEach(function(item){ item.classList.toggle('active', item === closest); });
  }
  grid.addEventListener('scroll', function(){
    window.requestAnimationFrame(updateActiveItem);
  });

  var AUTOPLAY_MS = 3600;
  var autoplayTimer = null;
  function stepNext(){
    var atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
    if(atEnd){ grid.scrollTo({ left: 0, behavior: 'smooth' }); }
    else{ grid.scrollBy({ left: STEP, behavior: 'smooth' }); }
  }
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(stepNext, AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  function pauseThenResume(){
    stopAutoplay();
    clearTimeout(pauseThenResume._t);
    pauseThenResume._t = setTimeout(startAutoplay, 4500);
  }
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
  carousel.addEventListener('touchend', pauseThenResume);

  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      items.forEach(function(item){
        var show = f === 'all' || item.getAttribute('data-cat') === f;
        item.classList.toggle('hidden', !show);
      });
      grid.scrollTo({ left: 0, behavior: 'smooth' });
      setTimeout(updateActiveItem, 350);
      pauseThenResume();
    });
  });

  document.getElementById('galPrev').addEventListener('click', function(){
    grid.scrollBy({ left: -STEP, behavior: 'smooth' });
    pauseThenResume();
  });
  document.getElementById('galNext').addEventListener('click', function(){
    grid.scrollBy({ left: STEP, behavior: 'smooth' });
    pauseThenResume();
  });

  updateActiveItem();
  startAutoplay();

  var lightbox = document.getElementById('lightbox');
  var lbImage = document.getElementById('lbImage');
  var lbCap = document.getElementById('lbCap');
  var currentIndex = 0;

  function visibleItems(){
    return items.filter(function(item){ return !item.classList.contains('hidden'); });
  }

  function openLightbox(item){
    var vis = visibleItems();
    currentIndex = vis.indexOf(item);
    showCurrent(vis);
    lightbox.classList.add('open');
    stopAutoplay();
  }

  function showCurrent(vis){
    vis = vis || visibleItems();
    var item = vis[currentIndex];
    if(!item) return;
    var img = item.querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCap.textContent = item.querySelector('.cap').textContent;
  }

  items.forEach(function(item){
    item.addEventListener('click', function(){ openLightbox(item); });
  });

  document.getElementById('lbClose').addEventListener('click', function(){
    lightbox.classList.remove('open');
    startAutoplay();
  });
  document.getElementById('lbPrev').addEventListener('click', function(){
    var vis = visibleItems();
    currentIndex = (currentIndex - 1 + vis.length) % vis.length;
    showCurrent(vis);
  });
  document.getElementById('lbNext').addEventListener('click', function(){
    var vis = visibleItems();
    currentIndex = (currentIndex + 1) % vis.length;
    showCurrent(vis);
  });
  lightbox.addEventListener('click', function(e){
    if(e.target === lightbox){ lightbox.classList.remove('open'); startAutoplay(); }
  });
  document.addEventListener('keydown', function(e){
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape'){ lightbox.classList.remove('open'); startAutoplay(); }
    if(e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
    if(e.key === 'ArrowRight') document.getElementById('lbNext').click();
  });
})();

(function(){
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  faqItems.forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
})();
