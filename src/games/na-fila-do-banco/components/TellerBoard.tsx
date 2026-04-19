import { motion, AnimatePresence, type MotionProps } from 'motion/react';
import { useState, useEffect } from 'react';
// Ant Design Resources
import { Button, Flex } from 'antd';
// Icons
import { ActionAlertIcon } from 'icons/ActionAlertIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import type { ClientCard, Teller } from '../utils/types';
import { CHARACTER_TYPES, TELLER_EFFECT_TYPE } from '../utils/constants';
import { BankClient } from './BankClient';
import { TellerCard } from './TellerCard';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TellerBoardProps = {
  teller: Teller;
  deckDict: Dictionary<ClientCard>;
  cardWidth: number;
  onSelectTeller?: (tellerId: string) => void;
  animate: boolean; // NEW PROP: Whether to animate the queue changes or snap directly to the final state
};

export function TellerBoard({ teller, deckDict, cardWidth, onSelectTeller, animate }: TellerBoardProps) {
  // 1. Check browser memory: Has this specific tab played this event already?
  const eventId = teller.lastEvent?.eventId;

  // 2. Initialize: If no event, OR we already saw it, snap directly to the final queue.
  const [displayQueue, setDisplayQueue] = useState<string[]>(
    animate && teller.lastEvent ? teller.lastEvent.queueBeforeEvent : teller.queue,
  );
  // Add this right below your displayQueue state
  const [activeSpeech, setActiveSpeech] = useState<{ cardId: string; content: React.ReactNode } | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only need the eventId
  useEffect(() => {
    // If there's no event, or we've already watched it, ensure we are in the final state and stop.
    if (!teller.lastEvent || !animate) {
      setDisplayQueue(teller.queue);
      return;
    }

    let isMounted = true;
    const { playedCardId, queueBeforeEvent } = teller.lastEvent;

    const playSequence = async () => {
      // Step 1: Force the snapshot.
      setDisplayQueue(queueBeforeEvent);
      await delay(50); // A short 50ms is usually enough to flush the snapshot to the DOM
      if (!isMounted) return;

      // Step 2: The new card enters
      setDisplayQueue((prev) => [...prev, playedCardId]);

      // Wait for the entrance animation to finish
      await delay(2000);
      if (!isMounted) return;

      // --- NEW: Step 3: First Speech Bubble ---
      let firstSpeech: React.ReactNode = null;
      const effect = teller.lastEvent?.effectType;

      // Safely look up the card definition (adjust this if playedCardId includes a UUID)
      const cardDef = deckDict[playedCardId];
      const cardDetails = CHARACTER_TYPES[cardDef?.type || '']; // e.g., 'GRANDMA', 'TEENAGER', etc.

      if (effect === TELLER_EFFECT_TYPE.BRING_NEXT_TO_ME) {
        firstSpeech = cardDetails?.cutSpeech ? (
          <DualTranslate>{cardDetails?.cutSpeech}</DualTranslate>
        ) : (
          <Translate
            en="Hey, mind if I join you?"
            pt="Ei, posso me juntar a vocês?"
          />
        );
      }

      if (effect === TELLER_EFFECT_TYPE.CUT_IN_FRONT) {
        firstSpeech = cardDetails?.cutSpeech ? (
          <DualTranslate>{cardDetails?.cutSpeech}</DualTranslate>
        ) : (
          <Translate
            en="Excuse me!"
            pt="Com licença!"
          />
        );
      } else if (effect === TELLER_EFFECT_TYPE.STAY) {
        if (cardDetails.id === 'KID') {
          firstSpeech = (
            <Translate
              en="Where am I? Who am I? I'm gonna stay here."
              pt="Onde estou? Quem sou eu? Vou ficar aqui mesmo."
            />
          );
        } else {
          firstSpeech = (
            <Translate
              en="I hope it doesn't take too long."
              pt="Espero que não demore muito."
            />
          );
        }
      } else if (
        effect === TELLER_EFFECT_TYPE.REMOVE_THREE ||
        effect === TELLER_EFFECT_TYPE.BRING_NEXT_TO_ME_AND_REMOVE_THREE
      ) {
        if (cardDetails.id === 'KID') {
          firstSpeech = (
            <Translate
              en="Galerinha, vamos lá fora brincar!"
              pt="Galerinha, vamos lá fora brincar!"
            />
          );
        } else {
          firstSpeech = (
            <>
              <IconAvatar
                size="small"
                icon={<ActionAlertIcon />}
              />
              <Translate
                en="Did you know you can do everything online? Let's go!"
                pt="Vocês sabiam que dá pra fazer tudo online? Vamos lá!"
              />
            </>
          );
        }
      }

      if (firstSpeech) {
        setActiveSpeech({ cardId: playedCardId, content: firstSpeech });
        await delay(4000); // Give the player time to read the bubble
        if (!isMounted) return;

        setActiveSpeech(null); // Hide the bubble
        await delay(300); // Tiny visual pause before the layout shifts
        if (!isMounted) return;
      }

      // --- Step 4 & 5: Snap to the true server state ---
      setDisplayQueue(teller.queue);

      // Wait for Framer Motion's layout shuffle to finish
      await delay(1000);
      if (!isMounted) return;

      // --- NEW: Step 6: The Aftermath Speech ---
      if (effect !== TELLER_EFFECT_TYPE.STAY) {
        setActiveSpeech({
          cardId: playedCardId,
          content: cardDetails?.thankYouSpeech ? (
            <DualTranslate>{cardDetails.thankYouSpeech}</DualTranslate>
          ) : (
            <Translate
              en="Thank you for letting me cut!"
              pt="Obrigado por me deixar passar!"
            />
          ),
        });

        await delay(2500); // Read time
        if (!isMounted) return;

        setActiveSpeech(null);
      }
    };

    playSequence();

    // Cleanup for Strict Mode / fast unmounts
    return () => {
      isMounted = false;
    };
  }, [eventId]); // ONLY run when the specific event ID changes

  const animation: MotionProps = {
    layout: true,
    initial: { opacity: 0, scale: 0.85, x: 100 },
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: -50,
      transition: {
        // 2. The 2-second entrance slide (targets x, opacity, and scale)
        x: { type: 'tween', ease: 'easeOut', duration: 1 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },

        // 3. Keep the snappy spring specifically for when cards shuffle positions
        layout: { type: 'spring', stiffness: 300, damping: 25 },
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

      <AnimatePresence
        mode="popLayout"
        initial={false}
      >
        {displayQueue.map((cardId) => (
          <motion.div
            key={`${teller.id}-${cardId}`} // Use index to allow duplicates, but be cautious of reordering issues
            {...(animate ? animation : {})} // Only apply animation if the prop is true
            style={{ position: 'relative' }}
          >
            {/* Render your actual card here based on the cardId */}
            <AnimatePresence>
              {activeSpeech?.cardId === cardId && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.8 }}
                  className="f-speech-bubble"
                >
                  {activeSpeech.content}

                  {/* Optional: The little speech bubble tail pointing down */}
                  <div className="f-speech-bubble__tail" />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <BankClient
                cardId={cardId}
                deckDict={deckDict}
                cardWidth={cardWidth}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Flex
        className="f-open-teller-slot"
        style={{ width: cardWidth - 12 }}
      >
        {!!onSelectTeller && (
          <Button
            onClick={() => onSelectTeller?.(teller.id)}
            size="small"
            shape="round"
          >
            <Translate
              en="Select Teller"
              pt="Selecionar Caixa"
            />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
