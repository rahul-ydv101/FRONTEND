"use client";

import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, motion, useTransform, useSpring } from 'framer-motion';

// Folder configuration mapping. Change counts here to match the exact number of frames in each folder.
export const SEQUENCE_CONFIG = [
  { folder: 'part1', count: 240 },
  { folder: 'part2', count: 240 },
  { folder: 'part3', count: 240 },
  { folder: 'part4', count: 240 },
  { folder: 'part5', count: 240 },
];

const totalFrames = SEQUENCE_CONFIG.reduce((acc, part) => acc + part.count, 0);

// Find which folder and frame index corresponds to the global frame index
export const getFrameInfo = (globalIndex: number) => {
  let currentAccumulated = 0;
  for (let i = 0; i < SEQUENCE_CONFIG.length; i++) {
    const part = SEQUENCE_CONFIG[i];
    if (globalIndex < currentAccumulated + part.count) {
      const frameInFolder = globalIndex - currentAccumulated + 1;
      return {
        folder: part.folder,
        frameNum: String(frameInFolder).padStart(3, '0'),
        partIndex: i
      };
    }
    currentAccumulated += part.count;
  }
  // Fallback to last frame
  const lastPart = SEQUENCE_CONFIG[SEQUENCE_CONFIG.length - 1];
  return { folder: lastPart.folder, frameNum: String(lastPart.count).padStart(3, '0'), partIndex: SEQUENCE_CONFIG.length - 1 };
};

export default function ScrollytellingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll value to prevent jarring fast-forwarding during aggressive scrolling
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preload images
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < totalFrames; i++) {
      const { folder, frameNum } = getFrameInfo(i);
      const img = new Image();
      img.src = `/${folder}/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        if (isCancelled) return;
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);

    return () => {
      isCancelled = true;
    };
  }, []);

  const drawFrame = (index: number) => {
    if (!canvasRef.current || !images[index]) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const img = images[index];
    const canvas = canvasRef.current;
    
    // Fit image to canvas maintaining aspect ratio (cover)
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;  
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Black is drawn via bg-black globally
    ctx.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);  
  };

  // Setup Canvas and initial frame
  useEffect(() => {
    if (loaded && canvasRef.current) {
      const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            // redraw current frame
            const currentGlobalIndex = Math.floor(scrollYProgress.get() * (totalFrames - 1));
            drawFrame(currentGlobalIndex);
        }
      };

      handleResize(); // trigger once to setup size
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [loaded, scrollYProgress, images]);

  // Handle Scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!loaded) return;
    const frameIndex = Math.floor(latest * (totalFrames - 1));
    drawFrame(frameIndex);
  });

  return (
    <div ref={containerRef} className="relative h-[1500vh] w-full bg-black">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black">
              <span className="animate-pulse tracking-widest uppercase font-mono text-sm text-green-500/80 mb-4">
                  Sequence Initiating...
              </span>
              <div className="w-48 h-1 bg-white/10 rounded overflow-hidden">
                  <div className="h-full bg-green-500/80 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="block w-full h-full object-cover"
        />
        
        {loaded && <OverlayContent scrollYProgress={scrollYProgress} />}
      </div>
    </div>
  );
}

function OverlayContent({ scrollYProgress }: { scrollYProgress: any }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
       <TextOverlay chunk={0} scrollYProgress={scrollYProgress} title="Dr. Elena Carter" subtitle="Kernel Architecture" desc="Optimizing the core memory manager for zero-latency I/O." />
       <TextOverlay chunk={1} scrollYProgress={scrollYProgress} title="Marcus Vance" subtitle="Distributed Systems" desc="Scaling consensus algorithms across global nodes." />
       <TextOverlay chunk={2} scrollYProgress={scrollYProgress} title="Aisha Rahman" subtitle="Cryptography" desc="Pioneering quantum-resistant encryption layers." />
       <TextOverlay chunk={3} scrollYProgress={scrollYProgress} title="Chen Wei" subtitle="Neural Networks" desc="Architecting highly redundant parallel training pipelines." />
       <TextOverlay chunk={4} scrollYProgress={scrollYProgress} title="Dr. Isaac Vane" subtitle="System Integration" desc="Merging all disciplines into the mainframe singularity." />
    </div>
  )
}

function TextOverlay({ chunk, scrollYProgress, title, subtitle, desc }: any) {
  // Total 5 chunks mapping 0-1 progress
  const start = chunk * 0.2;
  const end = start + 0.2;

  const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, end], [50, -50]);

  return (
    <motion.div 
      style={{ opacity, y }}
      className="absolute flex flex-col items-center justify-center text-center p-8 bg-transparent w-[90%] max-w-2xl drop-shadow-lg"
    >
        <p className="text-green-500/80 font-mono text-sm tracking-widest uppercase mb-3">Subject {chunk + 1} // {subtitle}</p>
        <h2 className="text-white/90 text-4xl md:text-7xl font-epic uppercase tracking-tighter mb-4 [-webkit-text-stroke:2px_rgba(255,255,255,0.9)]">{title}</h2>
        <p className="text-white/60 font-mono text-base md:text-lg">{desc}</p>
    </motion.div>
  )
}
