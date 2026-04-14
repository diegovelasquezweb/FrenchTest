import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

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

const OFFSET_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 400;
const EXIT_DURATION = 250;

function isTouchDevice() {
  return typeof window !== "undefined" && (
    "ontouchstart" in window || navigator.maxTouchPoints > 0
  );
}

export function SwipeCard({
  children,
  className,
  "aria-label": ariaLabel,
  resetKey,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onSwipeDown,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const touchOnly = useRef(isTouchDevice());

  useLayoutEffect(() => {
    x.set(0);
    y.set(0);
  }, [resetKey, x, y]);

  const hasCallbacks = !!(onSwipeRight || onSwipeLeft || onSwipeUp || onSwipeDown);
  const dragEnabled = hasCallbacks && touchOnly.current;
  const dragAxis = onSwipeUp ?? onSwipeDown ? true : "x";

  return (
    <motion.div
      drag={dragEnabled ? dragAxis : false}
      style={{ x, y }}
      onDragEnd={(_, info) => {
        const { offset, velocity } = info;

        if (onSwipeRight && (offset.x > OFFSET_THRESHOLD || velocity.x > VELOCITY_THRESHOLD)) {
          void animate(x, 600, { duration: EXIT_DURATION / 1000, ease: "easeOut" });
          setTimeout(onSwipeRight, EXIT_DURATION);
          return;
        }
        if (onSwipeLeft && (offset.x < -OFFSET_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD)) {
          void animate(x, -600, { duration: EXIT_DURATION / 1000, ease: "easeOut" });
          setTimeout(onSwipeLeft, EXIT_DURATION);
          return;
        }
        if (onSwipeDown && (offset.y > OFFSET_THRESHOLD || velocity.y > VELOCITY_THRESHOLD)) {
          void animate(y, 600, { duration: EXIT_DURATION / 1000, ease: "easeOut" });
          setTimeout(onSwipeDown, EXIT_DURATION);
          return;
        }
        if (onSwipeUp && (offset.y < -OFFSET_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD)) {
          void animate(y, -600, { duration: EXIT_DURATION / 1000, ease: "easeOut" });
          setTimeout(onSwipeUp, EXIT_DURATION);
          return;
        }

        void animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
        void animate(y, 0, { type: "spring", stiffness: 300, damping: 25 });
      }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}
