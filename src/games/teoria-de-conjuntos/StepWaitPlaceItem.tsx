// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
import type { ItemData } from 'types/tdr';
// Hooks
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { DiagramArea, DiagramExamples, Solutions } from './utils/types';
import { getPlayerItemsLeft } from './utils/helper';
import { DiagramRules } from './components/RulesBlobs';
import { MyThings } from './components/MyThings';
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
  isTheJudge: boolean;
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
  isTheJudge,
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
        {activePlayer ? (
          <Translate
            pt="O Juiz {player} vai colocar um item no lugar correto para ajudar"
            en="Judge {player} will place an item correctly to help"
            values={{
              player: <PlayerAvatarName player={activePlayer} />,
            }}
          />
        ) : (
          <Translate
            pt="{player} vai posicionar uma coisa"
            en="{player} will place an item"
            values={{
              player: <PlayerAvatarName player={activePlayer} />,
            }}
          />
        )}
      </StepTitle>

      <RoundAlert round={round} />

      <DiagramRules examples={examples} />

      <DiagramSection
        width={width}
        diagrams={diagrams}
        items={items}
        solutions={isTheJudge ? solutions : undefined}
      >
        <MyThings
          hand={user.hand ?? []}
          items={items}
          total={targetItemCount}
          maxHeight={width * (diagrams?.C ? 1 : 0.7)}
        />
      </DiagramSection>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        additionalInfoParser={getPlayerItemsLeft}
      />
    </Step>
  );
}
