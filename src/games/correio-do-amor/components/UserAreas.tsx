import { motion, AnimatePresence } from 'motion/react';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { Popconfirm } from '@components/general/Popconfirm';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
// Internal
import type { FestaJuninaCard, SubmitCardPayload } from '../utils/types';
import { getCardKeyFromId } from '../utils/helpers';
import { useCustomCardWidth } from '../utils/useCustomCardWidth';
import { FestaJuninaCardImage } from './FestaJuninaCardImage';

type PlayingUserAreaProps = {
  cardsDict: Dictionary<FestaJuninaCard>;
  user: GamePlayer;
  nextDrawnCardId: UID;
  onSubmitCard: (payload: SubmitCardPayload) => void;
};

export function PlayingUserArea({ cardsDict, user, nextDrawnCardId, onSubmitCard }: PlayingUserAreaProps) {
  const { cardWidth } = useCustomCardWidth();

  const cardInHandId: string = user.hand?.[0];
  const drawnCardId = nextDrawnCardId;
  const cardInHand = cardsDict[getCardKeyFromId(cardInHandId)];
  const drawnCard = cardsDict[getCardKeyFromId(drawnCardId)];

  // Verify FORCE_PLAY
  const [disableLeft, disableRight] = useMemo(() => {
    if (!cardInHand || !drawnCard) {
      return [true, true];
    }

    // If neither card is FORCE_PLAY, enable both buttons
    if (cardInHand.keyword !== 'FORCE_PLAY' && drawnCard.keyword !== 'FORCE_PLAY') {
      return [false, false];
    }

    // If the card in hand is FORCE_PLAY
    if (cardInHand.keyword === 'FORCE_PLAY') {
      // If the other card is rank higher than 5, disable the drawn card button
      if (drawnCard.rank >= 6) {
        return [false, true];
      }
    }

    // If the drawn card is FORCE_PLAY
    if (drawnCard.keyword === 'FORCE_PLAY') {
      // If the other card is rank higher than 5, disable the card in hand button
      if (cardInHand.rank >= 6) {
        return [true, false];
      }
    }

    return [false, false];
  }, [cardInHand, drawnCard]);

  return (
    <Flex gap={12}>
      <TitledContainer
        title={
          <Translate
            pt="Sua mão"
            en="Your hand"
          />
        }
        titleProps={{ size: 'xx-small', colorScheme: 'light' }}
      >
        <AnimatePresence mode="wait">
          {cardInHand ? (
            <motion.div
              key={cardInHand.id}
              layoutId={cardInHand.id}
              layout
              initial={{ opacity: 0, x: cardWidth }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { type: 'spring', stiffness: 300, damping: 25 },
              }}
              exit={{
                opacity: 0,
                x: -cardWidth,
                transition: { duration: 0.2 },
              }}
            >
              <FestaJuninaCardImage
                card={cardInHand}
                cardId={cardInHand.id}
                width={cardWidth}
              />
            </motion.div>
          ) : (
            <div>?</div>
          )}
        </AnimatePresence>
        <Popconfirm
          type="yes-no"
          title={
            <Translate
              pt="Tem certeza que deseja jogar esta carta?"
              en="Are you sure you want to play this card?"
            />
          }
          onConfirm={() => {
            if (cardInHand) {
              onSubmitCard({
                payload: {
                  playedCardId: cardInHandId,
                  keptCardId: drawnCardId,
                  playedEffect: cardInHand.keyword,
                },
              });
            }
          }}
        >
          <SendButton disabled={disableLeft}>
            <Translate
              pt="Jogar carta"
              en="Play card"
            />
          </SendButton>
        </Popconfirm>
      </TitledContainer>
      {drawnCard && (
        <TitledContainer
          title={
            <Translate
              pt="Sua nova carta"
              en="Your new card"
            />
          }
          titleProps={{ size: 'xx-small', colorScheme: 'light' }}
        >
          <motion.div
            initial={{ opacity: 0, x: cardWidth }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 3 }}
            layoutId={drawnCardId}
          >
            <FestaJuninaCardImage
              card={drawnCard}
              cardId={drawnCard.id}
              width={cardWidth}
            />
          </motion.div>

          <Popconfirm
            type="yes-no"
            title={
              <Translate
                pt="Tem certeza que deseja jogar esta carta?"
                en="Are you sure you want to play this card?"
              />
            }
            onConfirm={() => {
              if (drawnCard) {
                onSubmitCard({
                  payload: {
                    playedCardId: drawnCardId,
                    keptCardId: cardInHandId ?? '',
                    playedEffect: drawnCard.keyword,
                  },
                });
              }
            }}
          >
            <SendButton disabled={disableRight}>
              <Translate
                pt="Jogar carta"
                en="Play card"
              />
            </SendButton>
          </Popconfirm>
        </TitledContainer>
      )}
    </Flex>
  );
}

type NonPlayingUserAreaProps = {
  cardsDict: Dictionary<FestaJuninaCard>;
  user: GamePlayer;
};

export function NonPlayingUserArea({ cardsDict, user }: NonPlayingUserAreaProps) {
  const { passiveCardWidth } = useCustomCardWidth();

  const cardInHand = cardsDict[getCardKeyFromId(user.hand?.[0])];
  return (
    <Flex gap={12}>
      <TitledContainer
        title={
          <Translate
            pt="Sua mão"
            en="Your hand"
          />
        }
        titleProps={{ size: 'xx-small', colorScheme: 'light' }}
      >
        <AnimatePresence mode="wait">
          {cardInHand ? (
            <motion.div
              key={cardInHand.id}
              layoutId={cardInHand.id}
              layout
              initial={{ opacity: 0, x: passiveCardWidth }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { type: 'spring', stiffness: 300, damping: 25 },
              }}
              exit={{
                opacity: 0,
                x: -passiveCardWidth,
                transition: { duration: 0.2 },
              }}
            >
              <FestaJuninaCardImage
                card={cardInHand}
                cardId={cardInHand.id}
                width={passiveCardWidth}
              />
            </motion.div>
          ) : (
            <div>?</div>
          )}
        </AnimatePresence>
      </TitledContainer>
    </Flex>
  );
}

export function EliminatedUserArea() {
  return (
    <Translate
      en="You have been eliminated from this round."
      pt="Você foi eliminado desta rodada."
    />
  );
}
