"use client";

import React, { useEffect, useRef } from "react";

interface PixelCanvasProps {
  className?: string;
  gap?: number;
  glowRadius?: number;
  baseColor?: string;
  glowColor?: string;
  pixelSize?: number;
}

export function PixelCanvas({
  className = "",
  gap = 24,
  glowRadius = 200,
  baseColor = "rgba(255, 255, 255, 0.04)",
  glowColor = "rgba(255, 255, 255, 0.3)",
  pixelSize = 1.5,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };
    let targetMouse = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;

    const resize = () => {
      // Use parent node dimensions to support absolute positioned canvas
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = e.clientY - rect.top;
    };

    // Track mouse globally so the canvas can have pointer-events-none
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    
    resize();

    const draw = () => {
      // Lerp mouse position for smooth trailing effect
      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const columns = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      // Draw grid
      for (let i = 0; i <= columns; i++) {
        for (let j = 0; j <= rows; j++) {
          const px = i * gap;
          const py = j * gap;

          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Calculate opacity based on distance to mouse
          let opacity = 0;
          if (distance < glowRadius) {
            opacity = 1 - Math.pow(distance / glowRadius, 1.5); // non-linear falloff for a softer glow
          }

          // Apply color based on distance
          if (opacity > 0) {
            ctx.fillStyle = glowColor;
            ctx.globalAlpha = opacity;
          } else {
            ctx.fillStyle = baseColor;
            ctx.globalAlpha = 1;
          }

          // Draw the pixel (small rectangle)
          // Center the pixel on the grid intersection
          ctx.fillRect(px - pixelSize / 2, py - pixelSize / 2, pixelSize, pixelSize);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gap, glowRadius, baseColor, glowColor, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
