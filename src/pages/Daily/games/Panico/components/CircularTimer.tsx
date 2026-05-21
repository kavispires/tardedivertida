import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type CircularTimerProps = {
  /**
   * Duration in seconds
   */
  duration: number;
  /**
   *Callback function when timer expiresCallback function when timer expiresCallback function when timer expiresCallback function when timer expires
   */
  timeLeft: number;
  /**
   * Children elements to render inside the timer (e.g. button content)
   */
  children: ReactNode;
  /**
   * Size of the circular timer in pixels (width and height)
   */
  size?: number;
};

/**
 * SVG-based circular progress timer with segmented display
 */
export function CircularTimer({ duration, timeLeft, children, size = 300 }: CircularTimerProps) {
  // We calculate the target for the *next* tick.
  // If timeLeft is 10, targetTimeLeft is 9. It immediately starts sweeping
  // towards 9 over 1 second. This completely eliminates the 1-second lag.
  const targetTimeLeft = Math.max(0, timeLeft - 1);

  // If the timer is actively running, animate to the next tick.
  // If it hits 0, strictly force progress to 0.
  const progress = timeLeft > 0 ? targetTimeLeft / duration : 0;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="timer-wrapper"
      style={{ width: size, height: size }}
    >
      <svg
        className="timer-svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="timer-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#a3e635"
            />
            <stop
              offset="100%"
              stopColor="#4d7c0f"
            />
          </linearGradient>

          <mask id="deplete-mask">
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              stroke="white"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              // initial={0} guarantees it mounts fully drawn and begins moving immediately
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -circumference * (1 - progress) }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </mask>
        </defs>

        {/* 1. Background Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(0, 0, 0, 0.15)"
          strokeWidth="10"
          fill="none"
          strokeDasharray="10 2"
        />

        {/* 2. Foreground Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#timer-grad)"
          strokeWidth="12"
          fill="none"
          strokeDasharray="10 2"
          mask="url(#deplete-mask)"
        />
      </svg>

      {children}
    </div>
  );
}
