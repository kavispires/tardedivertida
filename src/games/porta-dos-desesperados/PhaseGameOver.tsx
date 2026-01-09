import { Fragment, useMemo } from 'react';
// Ant Design Resources
import { CaretRightOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { MagicCandlesIcon } from 'icons/MagicCandlesIcon';
import { MagicCultLeaderIcon } from 'icons/MagicCultLeaderIcon';
import { MagicSkullIcon } from 'icons/MagicSkullIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, RuleInstruction, Title } from 'components/text';
// Internal
import { achievementsReference } from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { LoseGameText } from './components/RulesBlobs';
import { DoorFrame } from '../../components/game/DoorFrame';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const isVictory = state.winCondition === 'WIN';
  const doorWidth = useCardWidth(10, {
    gap: 8,
    minWidth: 120,
    maxWidth: 350,
    margin: 8,
  });

  const doors = useMemo(() => {
    return Array(7)
      .fill('')
      .map((_, index) => {
        return (state.doors ?? [])?.[index] ?? '';
      });
  }, [state.doors]);

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={isVictory ? <MagicCultLeaderIcon /> : <MagicSkullIcon />}
      announcementTitle={
        <Translate
          pt="A jornada chegou ao fim!"
          en="The journey has come to an end!"
        />
      }
      announcementContent={<Instruction>...</Instruction>}
    >
      <Title>
        {isVictory ? (
          <Translate
            pt="Conseguimos!"
            en="We did it!"
          />
        ) : (
          <Translate
            pt="Ficamos presos"
            en="We stayed trapped"
          />
        )}
      </Title>

      <SpaceContainer>
        <MagicCandlesIcon style={{ width: '4rem' }} />
      </SpaceContainer>

      <RuleInstruction type="lore">
        {isVictory ? (
          <Translate
            pt="Quando saímos, fomos abordados pelo Líder do Oculto e entramos para um culto de bruxaria!!! Viva!"
            en="As soon as we got out, we were scouted by the Leader of the Occult to join their cult!!! Yay!"
          />
        ) : (
          <LoseGameText players={players} />
        )}
      </RuleInstruction>

      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <Divider />
      <Title size="x-small">
        <Translate
          pt="O corredor"
          en="The Corridor"
        />
      </Title>

      <SpaceContainer wrap>
        {doors.map((doorId: ImageCardId, index, arr) => (
          <Fragment key={doorId || index}>
            <DoorFrame width={doorWidth}>
              <ImageCard
                cardId={doorId || 'back-lockedDoor'}
                cardWidth={150}
              />
            </DoorFrame>
            {index < arr.length - 1 && <CaretRightOutlined />}
          </Fragment>
        ))}
      </SpaceContainer>
    </GameOverWrapper>
  );
}
