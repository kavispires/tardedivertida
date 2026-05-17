// Hooks
import { useCountdown } from 'hooks/useCountdown';

type CircularTimerProps = {
  /**
   * Duration in seconds
   */
  duration: number;
  /**
   * Number of segments to display
   */
  segments: number;
  /**
   * Callback function when timer expires
   */
  onExpire: () => void;
};

/**
 * SVG-based circular progress timer with segmented display
 */
export function CircularTimer({ duration, segments, onExpire }: CircularTimerProps) {
  const { timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire,
  });

  // Calculate progress percentage (inverse - starts at 100% and decreases)
  const progress = (timeLeft / duration) * 100;

  // Circle properties
  const size = 220;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate dash array for segments
  const segmentLength = circumference / segments;
  const gapLength = segmentLength * 0.15; // 15% gap between segments
  const dashLength = segmentLength - gapLength;

  // Calculate stroke dash offset based on progress
  const offset = circumference - (circumference * progress) / 100;

  return (
    <div className="circular-timer">
      <svg
        width={size}
        height={size}
        className="circular-timer__svg"
      >
        {/* Background circle (segments outline) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${gapLength}`}
        />

        {/* Progress circle (animated) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(245, 210, 134, 1)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${gapLength}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="circular-timer__progress"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.1s linear',
          }}
        />
      </svg>

      {/* Timer display */}
      <div className="circular-timer__time">{timeLeft}s</div>
    </div>
  );
}
