import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
// Ant Design Resources
import { Button, Flex } from 'antd';
// Components
import { ImageCard } from 'components/image-cards';
// Internal
import type { ClientCard, Teller } from '../utils/types';
import { BankClient } from './BankClient';
import { TellerCard } from './TellerCard';

type TellerBoardProps = {
  teller: Teller;
  deckDict: Dictionary<ClientCard>;
  cardWidth: number;
  onSelectTeller?: (tellerId: string) => void;
};

export function TellerBoard({ teller, deckDict, cardWidth, onSelectTeller }: TellerBoardProps) {
  // We maintain a local queue to sequence the animations
  const [displayQueue, setDisplayQueue] = useState<string[]>(teller.previousQueue);

  useEffect(() => {
    // Step 1: Start with the previous queue
    setDisplayQueue(teller.previousQueue);

    // Step 2: Show the card being inserted (The Cut-in)
    const insertTimer = setTimeout(() => {
      setDisplayQueue(teller.queue);
    }, 1000); // 1 second after phase starts

    // Step 3: Show the resolution (Removal of 3 cards, if any)
    const resolveTimer = setTimeout(() => {
      // Only update if the queue actually changed (meaning someone left the line)
      if (JSON.stringify(teller.queue) !== JSON.stringify(teller.nextQueue)) {
        setDisplayQueue(teller.nextQueue);
      }
    }, 2500); // 2.5 seconds after phase starts

    return () => {
      clearTimeout(insertTimer);
      clearTimeout(resolveTimer);
    };
  }, [teller.previousQueue, teller.queue, teller.nextQueue]);

  return (
    <Flex
      className="teller-window"
      gap={12}
    >
      {/* Teller UI Header (e.g., ATM, Human, Manager) */}
      <div className="teller-desk">
        <TellerCard
          teller={teller}
          cardWidth={cardWidth}
        />
      </div>

      {/* The Queue Container */}

      <AnimatePresence mode="popLayout">
        {displayQueue.map((cardId, index) => (
          <motion.div
            key={cardId} // Crucial: ID must be unique so Framer tracks the specific card
            layout // Tells Framer to animate position changes
            initial={{ opacity: 0, y: 50, scale: 0.8 }} // Entering animation
            animate={{ opacity: 1, y: 0, scale: 1 }} // Idle state
            exit={{ opacity: 0, y: -50, scale: 0.5 }} // "Leaving for the app" animation
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              mass: 20,
            }}
          >
            {/* Render your actual card here based on the cardId */}
            <BankClient
              cardId={cardId}
              deckDict={deckDict}
              cardWidth={cardWidth}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <Flex
        className="f-open-teller-slot"
        style={{ width: cardWidth }}
      >
        {!!onSelectTeller && (
          <Button
            onClick={() => onSelectTeller?.(teller.id)}
            size="small"
            shape="round"
          >
            Select Teller
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
