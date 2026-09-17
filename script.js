// Animated counter & reveal observer
(function () {
  var counters = document.querySelectorAll('.num[data-count]');
  var done = new WeakSet();

  function animateCount(el) {
    if (done.has(el)) return;
    done.add(el);
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = performance.now();
    var duration = 1400;

    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll('.reveal, .stats');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        if (entry.target.classList.contains('stats')) {
          counters.forEach(animateCount);
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach(function (el) { io.observe(el); });
})();

// Scrollytelling step observer
(function () {
  var steps = document.querySelectorAll('.scrolly-step');
  var graphics = document.querySelectorAll('#scrollyGraphic svg');

  var stepIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var idx = entry.target.getAttribute('data-step');
      if (entry.isIntersecting) {
        steps.forEach(function (s) { s.classList.remove('active'); });
        entry.target.classList.add('active');
        graphics.forEach(function (g) { g.classList.remove('active'); });
        var match = document.querySelector('#scrollyGraphic svg[data-g="' + idx + '"]');
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.5, rootMargin: '-30% 0px -30% 0px' });

  steps.forEach(function (s) { stepIo.observe(s); });
})();

// Waitlist form validation & submission
(function () {
  var form = document.getElementById('waitlistForm');
  var success = document.getElementById('formSuccess');

  function setErr(id, msg) {
    document.getElementById('err-' + id).textContent = msg || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var age = form.age.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var idea = form.idea.value.trim();
    var ok = true;

    setErr('name', '');
    setErr('age', '');
    setErr('email', '');
    setErr('phone', '');
    setErr('idea', '');

    if (!name) {
      setErr('name', 'Enter your name');
      ok = false;
    }
    if (!age || isNaN(age) || age < 10 || age > 19) {
      setErr('age', 'Age 10–19');
      ok = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('email', 'Enter a valid email');
      ok = false;
    }
    if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setErr('phone', 'Enter a 10-digit number');
      ok = false;
    }
    if (!idea) {
      setErr('idea', 'Tell us a little, even "not sure yet"');
      ok = false;
    }

    if (!ok) return;

    form.classList.add('hide');
    success.classList.add('show');
  });
})();
