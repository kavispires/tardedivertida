import clsx from 'clsx';
import { Fragment } from 'react';
// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Components
import { ImageCardButton } from 'components/image-cards/ImageCardButton';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type { ClientCard } from '../utils/types';
import { CHARACTER_TYPES } from '../utils/constants';
import { BankClient } from './BankClient';
import { DeckColorHighlight, DeckCountHighlight } from './Highlights';

type MyHandProps = {
  user: GamePlayer;
  deckDict: Dictionary<ClientCard>;
  isTheActivePlayer: boolean;
  cardWidth: number;
  onSelectCard?: (cardId: string | null) => void;
  selectedCardId?: string | null;
  drawDeck: UID[];
};

export function MyHand({
  user,
  deckDict,
  isTheActivePlayer,
  cardWidth,
  onSelectCard,
  selectedCardId,
  drawDeck,
}: MyHandProps) {
  const showActions = isTheActivePlayer && !!onSelectCard;
  return (
    <Instruction contained>
      <Flex
        className="full-width mb-2"
        justify="space-between"
        align="center"
      >
        <Tooltip
          title={
            <Translate
              en="This is your deck color. You only score if these colors of cards make it to the teller"
              pt="Esta é a cor do seu baralho. Você só pontua se estas cores de cartas chegarem ao caixa"
            />
          }
        >
          <div>
            <DeckColorHighlight color={user?.deckColor} />
          </div>
        </Tooltip>
        <Flex
          className="full-width"
          justify="center"
        >
          <strong>
            <Translate
              pt="Suas Cartas"
              en="Your Cards"
            />
          </strong>
        </Flex>

        <Tooltip
          title={
            <Translate
              en="The number of cards left in the draw deck. The round goes until the deck is empty and everybody only have 1 card left."
              pt="O número de cartas restantes no baralho. A rodada continua até o baralho ficar vazio e todos terem apenas 1 carta restante."
            />
          }
        >
          <div>
            <DeckCountHighlight>{drawDeck.length}</DeckCountHighlight>
          </div>
        </Tooltip>
      </Flex>

      <Flex gap={6}>
        {user?.hand?.map((cardId: string) => (
          <Fragment key={cardId}>
            <ViewIf condition={!showActions}>
              <Tooltip
                title={<DualTranslate>{CHARACTER_TYPES[deckDict[cardId].type].description}</DualTranslate>}
              >
                <div>
                  <BankClient
                    cardId={cardId}
                    deckDict={deckDict}
                    cardWidth={cardWidth}
                  />
                </div>
              </Tooltip>
            </ViewIf>

            <ViewIf condition={showActions}>
              <ImageCardButton
                cardId={deckDict[cardId].imageId}
                onClick={() => onSelectCard?.(cardId)}
              >
                <Tooltip
                  title={<DualTranslate>{CHARACTER_TYPES[deckDict[cardId].type].description}</DualTranslate>}
                >
                  <div>
                    <BankClient
                      cardId={cardId}
                      deckDict={deckDict}
                      cardWidth={cardWidth}
                      className={clsx({ 'f-selected-card': selectedCardId === cardId })}
                    />
                  </div>
                </Tooltip>
              </ImageCardButton>
            </ViewIf>
          </Fragment>
        ))}
      </Flex>
    </Instruction>
  );
}
