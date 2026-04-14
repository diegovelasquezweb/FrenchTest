import { useRef } from "react";

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

const MIN_DISTANCE = 45;
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
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") return;
        start.current = { x: e.clientX, y: e.clientY, t: Date.now() };
      }}
      onPointerUp={(e) => {
        if (!start.current || e.pointerType === "mouse") return;
        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;
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
      }}
      onPointerCancel={() => { start.current = null; }}
    >
      {children}
    </div>
  );
}
