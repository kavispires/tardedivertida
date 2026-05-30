import { motion, useScroll, useTransform } from 'motion/react';
import type { CSSProperties } from 'react';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';

type DailyImageBackgroundProps = {
  /**
   * The background variant to use. Use 'dark' for a darker version of the background image.
   */
  backgroundVariant?: 'dark';
};

/**
 * Renders a parallax-scrolling background image for the Daily page.
 * The background scrolls slower than the page for a subtle depth effect.
 */
export function DailyImageBackground({ backgroundVariant }: DailyImageBackgroundProps) {
  const baseUrl = useTDBaseUrl('assets');
  const imageUrl = `${baseUrl}/backgrounds/daily${backgroundVariant ? `-${backgroundVariant}` : ''}.jpg`;

  // Track the scroll percentage (0 at the top, 1 at the bottom)
  const { scrollYProgress } = useScroll();

  // We are adding an extra 20dvh to the height below.
  // Map the scroll progress so the image moves exactly that 20dvh upwards by the time you hit the bottom.
  const y = useTransform(scrollYProgress, [0, 1], ['0dvh', '-20dvh']);

  const backgroundStyle: CSSProperties = {
    position: 'fixed', // Fixed so it acts as a camera window, rather than scrolling away
    top: 0,
    left: 0,
    width: '100vw',
    height: '120dvh', // 100dvh for the screen + 20dvh extra for the parallax bleed
    backgroundImage: `url('${imageUrl}')`,
    backgroundColor: '#1a1a2e',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(1px)',
    opacity: 0.85,
    pointerEvents: 'none',
    willChange: 'transform', // Minor optimization for hardware acceleration
  };

  return <motion.div style={{ ...backgroundStyle, y }} />;
}
