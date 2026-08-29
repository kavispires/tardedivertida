import { motion } from 'motion/react';
// Internal
import type { FestaJuninaCard } from '../utils/types';
import { FestaJuninaCardImage } from './FestaJuninaCardImage';

type PlayedCardAnimationProps = {
  playedCard: FestaJuninaCard;
  cardWidth: number;
  animation: 'pendulum' | false;
};

export function PlayedCardAnimation({ playedCard, cardWidth, animation }: PlayedCardAnimationProps) {
  return (
    <motion.div
      layoutId="played-card"
      transition={cardTransition} // Apply the smooth transition
    >
      <motion.div {...(animation === 'pendulum' ? pendulumAnimation : {})}>
        <FestaJuninaCardImage
          card={playedCard}
          cardId={playedCard.id}
          width={cardWidth}
        />
      </motion.div>
    </motion.div>
  );
}

const pendulumAnimation = {
  animate: { rotate: [-6, 6, -6] },
  transition: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' as const },
  style: { transformOrigin: 'top center' },
};

const cardTransition = {
  type: 'spring' as const,
  stiffness: 250, // Higher = faster/tighter spring
  damping: 25, // Higher = less bounce at the end
  mass: 1, // Weight of the card
};
