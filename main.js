// Animiert eine Zahl flüssig von `start` bis `end`
function animateCounter(element, start, end, duration = 1800) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Smooth Ease-Out Effekt
    const easeOutProgress = 1 - Math.pow(1 - progress, 3); 
    const current = Math.floor(easeOutProgress * (end - start) + start);
    
    element.innerText = current.toLocaleString('de-DE');
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Startet die Animation automatisch, wenn das Element auf dem Bildschirm erscheint
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const targetValue = parseInt(el.getAttribute('data-target'), 10);
      if (targetValue) {
        animateCounter(el, 0, targetValue);
        observer.unobserve(el); // Nur einmal animieren
      }
    }
  });
}, { threshold: 0.4 });

// Alle Elemente mit der Klasse .count-up beobachten
document.querySelectorAll('.count-up').forEach(el => observer.observe(el));