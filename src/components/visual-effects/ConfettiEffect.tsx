// Sass
import './ConfettiEffect.scss';

export function ConfettiEffect() {
  // Generate 50 confetti pieces for a fuller effect
  const confettiPieces = Array.from({ length: 50 }, (_, i) => <span key={i} />);

  return <div className="confetti">{confettiPieces}</div>;
}
