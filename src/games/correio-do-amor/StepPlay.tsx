// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Translate } from 'components/language/Translate';
import { TitledContainer } from 'components/layout/TitledContainer';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { FestaJuninaCard } from './utils/types';
import { getCardKeyFromId } from './utils/helpers';
import { FestaJuninaCardImage } from './components/FestaJuninaCardImage';
import { PilesSummary, Summary } from './components/Summary';
import { PlayArea } from './components/PlayArea';

type StepPlayProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<FestaJuninaCard>;
  turnOrder: GameOrder;
  gameOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  activeEffectKeyword: string | null;
  activePlayerId: UID;
  nextDrawnCardId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  activePlayer: GamePlayer;
  isTheActivePlayer: boolean;
  deck: UID[];
} & Pick<StepProps, 'announcement'>;

export function StepPlay({
  announcement,
  cardsDict,
  user,
  deck,
  turnOrder,
  gameOrder,
  activePlayer,
  players,
  cardsSetAside,
  discardPile,
}: StepPlayProps) {
  const cardWidth = useCardWidth(8, { minWidth: 128 });

  const cardInHand = cardsDict[getCardKeyFromId(user.hand?.[0])];

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Hora do Correio Elegante</>}
          en={<>Elegant Mail Time</>}
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              O objetivo é terminar a rodada com a carta de maior valor na mão. E você consegue isso muito
              mais rápido se você eliminar os outros jogadores. Cada rodada você compra uma carta nova e
              escolhe uma delas para aplicar o efeito!
            </>
          }
          en={
            <>
              The goal is to end the round with the highest value card in hand. And you can achieve that much
              faster if you eliminate the other players. Each round you draw a new card and choose one of them
              to apply the effect!
            </>
          }
        />
      </RuleInstruction>

      <Flex
        justify="center"
        wrap
        gap={16}
      >
        <Summary
          user={user}
          deck={deck}
          players={players}
        />

        <PlayersTurnOrder
          players={players}
          order={turnOrder}
          activePlayerId={activePlayer.id}
        />

        <PilesSummary
          cardsSetAside={cardsSetAside}
          discardPile={discardPile}
        />
      </Flex>

      <PlayArea
        players={players}
        gameOrder={gameOrder}
        activePlayerId={activePlayer.id}
        user={user}
        userArea={
          <TitledContainer
            title={
              <Translate
                pt="Sua mão"
                en="Your hand"
              />
            }
            titleProps={{ size: 'xx-small' }}
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
        }
      />

      <Flex
        wrap
        gap={16}
        justify="center"
      >
        {Object.values(cardsDict)
          .filter((c) => c.count > 0)
          .map((card) => (
            <FestaJuninaCardImage
              key={card.id}
              card={card}
              cardId={card.id}
              width={cardWidth / 2}
            />
          ))}
      </Flex>
    </Step>
  );
}
