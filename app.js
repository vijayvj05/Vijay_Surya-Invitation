(() => {
  const openingScreen = document.getElementById('openingScreen');
  const siteShell = document.getElementById('siteShell');
  const openInvitation = document.getElementById('openInvitation');
  const musicButton = document.getElementById('musicButton');
  const weddingMusic = document.getElementById('weddingMusic');

  function openSite(startMusic = false) {
    if (openingScreen.classList.contains('is-open')) return;
    if (startMusic) playMusic();
    openingScreen.classList.add('is-open');
    siteShell.inert = false;
    siteShell.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => openingScreen.remove(), 850);
  }

  openInvitation.addEventListener('click', () => openSite(true));

  // Allow direct links to open the invitation content without retaining the cover screen.
  if (window.location.hash) openSite();

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  reveals.forEach((element) => revealObserver.observe(element));

  const weddingTime = new Date('2026-11-20T09:15:00+05:30').getTime();
  const timeGrid = document.getElementById('timeGrid');
  const complete = document.getElementById('countdownComplete');
  const fields = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  function updateCountdown() {
    const distance = weddingTime - Date.now();
    if (distance <= 0) {
      timeGrid.hidden = true;
      complete.hidden = false;
      return;
    }
    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    fields.days.textContent = String(days).padStart(2, '0');
    fields.hours.textContent = String(hours).padStart(2, '0');
    fields.minutes.textContent = String(minutes).padStart(2, '0');
    fields.seconds.textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  document.getElementById('saveDate').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:surya-vijay-reception-20261119@wedding',
      'DTSTAMP:20261005T000000Z',
      'DTSTART;TZID=Asia/Kolkata:20261119T190000',
      'DTEND;TZID=Asia/Kolkata:20261119T220000',
      'SUMMARY:Reception — Surya Shree & Vijay Raj',
      'LOCATION:Krish Hall, Koviloor Road, near old bus stand, Karaikudi',
      'DESCRIPTION:Reception for Surya Shree M and Vijay Raj K S',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:surya-vijay-muhurtham-20261120@wedding',
      'DTSTAMP:20261005T000000Z',
      'DTSTART;TZID=Asia/Kolkata:20261120T091500',
      'DTEND;TZID=Asia/Kolkata:20261120T101500',
      'SUMMARY:Muhurtham — Surya Shree & Vijay Raj',
      'LOCATION:Krish Hall, Koviloor Road, near old bus stand, Karaikudi',
      'DESCRIPTION:Wedding Muhurtham for Surya Shree M and Vijay Raj K S',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'surya-shree-vijay-raj-wedding.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  function updateMusicButton(isPlaying) {
    musicButton.classList.toggle('is-playing', isPlaying);
    musicButton.setAttribute('aria-pressed', String(isPlaying));
    musicButton.setAttribute('aria-label', isPlaying ? 'Pause wedding music' : 'Play wedding music');
    musicButton.querySelector('.music-label').textContent = isPlaying ? 'Pause' : 'Music';
  }

  function playMusic() {
    weddingMusic.play().then(() => updateMusicButton(true)).catch(() => updateMusicButton(false));
  }

  musicButton.addEventListener('click', () => {
    if (weddingMusic.paused) playMusic();
    else weddingMusic.pause();
  });
  weddingMusic.addEventListener('pause', () => updateMusicButton(false));
  weddingMusic.addEventListener('play', () => updateMusicButton(true));
})();
