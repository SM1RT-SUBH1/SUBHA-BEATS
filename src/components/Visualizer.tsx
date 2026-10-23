import React, { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';

interface VisualizerProps {
  className?: string;
  barCount?: number;
  mode?: 'bars' | 'wave' | 'circle';
  height?: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({ 
  className = '', 
  barCount = 32, 
  mode = 'bars',
  height = 48 
}) => {
  const { visualizerData, isPlaying } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, width, h);

    if (mode === 'bars') {
      const sliceWidth = width / barCount;
      const barWidth = Math.max(2, sliceWidth - 2.5);

      for (let i = 0; i < barCount; i++) {
        const val = visualizerData[i % visualizerData.length] || 15;
        const barHeight = (val / 100) * (h * 0.85);
        const x = i * sliceWidth + 1;
        const y = h - barHeight;

        // Gradient for Aceternity neon aesthetic
        const gradient = ctx.createLinearGradient(0, y, 0, h);
        if (isPlaying) {
          gradient.addColorStop(0, '#06B6D4'); // cyan
          gradient.addColorStop(0.5, '#A855F7'); // neon purple
          gradient.addColorStop(1, '#6366F1'); // indigo
        } else {
          gradient.addColorStop(0, '#4B5563');
          gradient.addColorStop(1, '#1F2937');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Rounded top bars
        const radius = Math.min(barWidth / 2, 4);
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();

        // Neon Glow effect
        if (isPlaying && (i % 4 === 0 || val > 65)) {
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
      }
    } else if (mode === 'wave') {
      ctx.beginPath();
      ctx.lineWidth = 3;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(0.5, '#06B6D4');
      gradient.addColorStop(1, '#EC4899');
      ctx.strokeStyle = gradient;

      const sliceWidth = width / (visualizerData.length - 1);
      let x = 0;

      for (let i = 0; i < visualizerData.length; i++) {
        const v = visualizerData[i] / 100;
        const y = (h / 2) + (v - 0.5) * h * 0.7;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
    }
  }, [visualizerData, isPlaying, barCount, mode]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={320} 
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};
