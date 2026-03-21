import { useEffect, useRef, useState } from 'react';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';

type SpaceFloatProps = {
  /**
   * Whether the floating behavior is enabled
   */
  enabled?: boolean;
} & SpaceProps;

/**
 * A Space component that automatically floats fixed to the bottom of the screen
 * when it would otherwise be out of bounds vertically.
 */
export function SpaceFloat({ children, enabled = true, ...rest }: SpaceFloatProps) {
  const spaceRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsFloating(false);
      return;
    }

    const checkPosition = () => {
      if (!spaceRef.current) return;

      const rect = spaceRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if the bottom of the element is below the viewport
      const shouldFloat = rect.bottom > windowHeight;
      setIsFloating(shouldFloat);
    };

    // Check position on mount and when window resizes or scrolls
    checkPosition();
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);

    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [enabled]);

  return (
    <div
      ref={spaceRef}
      style={{ marginTop: isFloating ? '2rem' : 0 }}
    >
      <Space
        {...rest}
        style={{
          ...rest.style,
          ...(isFloating && {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: '1rem',
            backgroundColor: 'var(--background-color, white)',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
          }),
        }}
      >
        {children}
      </Space>
    </div>
  );
}
