// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
import type { ItemData } from 'types/tdr';
// Hooks
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
// Components
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { DiagramArea, DiagramExamples, Solutions } from './utils/types';
import { getPlayerItemsLeft } from './utils/helper';
import { DiagramRules } from './components/RulesBlobs';
import { MyThings } from './components/MyThings';
import { Solution } from './components/Solution';
import { DiagramSection } from './components/DiagramSection';
import { RoundAlert } from './components/RoundAlert';

type StepWaitPlaceItemProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<ItemData>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  isJudge: boolean;
  solutions: Solutions;
  targetItemCount: number;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepWaitPlaceItem({
  players,
  user,
  announcement,
  examples,
  diagrams,
  items,
  turnOrder,
  activePlayer,
  isJudge,
  solutions,
  targetItemCount,
  round,
}: StepWaitPlaceItemProps) {
  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <div
        ref={ref}
        style={{ width: '100%' }}
      />
      <StepTitle wait>
        <Translate
          pt={
            <>
              <PlayerAvatarName player={activePlayer} /> vai posicionar uma coisa
            </>
          }
          en={
            <>
              <PlayerAvatarName player={activePlayer} /> will place an item
            </>
          }
        />{' '}
      </StepTitle>

      <RoundAlert round={round} />

      <DiagramRules examples={examples} />

      <DiagramSection
        width={width}
        diagrams={diagrams}
        items={items}
      />

      {!isJudge && (
        <MyThings
          hand={user.hand ?? []}
          items={items}
          total={targetItemCount}
        />
      )}

      {isJudge && (
        <TitledContainer
          contained
          title={
            <Translate
              pt="As Regras Secretas"
              en="The Secret Rules"
            />
          }
          contentProps={{ orientation: 'vertical' }}
        >
          <Translate
            pt="Essas são as regras secretas de cada círculo, não fale elas com ninguém."
            en="These are the secret rules of each circle, don't tell them to anyone."
          />

          <Solution solutions={solutions} />
        </TitledContainer>
      )}

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        additionalInfoParser={getPlayerItemsLeft}
      />
    </Step>
  );
}
