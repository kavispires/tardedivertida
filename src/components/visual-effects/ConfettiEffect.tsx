// Sass
import styles from './ConfettiEffect.module.scss';

export function ConfettiEffect() {
  // Generate 50 confetti pieces for a fuller effect
  const confettiPieces = Array.from({ length: 50 }, (_, i) => <span key={i} />);

  return <div className={styles.confetti}>{confettiPieces}</div>;
}
