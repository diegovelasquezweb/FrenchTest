import { useEffect, useRef } from "react";

interface SwipeCardProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  resetKey?: string | number;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const MIN_DISTANCE = 40;
const MAX_TIME_MS = 600;

export function SwipeCard({
  children,
  className,
  "aria-label": ariaLabel,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onSwipeDown,
}: SwipeCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  const hasVertical = !!(onSwipeUp || onSwipeDown);
  const hasCallbacks = !!(onSwipeRight || onSwipeLeft || onSwipeUp || onSwipeDown);

  useEffect(() => {
    const el = divRef.current;
    if (!el || !hasCallbacks) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      start.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    };

    // Non-passive so we can call preventDefault() — prevents the parent
    // overflow-y-auto container from stealing vertical swipes on iOS Safari.
    const onTouchMove = (e: TouchEvent) => {
      if (!start.current || !hasVertical) return;
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      const elapsed = Date.now() - start.current.t;
      start.current = null;

      if (elapsed > MAX_TIME_MS) return;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < MIN_DISTANCE && absY < MIN_DISTANCE) return;

      if (absX >= absY) {
        if (dx > 0) onSwipeRight?.();
        else onSwipeLeft?.();
      } else {
        if (dy > 0) onSwipeDown?.();
        else onSwipeUp?.();
      }
    };

    const onTouchCancel = () => { start.current = null; };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      el.removeEventListener("touchstart",  onTouchStart);
      el.removeEventListener("touchmove",   onTouchMove);
      el.removeEventListener("touchend",    onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [hasCallbacks, hasVertical, onSwipeRight, onSwipeLeft, onSwipeUp, onSwipeDown]);

  return (
    <div
      ref={divRef}
      className={className}
      aria-label={ariaLabel}
      style={{ touchAction: hasVertical ? "none" : hasCallbacks ? "pan-y" : "auto" }}
    >
      {children}
    </div>
  );
}
