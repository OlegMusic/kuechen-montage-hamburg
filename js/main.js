// === Mobile Menu Toggle ===
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      this.textContent = nav.classList.contains('active') ? '\u2715' : '\u2630';
    });
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        menuToggle.textContent = '\u2630';
      });
    });
  }

  // === FAQ Accordion ===
  document.querySelectorAll('.faq-question').forEach(function(q) {
    q.addEventListener('click', function() {
      var item = this.parentElement;
      var wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('active'); });
      if (!wasActive) item.classList.add('active');
    });
  });

  // === Scroll Animation ===
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-card, .advantage-card, .review-card, .faq-item').forEach(function(el) {
    observer.observe(el);
  });

  // === Header scroll effect ===
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
      }
    });
  }
});

  // === Cost Calculator ===
  var calcBtn = document.getElementById('calc-btn');
  if (calcBtn) {
    calcBtn.addEventListener('click', function() {
      var service = document.getElementById('calc-service');
      var qty = document.getElementById('calc-qty');
      var result = document.getElementById('calc-result');
      var price = document.getElementById('calc-price');
      if (service && qty && result && price) {
        var total = parseInt(service.value) * parseInt(qty.value);
        if (total > 0) {
          price.textContent = 'ab ' + total + '\u20AC';
          result.style.display = 'block';
        }
      }
    });
  }
