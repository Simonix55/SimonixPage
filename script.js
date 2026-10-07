/**
 * Öffnet ein YouTube-Video oder Short in einem stylischen Pop-up-Modal.
 * @param {string} videoId - Die YouTube Video ID (z.B. 'qhT0nUY-Mws')
 * @param {boolean} isShort - True, wenn es ein vertikales Short (9:16) ist
 */
function openVideoModal(videoId, isShort = false) {
  const modal = document.getElementById('videoModal');
  const container = document.getElementById('modalPlayerContainer');
  
  if (!modal || !container) return;

  // Format anpassen (9:16 für Shorts, 16:9 für Standard-Videos)
  const aspectClass = isShort 
    ? 'aspect-[9/16] max-w-sm h-[80vh]' 
    : 'aspect-video max-w-4xl w-full';

  const embedUrl = isShort 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&rel=0`
    : `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  container.className = `relative ${aspectClass} mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl border border-red-500/20`;
  container.innerHTML = `
    <iframe 
      src="${embedUrl}" 
      class="w-full h-full border-0" 
      allow="autoplay; encrypted-media; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden'; // Scrollen im Hintergrund sperren
}

function closeModal() {
  const modal = document.getElementById('videoModal');
  const container = document.getElementById('modalPlayerContainer');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
  container.innerHTML = ''; // Stoppt die Audio/Video-Wiedergabe sofort
  document.body.style.overflow = 'auto'; // Scrollen wieder aktivieren
}