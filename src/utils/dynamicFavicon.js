// Dynamic Browser Tab Favicon Generator
// Renders live circular countdown progress ring onto browser favicon

let canvas = null;
let ctx = null;
let logoImg = null;
let isLogoLoaded = false;
let originalFaviconHref = '/logo.png';

// Theme mode colors matching the app
const MODE_COLORS = {
  pomodoro: '#f43f5e',   // Tomato / Rose
  shortBreak: '#14b8a6', // Fresh Teal
  longBreak: '#3b82f6',  // Calm Blue
};

function initCanvas() {
  if (typeof document === 'undefined') return false;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    ctx = canvas.getContext('2d');
  }

  if (!logoImg) {
    logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/logo.png';
    logoImg.onload = () => {
      isLogoLoaded = true;
    };
  }

  return true;
}

/**
 * Update the browser favicon with live progress ring
 * @param {number} timeLeft - Remaining seconds
 * @param {number} totalTime - Total session seconds
 * @param {'pomodoro' | 'shortBreak' | 'longBreak'} mode
 * @param {boolean} isRunning
 */
export function updateDynamicFavicon(timeLeft, totalTime, mode = 'pomodoro', isRunning = false) {
  if (typeof document === 'undefined') return;
  if (!initCanvas()) return;

  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'icon';

  // If timer is at pristine full duration and unstarted, restore standard logo
  if (!isRunning && timeLeft >= totalTime) {
    if (link.href !== originalFaviconHref && !link.href.endsWith('/logo.png')) {
      link.href = originalFaviconHref;
    }
    return;
  }

  ctx.clearRect(0, 0, 64, 64);

  const centerX = 32;
  const centerY = 32;
  const radius = 27;
  const strokeWidth = 7;

  // 1. Dark semi-transparent circular backing for contrast across dark/light browser themes
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  // 2. Draw tomato icon in center
  if (isLogoLoaded && logoImg) {
    // Center a 32x32 logo
    ctx.drawImage(logoImg, 16, 16, 32, 32);
  } else {
    // Fallback tomato emoji if image not yet loaded
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍅', centerX, centerY + 2);
  }

  // 3. Background Track Ring (subtle white/grey)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  // 4. Active Progress Arc (Remaining time percentage)
  // Starts at top (-PI/2) and sweeps clockwise
  const remainingFraction = totalTime > 0 ? Math.max(0, Math.min(1, timeLeft / totalTime)) : 0;
  const arcLength = remainingFraction * (Math.PI * 2);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + arcLength;

  if (remainingFraction > 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = MODE_COLORS[mode] || MODE_COLORS.pomodoro;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // 5. If paused, draw a tiny pause indicator badge at bottom right
  if (!isRunning && timeLeft < totalTime) {
    ctx.beginPath();
    ctx.arc(48, 48, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; // Amber
    ctx.fill();

    // Two pause bars
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(44, 43, 3, 10);
    ctx.fillRect(49, 43, 3, 10);
  }

  try {
    const dataUrl = canvas.toDataURL('image/png');
    link.href = dataUrl;
    if (!document.head.contains(link)) {
      document.head.appendChild(link);
    }
  } catch (err) {
    // Ignore canvas security errors if any
  }
}
