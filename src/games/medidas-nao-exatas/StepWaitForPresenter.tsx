import { AnimatePresence, motion } from 'motion/react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { TextCard } from 'types/tdr';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { Translate } from 'components/language/Translate';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { TurnOrder } from 'components/players/TurnOrder';
import { WaitingRoom } from 'components/players/WaitingRoom';
import { Step, type StepProps } from 'components/steps/Step';

type StepWaitForPresenterProps = {
  players: GamePlayers;
  presenter: GamePlayer;
  turnOrder: UID[];
  wordsDict: Dictionary<TextCard>;
  poolIds?: UID[];
} & Pick<StepProps, 'announcement'>;

export function StepWaitForPresenter({
  players,
  presenter,
  turnOrder,
  poolIds,
  wordsDict,
  announcement,
}: StepWaitForPresenterProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <WaitingRoom
        players={players}
        title={
          <Translate
            pt={
              <>
                Aguarde enquanto <PlayerAvatarName player={presenter} /> cria as métricas.
              </>
            }
            en={
              <>
                Wait while <PlayerAvatarName player={presenter} /> creates the metrics.
              </>
            }
          />
        }
        instruction={
          poolIds ? (
            <RoundsPool
              poolIds={poolIds}
              wordsDict={wordsDict}
            />
          ) : (
            <div>...</div>
          )
        }
      ></WaitingRoom>

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={presenter.id}
      />
    </Step>
  );
}
function RoundsPool({ poolIds, wordsDict }: Pick<StepWaitForPresenterProps, 'poolIds' | 'wordsDict'>) {
  return (
    <AnimatePresence>
      <Translate
        pt={<>Palavras disponíveis para a rodada:</>}
        en={<>Available words for the round:</>}
      />
      <Flex wrap>
        {poolIds?.map((cardId, index) => {
          const card = wordsDict[cardId];
          return (
            <motion.div
              key={cardId}
              className="pool-card"
              {...getAnimation('fadeIn', { delay: index * 0.1 })}
            >
              {card.text}
            </motion.div>
          );
        })}
      </Flex>
    </AnimatePresence>
  );
}
