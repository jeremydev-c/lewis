/**
 * Lewis Halloween Birthday Bash - 31st October (Thika)
 * Simple, Sleek RSVP & Live Client Guestlist System
 */

document.addEventListener('DOMContentLoaded', () => {
  initAtmosphereCanvas();
  initFlashlightCursor();
  initCountdownTimer();
  initAudioEngine();
  initSimpleRSVPSystem();
  initCalendarDownload();
});

/* ==========================================================
   1. ATMOSPHERE PARTICLES (CANVAS MIST & EMBERS)
   ========================================================== */
function initAtmosphereCanvas() {
  const canvas = document.getElementById('spooky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = width > 768 ? 40 : 20;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
      fadeSpeed: Math.random() * 0.008 + 0.004,
      color: Math.random() > 0.4 ? '255, 106, 0' : '168, 85, 247'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += p.fadeSpeed;

      if (p.opacity > 0.75 || p.opacity < 0.15) {
        p.fadeSpeed = -p.fadeSpeed;
      }

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.opacity)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.color}, 0.8)`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================
   2. CURSOR FLASHLIGHT
   ========================================================== */
function initFlashlightCursor() {
  const flashlight = document.getElementById('flashlight-glow');
  if (!flashlight || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function update() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    flashlight.style.left = `${currentX}px`;
    flashlight.style.top = `${currentY}px`;
    requestAnimationFrame(update);
  }

  update();
}

/* ==========================================================
   3. COUNTDOWN TIMER (31ST OCTOBER - THIKA, KENYA)
   ========================================================== */
function initCountdownTimer() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  if (!cdDays) return;

  // 31st October 2026, 18:30:00 (6:30 PM) East Africa Time (UTC+3)
  const partyDate = new Date('2026-10-31T18:30:00+03:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = partyDate - now;

    if (distance <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================
   4. AUDIO SYNTHESIS & LIGHTNING
   ========================================================== */
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let isAudioPlaying = false;

function initAudioEngine() {
  const toggleBtn = document.getElementById('toggle-sound-btn');
  const statusText = document.getElementById('audio-status');
  const iconSpan = document.getElementById('audio-icon');
  const lightningBtn = document.getElementById('trigger-lightning-btn');

  function getCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function startAudio() {
    const ctx = getCtx();
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.01, ctx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 2);

    ambientOsc = ctx.createOscillator();
    ambientOsc.type = 'sawtooth';
    ambientOsc.frequency.setValueAtTime(65.41, ctx.currentTime); // Low C2

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, ctx.currentTime);

    ambientOsc.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOsc.start();
    isAudioPlaying = true;
    if (toggleBtn) toggleBtn.classList.add('playing');
    if (statusText) statusText.textContent = 'Sound: ON';
    if (iconSpan) iconSpan.textContent = '🔊';
    showToast('🦇 Spooky ambient soundscape ON');
  }

  function stopAudio() {
    if (ambientGain && audioCtx) {
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        try { if (ambientOsc) ambientOsc.stop(); } catch (e) {}
        isAudioPlaying = false;
      }, 1000);
    }
    if (toggleBtn) toggleBtn.classList.remove('playing');
    if (statusText) statusText.textContent = 'Sound';
    if (iconSpan) iconSpan.textContent = '🔇';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!isAudioPlaying) startAudio();
      else stopAudio();
    });
  }

  function flashLightning() {
    const overlay = document.getElementById('lightning-overlay');
    if (overlay) {
      overlay.classList.remove('flash');
      void overlay.offsetWidth;
      overlay.classList.add('flash');
    }
    try {
      const ctx = getCtx();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 3;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(350, ctx.currentTime);
      f.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 1.4);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      src.connect(f);
      f.connect(g);
      g.connect(ctx.destination);
      src.start();
    } catch (e) {}
    showToast('⚡ Lightning over Thika!');
  }

  if (lightningBtn) {
    lightningBtn.addEventListener('click', flashLightning);
  }
}

/* ==========================================================
   5. FULLY FUNCTIONAL RSVP & CLEAN CLIENT GUESTLIST
   ========================================================== */
const STORAGE_KEY = 'lewis_halloween_guestlist_live';

function initSimpleRSVPSystem() {
  const form = document.getElementById('simple-rsvp-form');
  const attendingYesRadio = document.getElementById('attending-yes');
  const attendingNoRadio = document.getElementById('attending-no');
  const attendingFields = document.getElementById('attending-fields');
  const costumeInput = document.getElementById('costume-idea');
  const submitBtn = document.getElementById('submit-btn');

  const successCard = document.getElementById('rsvp-success-card');
  const successHeadline = document.getElementById('success-headline');
  const successMessage = document.getElementById('success-message');
  const resetBtn = document.getElementById('reset-rsvp-btn');
  const whatsappNotifyBtn = document.getElementById('send-whatsapp-confirm-btn');

  // Clean old demo test data
  localStorage.removeItem('lewis_party_guestlist_v2');
  localStorage.removeItem('lewis_halloween_guestlist');
  localStorage.removeItem('lewis_halloween_rsvp');

  // Load purely real guests from localStorage (starts 100% empty)
  let guestList = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      guestList = JSON.parse(saved);
    }
  } catch (e) {
    guestList = [];
  }

  // Handle Attendance radio toggle (Yes vs No)
  function handleAttendanceChange() {
    if (attendingNoRadio.checked) {
      attendingFields.style.display = 'none';
      costumeInput.required = false;
      submitBtn.innerHTML = '<span>SEND REGRETS TO LEWIS ✉️</span>';
    } else {
      attendingFields.style.display = 'block';
      costumeInput.required = true;
      submitBtn.innerHTML = '<span>SUBMIT MY RSVP ✉️</span>';
    }
  }

  if (attendingYesRadio && attendingNoRadio) {
    attendingYesRadio.addEventListener('change', handleAttendanceChange);
    attendingNoRadio.addEventListener('change', handleAttendanceChange);
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const status = attendingYesRadio.checked ? 'Attending' : 'Declined';
      const name = document.getElementById('guest-name').value.trim();
      const phone = document.getElementById('guest-phone').value.trim();
      const costume = status === 'Attending' ? (costumeInput.value.trim() || 'Costume TBD') : '—';
      const plusOnes = status === 'Attending' ? document.getElementById('plus-ones').value : '0';
      const message = document.getElementById('guest-message').value.trim() || '—';
      
      const now = new Date();
      const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
                      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const newEntry = {
        id: 'guest_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        status,
        name,
        phone,
        costume,
        plusOnes,
        message,
        time: timeStr
      };

      // Add to front of array
      guestList.unshift(newEntry);
      saveGuestList();

      // Refresh Dashboard
      renderDashboard();

      // Show Success State
      form.style.display = 'none';
      successCard.style.display = 'block';

      if (status === 'Attending') {
        successHeadline.textContent = `See You on the 31st, ${name}! 🎃`;
        successMessage.textContent = `Your attendance has been confirmed with costume: "${costume}". Your RSVP is now visible to Lewis on the guestlist below!`;
      } else {
        successHeadline.textContent = `Thank You, ${name}! 👻`;
        successMessage.textContent = `Your regrets and message have been recorded for Lewis.`;
      }

      // Setup WhatsApp Direct Message link for Lewis
      if (whatsappNotifyBtn) {
        let msg = '';
        if (status === 'Attending') {
          msg = `Hey Lewis! 🎃 I just RSVPed to your Halloween Birthday Bash on the 31st in Thika!\n` +
                `Status: ATTENDING\n` +
                `Costume: ${costume}\n` +
                (plusOnes !== '0' ? `Bringing: +${plusOnes}\n` : '') +
                (message !== '—' ? `Message: "${message}"\n` : '');
        } else {
          msg = `Hey Lewis! 👻 I got your Halloween Birthday invite for the 31st. Unfortunately I won't be able to make it, but wishing you an amazing birthday celebration!\n` +
                (message !== '—' ? `"${message}"\n` : '');
        }

        whatsappNotifyBtn.onclick = () => {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        };
      }

      showToast(`✅ RSVP saved to Lewis guestlist!`);
    });
  }

  // Reset form button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      handleAttendanceChange();
      form.style.display = 'flex';
      successCard.style.display = 'none';
    });
  }

  // Delete guest functionality
  window.deleteGuest = function (guestId) {
    const target = guestList.find(g => g.id === guestId);
    if (!target) return;

    if (confirm(`Remove "${target.name}" from Lewis guestlist?`)) {
      guestList = guestList.filter(g => g.id !== guestId);
      saveGuestList();
      renderDashboard();
      showToast(`Removed "${target.name}" from guestlist.`);
    }
  };

  function saveGuestList() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestList));
    } catch (e) {}
  }

  // Table filtering
  let activeFilter = 'all';
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderTableRows(activeFilter);
    });
  });

  // Render Dashboard
  function renderDashboard() {
    const totalCount = guestList.length;
    const attendingGuests = guestList.filter(g => g.status === 'Attending');
    const declinedGuests = guestList.filter(g => g.status === 'Declined');
    const plusOnesTotal = attendingGuests.reduce((acc, cur) => acc + parseInt(cur.plusOnes || 0, 10), 0);

    // Update Metric Stat Counters
    const statTotal = document.getElementById('stat-total');
    const statAttending = document.getElementById('stat-attending');
    const statDeclined = document.getElementById('stat-declined');
    const statPlusOnes = document.getElementById('stat-plusones');

    if (statTotal) statTotal.textContent = totalCount;
    if (statAttending) statAttending.textContent = attendingGuests.length;
    if (statDeclined) statDeclined.textContent = declinedGuests.length;
    if (statPlusOnes) statPlusOnes.textContent = plusOnesTotal;

    // Filter Badges
    const filterAllCount = document.getElementById('filter-all-count');
    const filterYesCount = document.getElementById('filter-yes-count');
    const filterNoCount = document.getElementById('filter-no-count');

    if (filterAllCount) filterAllCount.textContent = totalCount;
    if (filterYesCount) filterYesCount.textContent = attendingGuests.length;
    if (filterNoCount) filterNoCount.textContent = declinedGuests.length;

    renderTableRows(activeFilter);
  }

  function renderTableRows(filter) {
    const tbody = document.getElementById('guest-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = guestList.filter(item => {
      if (filter === 'all') return true;
      return item.status === filter;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-dim); padding: 3rem 1rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📜</div>
            <strong>No RSVP responses yet.</strong><br>
            <span style="font-size: 0.85rem;">When guests submit the form above, their responses will appear here immediately.</span>
          </td>
        </tr>`;
      return;
    }

    filtered.forEach(guest => {
      const tr = document.createElement('tr');
      const isAttending = guest.status === 'Attending';

      const badgeHtml = isAttending
        ? `<span class="badge-attending">🎃 Attending</span>`
        : `<span class="badge-declined">👻 Declined</span>`;

      tr.innerHTML = `
        <td>${badgeHtml}</td>
        <td><strong>${escapeHtml(guest.name)}</strong></td>
        <td><a href="tel:${escapeHtml(guest.phone)}" style="color: var(--text-muted); text-decoration: none;">${escapeHtml(guest.phone)}</a></td>
        <td>${escapeHtml(guest.costume)}</td>
        <td>${guest.plusOnes !== '0' ? `+${escapeHtml(guest.plusOnes)}` : '0'}</td>
        <td style="max-width: 220px; font-style: italic; color: var(--text-muted);">${escapeHtml(guest.message)}</td>
        <td style="color: var(--text-dim); font-size: 0.8rem; white-space: nowrap;">${escapeHtml(guest.time)}</td>
        <td>
          <button onclick="window.deleteGuest('${guest.id}')" title="Delete entry" style="background: transparent; border: 1px solid rgba(255, 42, 75, 0.3); color: #ff2a4b; border-radius: 6px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.8rem; transition: 0.2s ease;">
            🗑️
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial render with empty list
  renderDashboard();
}

/* ==========================================================
   6. CALENDAR DOWNLOAD (SATURDAY, 31ST OCTOBER)
   ========================================================== */
function initCalendarDownload() {
  const btn = document.getElementById('add-calendar-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lewis Halloween Birthday Bash//EN",
      "BEGIN:VEVENT",
      "UID:lewis-halloween-31oct-2026@thika",
      "DTSTAMP:20261018T120000Z",
      "DTSTART:20261031T153000Z", // 18:30 UTC+3 = 15:30 UTC
      "DTEND:20261101T030000Z",
      "SUMMARY:Lewis Halloween Birthday Bash (Thika)",
      "DESCRIPTION:Saturday 31st October! Dress Code: Full Halloween Costume. Gates open 6:30 PM.",
      "LOCATION:Private Sanctuary Estate, Thika, Kenya",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Lewis-Halloween-Birthday-31Oct.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('📅 31st October Calendar invite downloaded!');
  });
}

/* ==========================================================
   HELPERS: TOAST & ESCAPING
   ========================================================== */
function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
