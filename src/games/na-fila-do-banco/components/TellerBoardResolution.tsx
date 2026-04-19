import { motion, AnimatePresence, type MotionProps } from 'motion/react';
import { useState, useEffect } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Components
import { Translate } from 'components/language/Translate';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
// Internal
import type { ClientCard, Teller } from '../utils/types';
import { BankClient } from './BankClient';
import { TellerCard } from './TellerCard';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TellerBoardResolutionProps = {
  teller: Teller;
  deckDict: Dictionary<ClientCard>;
  cardWidth: number;
  animate: boolean;
};

export function TellerBoardResolution({ teller, deckDict, cardWidth, animate }: TellerBoardResolutionProps) {
  const eventId = teller.lastEvent?.eventId;

  // Initialize with the queue before event (all cards) or final queue if not animating
  const [displayQueue, setDisplayQueue] = useState<string[]>(
    animate && teller.lastEvent ? teller.lastEvent.queueBeforeEvent : teller.queue,
  );
  const [showFinalSpeech, setShowFinalSpeech] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only need the eventId
  useEffect(() => {
    // If there's no event, or we've already watched it, ensure we are in the final state and stop.
    if (!teller.lastEvent || !animate) {
      setDisplayQueue(teller.queue);
      return;
    }

    let isMounted = true;
    const { queueBeforeEvent } = teller.lastEvent;

    const playSequence = async () => {
      // Step 1: Show all cards before removal
      setDisplayQueue(queueBeforeEvent);
      setShowFinalSpeech(false);
      await delay(1000); // Let players see the full queue
      if (!isMounted) return;

      // Step 2: Remove cards that exceed capacity (animate them out)
      setDisplayQueue(teller.queue);

      // Wait for the exit animation to finish
      await delay(1500);
      if (!isMounted) return;

      // Step 3: Show "Finally!" speech bubble for all remaining cards
      setShowFinalSpeech(true);
      await delay(2500); // Give players time to read
      if (!isMounted) return;

      setShowFinalSpeech(false);
    };

    playSequence();

    // Cleanup for Strict Mode / fast unmounts
    return () => {
      isMounted = false;
    };
  }, [eventId]); // ONLY run when the specific event ID changes

  const animation: MotionProps = {
    layout: true,
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1 },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -30,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Flex
      className="teller-board-line"
      gap={6}
    >
      <div className="teller-desk">
        <TellerCard
          teller={teller}
          cardWidth={cardWidth}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {displayQueue.map((cardId) => (
          <motion.div
            key={`${teller.id}-${cardId}`}
            {...(animate ? animation : {})}
            style={{ position: 'relative' }}
          >
            <AnimatePresence>
              {showFinalSpeech && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.8 }}
                  className="f-speech-bubble"
                >
                  <FinalScoringSpeech
                    cardId={cardId}
                    deckDict={deckDict}
                    teller={teller}
                    positionInQueue={displayQueue.indexOf(cardId)}
                  />
                  <div className="f-speech-bubble__tail" />
                </motion.div>
              )}
            </AnimatePresence>

            <BankClient
              cardId={cardId}
              deckDict={deckDict}
              cardWidth={cardWidth}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </Flex>
  );
}

type FinalSpeechProps = {
  cardId: string;
  deckDict: Dictionary<ClientCard>;
  teller: Teller;
  positionInQueue: number;
};

function FinalScoringSpeech({ cardId, deckDict, teller, positionInQueue }: FinalSpeechProps) {
  if (cardId.includes('KID')) {
    return (
      <Translate
        en="Mom?"
        pt="Mãe?"
      />
    );
  }

  const isDoubled = teller.doublers.includes(deckDict[cardId].type);
  const points = teller.capacity[positionInQueue] || 0;

  return (
    <PointsHighlight
      iconPlacement="before"
      type={isDoubled ? 'positive' : 'default'}
    >
      {points} {isDoubled && ' × 2'}
    </PointsHighlight>
  );
}
