import React, { useEffect, useRef } from 'react';

export default function DotGridBackground({
  mode = 'pomodoro',
  enableRipple = true,
  enableRepulsion = true,
  enableIdleWave = true,
  enableColorTint = true,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const ripplesRef = useRef([]);

  // Color theme mapping for the dots & highlights
  const getColorTint = () => {
    if (!enableColorTint) {
      return { r: 255, g: 255, b: 255 };
    }
    switch (mode) {
      case 'shortBreak':
        return { r: 45, g: 212, b: 191 }; // Teal / Cyan
      case 'longBreak':
        return { r: 99, g: 102, b: 241 }; // Indigo / Blue
      case 'pomodoro':
      default:
        return { r: 244, g: 63, b: 94 }; // Rose / Coral
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let viewW = window.innerWidth;
    let viewH = window.innerHeight;

    const applyCanvasSize = () => {
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      canvas.width = viewW * dpr;
      canvas.height = viewH * dpr;
      canvas.style.width = `${viewW}px`;
      canvas.style.height = `${viewH}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    applyCanvasSize();

    const spacing = 32;
    let dots = [];

    const initGrid = () => {
      dots = [];
      const cols = Math.ceil(viewW / spacing);
      const rows = Math.ceil(viewH / spacing);

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const bx = c * spacing;
          const by = r * spacing;
          dots.push({
            baseX: bx,
            baseY: by,
            x: bx,
            y: by,
            vx: 0,
            vy: 0,
            baseRadius: 1.4,
          });
        }
      }
    };

    initGrid();

    const handleResize = () => {
      applyCanvasSize();
      initGrid();
    };

    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e) => {
      if (!enableRipple || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: Math.max(viewW, viewH) * 1.1,
        speed: 15,
        alpha: 1.0,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    let startTime = performance.now();

    const render = (now) => {
      ctx.clearRect(0, 0, viewW, viewH);

      const elapsed = now - startTime;
      const mouse = mouseRef.current;
      const tint = getColorTint();
      const visibilityRadius = 185; // Wider visibility area around cursor
      const repulsionRadius = 110;  // Concentrated elastic push
      const springK = 0.09;
      const damping = 0.84;

      // Update active click ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ripple.radius += ripple.speed;
        ripple.alpha -= 0.012;
        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          ripplesRef.current.splice(i, 1);
        }
      }

      // Draw each dot
      dots.forEach((dot) => {
        // Distance calculated from base position for mathematically exact centering
        const mdx = dot.baseX - mouse.x;
        const mdy = dot.baseY - mouse.y;
        const distFromMouse = Math.sqrt(mdx * mdx + mdy * mdy);

        // 1. Elastic repulsion from cursor (smooth cubic falloff)
        if (enableRepulsion && mouse.active && distFromMouse < repulsionRadius && distFromMouse > 0) {
          const norm = 1 - distFromMouse / repulsionRadius;
          const force = norm * norm * 3.8;
          dot.vx += (mdx / distFromMouse) * force;
          dot.vy += (mdy / distFromMouse) * force;
        }

        // 2. Click Shockwave physics impulse & visual influence
        let rippleInfluence = 0;
        if (enableRipple) {
          ripplesRef.current.forEach((rip) => {
            const rdx = dot.x - rip.x;
            const rdy = dot.y - rip.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const distToRing = Math.abs(rdist - rip.radius);
            const ringWidth = 55;

            if (distToRing < ringWidth && rdist > 0) {
              const crest = (1 - distToRing / ringWidth) * rip.alpha;
              if (crest > rippleInfluence) rippleInfluence = crest;

              // Physical shockwave impulse kicks dots outward along wave normal
              const pushForce = Math.sin(crest * Math.PI) * rip.alpha * 1.6;
              dot.vx += (rdx / rdist) * pushForce;
              dot.vy += (rdy / rdist) * pushForce;
            }
          });
        }

        // Spring physics to return smoothly to base position
        dot.vx += (dot.baseX - dot.x) * springK;
        dot.vy += (dot.baseY - dot.y) * springK;
        dot.vx *= damping;
        dot.vy *= damping;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Clamp maximum displacement so dots stay neat
        const dispX = dot.x - dot.baseX;
        const dispY = dot.y - dot.baseY;
        const currentDisp = Math.sqrt(dispX * dispX + dispY * dispY);
        const maxDisp = 12;
        if (currentDisp > maxDisp) {
          dot.x = dot.baseX + (dispX / currentDisp) * maxDisp;
          dot.y = dot.baseY + (dispY / currentDisp) * maxDisp;
        }

        // 3. Organic dual-harmonic idle wave (calm, flowing breath)
        let idleWave = 0;
        if (enableIdleWave) {
          const wave1 = Math.sin(dot.baseX * 0.005 + dot.baseY * 0.003 + elapsed * 0.001);
          const wave2 = Math.cos(dot.baseX * 0.003 - dot.baseY * 0.004 + elapsed * 0.0008);
          idleWave = (wave1 + wave2) * 0.055;
        }

        // 4. Proximity visibility boost (generous 185px circle centered directly on cursor)
        let cursorInfluence = 0;
        if (mouse.active && distFromMouse < visibilityRadius) {
          const norm = 1 - distFromMouse / visibilityRadius;
          cursorInfluence = norm * (2 - norm); // Smooth ease-out falloff
        }

        // Final dot size & clean opacity (zero fuzzy glow)
        const radius = dot.baseRadius + (enableRipple ? rippleInfluence * 0.8 : 0);
        const totalAlpha = Math.min(
          0.9,
          0.20 + idleWave + cursorInfluence * 0.65 + rippleInfluence * 0.6
        );

        // Blend color between crisp white and active theme tint
        const tintFactor = Math.min(1, cursorInfluence * 0.85 + rippleInfluence * 1.0);
        const r = Math.round(255 * (1 - tintFactor) + tint.r * tintFactor);
        const g = Math.round(255 * (1 - tintFactor) + tint.g * tintFactor);
        const b = Math.round(255 * (1 - tintFactor) + tint.b * tintFactor);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${totalAlpha})`;
        ctx.shadowBlur = 0;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [mode, enableRipple, enableRepulsion, enableIdleWave, enableColorTint]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
}
