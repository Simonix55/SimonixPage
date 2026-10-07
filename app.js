/**
 * Erzeugt eine stylized Toast-Benachrichtigung unten rechts.
 * @param {string} message - Der Text der Nachricht
 * @param {'success'|'info'|'warning'} type - Typ der Nachricht
 */
function showToast(message, type = 'success') {
  const colors = {
    success: 'bg-red-600 text-white border-red-500',
    info: 'bg-gray-900 text-white border-gray-700',
    warning: 'bg-amber-600 text-white border-amber-500'
  };

  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 ${colors[type] || colors.info} border px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 z-50 font-medium text-sm`;
  
  toast.innerHTML = `
    <svg class="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  // Nach 3,5 Sekunden ausfaden und entfernen
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-10');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Beispiel: Kanal-Link kopieren
function copyChannelLink() {
  navigator.clipboard.writeText('https://www.youtube.com/@SimonixWad');
  showToast('Kanal-Link in die Zwischenablage kopiert! 🚀', 'success');
}