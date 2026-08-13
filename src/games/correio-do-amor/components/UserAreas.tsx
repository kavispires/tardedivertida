import { motion } from 'motion/react';
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
import { FestaJuninaCardImage } from './FestaJuninaCardImage';

type PlayingUserAreaProps = {
  cardsDict: Dictionary<FestaJuninaCard>;
  cardWidth: number;
  user: GamePlayer;
  nextDrawnCardId: UID;
  onSubmitCard: (payload: SubmitCardPayload) => void;
};

export function PlayingUserArea({
  cardsDict,
  cardWidth,
  user,
  nextDrawnCardId,
  onSubmitCard,
}: PlayingUserAreaProps) {
  const cardInHand = cardsDict[getCardKeyFromId(user.hand?.[0])];
  const drawnCard = cardsDict[getCardKeyFromId(nextDrawnCardId)];

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
        {cardInHand ? (
          <FestaJuninaCardImage
            card={cardInHand}
            cardId={cardInHand.id}
            width={cardWidth}
          />
        ) : (
          <div>?</div>
        )}
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
                  playedCardId: cardInHand.id,
                  keptCardId: drawnCard.id,
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
                    playedCardId: drawnCard.id,
                    keptCardId: cardInHand?.id ?? '',
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
  cardWidth: number;
  user: GamePlayer;
};

export function NonPlayingUserArea({ cardsDict, cardWidth, user }: NonPlayingUserAreaProps) {
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
        {cardInHand ? (
          <FestaJuninaCardImage
            card={cardInHand}
            cardId={cardInHand.id}
            width={cardWidth}
          />
        ) : (
          <div>?</div>
        )}
      </TitledContainer>
    </Flex>
  );
}

type EliminatedUserAreaProps = {
  user: GamePlayer;
};

export function EliminatedUserArea({ user }: EliminatedUserAreaProps) {
  return <>ELIMINATED PLAYER: {user.name}</>;
}
