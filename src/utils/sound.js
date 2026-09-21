// Web Audio API Sound Synthesizer (100% offline, zero latency, zero external asset dependencies)

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play synthesized notification alarm
 * @param {'bell' | 'digital' | 'zen' | 'kitchen'} soundType
 * @param {number} volume - value from 0 to 1
 */
export function playAlarm(soundType = 'bell', volume = 0.7) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (soundType) {
      case 'bell': {
        // High crystal bell tone with harmonic overtone
        const freqs = [880, 1760, 2640];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const initGain = (0.5 / (idx + 1));
          gain.gain.setValueAtTime(initGain, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 2.3);
        });
        break;
      }

      case 'digital': {
        // Modern tech double beep
        const beeps = [
          { time: now, freq: 784 },      // G5
          { time: now + 0.14, freq: 1046 } // C6
        ];
        beeps.forEach(({ time, freq }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0.4, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(time);
          osc.stop(time + 0.13);
        });
        break;
      }

      case 'zen': {
        // Deep Tibetan singing bowl / Zen gong
        const baseFreq = 220; // A3
        const harmonics = [
          { f: baseFreq, g: 0.6, decay: 3.5 },
          { f: baseFreq * 1.5, g: 0.25, decay: 2.8 },
          { f: baseFreq * 2.76, g: 0.15, decay: 2.2 },
          { f: baseFreq * 5.4, g: 0.08, decay: 1.5 }
        ];

        harmonics.forEach(({ f, g, decay }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(g, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + decay + 0.1);
        });
        break;
      }

      case 'kitchen': {
        // Classic mechanical timer ring pattern
        for (let i = 0; i < 4; i++) {
          const time = now + i * 0.18;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1480, time);

          gain.gain.setValueAtTime(0.3, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(time);
          osc.stop(time + 0.11);
        }
        break;
      }

      default:
        playAlarm('bell', volume);
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Tactile micro-click sound for button presses
 */
export function playClick(volume = 0.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Ignore audio interaction block before gesture
  }
}
