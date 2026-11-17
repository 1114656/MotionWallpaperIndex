import { useEffect, useRef } from "react";

function drawCurrent(context, width, height, time) {
  context.clearRect(0, 0, width, height);

  for (let band = 0; band < 15; band += 1) {
    const depth = band / 14;
    const baseline = height * (0.035 + depth * 0.89);
    const strength = depth < 0.27 || depth > 0.6 ? 1 : 0.42;
    const phase = time * (0.52 + depth * 0.18) + band * 0.81;
    const amplitude = 8 + depth * 18;

    context.beginPath();
    for (let x = -24; x <= width + 24; x += 12) {
      const y = baseline
        + Math.sin(x * 0.008 + phase) * amplitude
        + Math.sin(x * 0.018 - time * 0.34 + band * 0.72) * (4 + depth * 7);
      if (x === -24) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.lineCap = "round";
    context.shadowBlur = 13;
    context.shadowColor = `rgba(255,255,255,${0.36 * strength})`;
    context.lineWidth = 7 + depth * 5;
    context.strokeStyle = `rgba(255,255,255,${0.13 * strength})`;
    context.stroke();

    context.shadowBlur = 0;
    context.lineWidth = 1.15 + depth * 1.1;
    context.strokeStyle = band % 3 === 0
      ? `rgba(17,145,181,${0.15 * strength})`
      : `rgba(255,255,255,${0.54 * strength})`;
    context.stroke();
  }

  for (let ray = 0; ray < 5; ray += 1) {
    const x = width * (0.04 + ray * 0.23) + Math.sin(time * 0.24 + ray) * 35;
    const endX = x + width * (ray % 2 ? -0.1 : 0.12);
    const gradient = context.createLinearGradient(x, 0, endX, height * 0.78);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.42, "rgba(255,255,255,0.075)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(x - 9, 0);
    context.lineTo(x + 9, 0);
    context.lineTo(endX + 90, height * 0.78);
    context.lineTo(endX - 90, height * 0.78);
    context.closePath();
    context.fill();
  }
}

export default function AquaCurrent({ paused }) {
  const canvasRef = useRef(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let lastPaint = 0;
    let inView = true;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawCurrent(context, width, height, elapsedRef.current);
    };

    const paint = (now) => {
      if (now - lastPaint >= 32) {
        elapsedRef.current += lastFrame ? Math.min((now - lastFrame) / 1000, 0.06) : 0;
        drawCurrent(context, width, height, elapsedRef.current);
        lastPaint = now;
        lastFrame = now;
      }
      animationFrame = window.requestAnimationFrame(paint);
    };

    const updateAnimation = () => {
      const shouldRun = !paused && !reducedMotion.matches && !document.hidden && inView;
      if (!shouldRun && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      if (shouldRun && !animationFrame) {
        lastFrame = 0;
        lastPaint = 0;
        animationFrame = window.requestAnimationFrame(paint);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateAnimation();
    });
    viewObserver.observe(canvas);
    reducedMotion.addEventListener("change", updateAnimation);
    document.addEventListener("visibilitychange", updateAnimation);
    resize();
    updateAnimation();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      reducedMotion.removeEventListener("change", updateAnimation);
      document.removeEventListener("visibilitychange", updateAnimation);
    };
  }, [paused]);

  return <canvas ref={canvasRef} className="aqua-current" aria-hidden="true" />;
}
