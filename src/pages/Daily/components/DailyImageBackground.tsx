import { motion, useScroll, useTransform } from 'motion/react';
import type { CSSProperties } from 'react';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';

type DailyImageBackgroundProps = {
  backgroundVariant?: 'dark';
};

export function DailyImageBackground({ backgroundVariant }: DailyImageBackgroundProps) {
  const baseUrl = useTDBaseUrl('assets');

  const imageUrl = `${baseUrl}/backgrounds/daily${backgroundVariant ? `-${backgroundVariant}` : ''}.jpg`;

  const { scrollY } = useScroll();

  // Move background at 0.5x speed for parallax effect
  const y = useTransform(scrollY, (value) => value * 0.5);

  const backgroundStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `url('${imageUrl}')`,
    backgroundColor: '#1a1a2e', // Fallback color
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(1px)',
    opacity: 0.85,
    zIndex: 0,
    pointerEvents: 'none',
  };

  return <motion.div style={{ ...backgroundStyle, y }} />;
}
