(() => {
  const SRC = 'https://n-orlov.github.io/10to8-agenda-rows/10to8-agenda-rows.user.js';
  const isCal = w => { try { return w.location.pathname.includes('/apps/ceres/'); } catch (e) { return false; } };
  const frame = [...document.querySelectorAll('iframe')].find(f => isCal(f.contentWindow));
  const doc = frame ? frame.contentDocument : isCal(window) ? document : null;
  if (!doc) { alert('Open the 10to8 calendar first, then click this bookmark again.'); return; }
  const s = doc.createElement('script');
  s.src = SRC + '?' + Date.now();
  s.onerror = () => alert('Could not load the 10to8 rows script. Check the internet connection.');
  doc.head.appendChild(s);
})();
