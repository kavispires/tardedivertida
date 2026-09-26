import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Divider, Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayerFlex } from '@components/player/PlayerFlex';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { OngoingEffect, FestaJuninaCard } from './utils/types';
import { PLAYER_STATUS, RESOLUTION_KEYWORD } from './utils/constants';
import { useCustomCardWidth } from './utils/useCustomCardWidth';
import { getCardKeyFromId } from './utils/helpers';
import { DeckExplanation } from './components/DeckExplanation';
import { FestaJuninaCardImage } from './components/FestaJuninaCardImage';

type StepRoundResultsProps = {
  players: GamePlayers;
  cardsDict: Dictionary<FestaJuninaCard>;
  ongoingEffects: OngoingEffect[];
  cardsSetAside: UID[];
  goToNextStep: () => void;
  newCardsInDeck: UID[];
} & Pick<StepProps, 'announcement'>;

export function StepRoundResults({
  announcement,
  cardsDict,
  players,
  cardsSetAside,
  ongoingEffects,
  goToNextStep,
  newCardsInDeck,
}: StepRoundResultsProps) {
  const { cardWidth, passiveCardWidth } = useCustomCardWidth();

  const orderPlayersByRank = useMemo(() => {
    return orderBy(
      Object.values(players).filter((player) => player.status !== PLAYER_STATUS.ELIMINATED),
      [(p) => cardsDict[getCardKeyFromId(p.hand?.[0] ?? '')]?.rank ?? 0],
      ['asc'],
    );
  }, [players, cardsDict]);

  const playerWithBonusId =
    ongoingEffects.find((effect) => effect.effectKeyword === RESOLUTION_KEYWORD.GAIN_POINT_ON_ELIMINATION)
      ?.affectedPlayerId ?? null;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Resultados da Rodada"
          en="Round Results"
        />
      </StepTitle>

      <RuleInstruction type="event">
        <Translate
          en="Players that were not eliminated are ranked by the card they have in hand."
          pt="Jogadores que não foram eliminados são ranqueados pela carta que ainda tem em mãos."
        />
      </RuleInstruction>

      <Flex
        justify="center"
        gap={16}
      >
        {orderPlayersByRank.map((player) => {
          const cardInHand = player.hand?.[0] ? cardsDict[getCardKeyFromId(player.hand[0])] : null;

          if (!cardInHand) {
            return null;
          }

          return (
            <PlayerFlex
              key={player.id}
              avatarId={player.avatarId}
              align="center"
              orientation="vertical"
              gap={8}
              className="p-2 border-radius"
            >
              <PlayerAvatarName player={player} />

              <FestaJuninaCardImage
                cardId={cardInHand?.id}
                card={cardInHand}
                width={cardWidth}
              />
            </PlayerFlex>
          );
        })}
      </Flex>

      {playerWithBonusId && (
        <RuleInstruction type="event">
          <Translate
            en="Player {playerName} received a bonus point for having been eliminated while having the Drunk in hand!"
            pt="O jogador {playerName} recebeu um ponto de bônus por ter sido eliminado enquanto tinha o Bêbado na mão!"
            values={{ playerName: <PlayerAvatarName player={players[playerWithBonusId]} /> }}
          />
        </RuleInstruction>
      )}

      <Divider />

      <TitledContainer
        title={
          <Translate
            en="Cards Set Aside"
            pt="Cartas Separadas No Início"
          />
        }
      >
        {cardsSetAside.length > 0 ? (
          <Flex
            justify="center"
            gap={16}
          >
            {cardsSetAside.map((cardId) => {
              const card = cardsDict[getCardKeyFromId(cardId)];
              if (!card) {
                return null;
              }
              return (
                <FestaJuninaCardImage
                  key={card.id}
                  cardId={card.id}
                  card={card}
                  width={passiveCardWidth}
                />
              );
            })}
          </Flex>
        ) : (
          <Translate
            en="No cards were set aside."
            pt="Nenhuma carta foi separada."
          />
        )}
      </TitledContainer>

      <SpaceContainer>
        <TimedButton
          duration={25}
          onExpire={goToNextStep}
          icon={<TrophyOutlined />}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>

      <DeckExplanation
        cardsDict={cardsDict}
        newCardsInDeck={newCardsInDeck}
      />
    </Step>
  );
}
