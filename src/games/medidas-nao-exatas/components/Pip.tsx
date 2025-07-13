import { motion } from 'framer-motion';

type PipProps = {
  position: number;
  value: number;
};

export function Pip({ position, value }: PipProps) {
  return (
    <motion.div
      className="metrics-board__evaluation-pip"
      layoutId="item"
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      animate={{
        left: value > position ? `${position * 1.5}rem` : 'auto',
        right: value <= position ? `${(6 - position - 1) * 1.5}rem` : 'auto',
      }}
    />
  );
}
