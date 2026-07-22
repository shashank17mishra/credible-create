"use client";

import React, { useRef, useEffect } from "react";

interface ChromaKeyVideoProps {
  src: string;
  className?: string;
}

export default function ChromaKeyVideo({ src, className }: ChromaKeyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;

    const processFrame = () => {
      if (video.paused || video.ended) {
        animId = requestAnimationFrame(processFrame);
        return;
      }

      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;

        // Key out green screen pixels
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Green keying threshold: dominant green component
          if (g > 60 && g > r * 1.15 && g > b * 1.15) {
            const maxOther = Math.max(r, b);
            const diff = g - maxOther;
            if (diff > 35) {
              data[i + 3] = 0; // Make pixel completely transparent
            } else {
              // Smooth edge spill suppression
              data[i + 3] = Math.max(0, Math.floor(255 - diff * 7));
            }
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      animId = requestAnimationFrame(processFrame);
    };

    video.play().catch((e) => console.warn("Video play error:", e));
    processFrame();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [src]);

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
