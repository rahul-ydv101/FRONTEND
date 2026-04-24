"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis for buttery smooth momentum scrolling
    const lenis = new Lenis({
      lerp: 0.04, // Lower value creates maximum smoothness and a heavier, slower drag.
      wheelMultiplier: 0.7, // Only scroll 70% of the normal speed to drastically slow down progression
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    // Start the animation frame loop
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  // Return the children identically, Lenis hooks into the window natively.
  return <>{children}</>;
}
