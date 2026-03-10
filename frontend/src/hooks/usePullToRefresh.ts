import { useEffect, useRef, useState } from "react";

interface Options {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function usePullToRefresh({ onRefresh, threshold = 72 }: Options) {
  const [pulling, setPulling]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY]         = useState(0);

  const startY   = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const el = document.scrollingElement || document.documentElement;

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop > 0) return;
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta < 0) { setPullY(0); return; }
      // Rubber-band resistance — feels native
      const resistance = Math.min(delta * 0.45, threshold + 20);
      setPullY(resistance);
      setPulling(resistance >= threshold);
      if (resistance > 8) e.preventDefault();
    };

    const onTouchEnd = async () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (pulling) {
        setRefreshing(true);
        setPullY(40); // snap to spinner height
        try { await onRefresh(); } finally {
          setRefreshing(false);
          setPulling(false);
          setPullY(0);
        }
      } else {
        setPullY(0);
        setPulling(false);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("touchend",   onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [onRefresh, pulling, refreshing, threshold]);

  return { pulling, refreshing, pullY };
}
