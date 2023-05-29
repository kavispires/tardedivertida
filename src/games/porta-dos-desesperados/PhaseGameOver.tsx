import { Fragment, useMemo } from 'react';
// Ant Design Resources
import { Divider, Space } from 'antd';
// Utils
import { achievementsReference } from './utils/achievements';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { MagicCultLeaderIcon } from 'icons/MagicCultLeaderIcon';
import { MagicSkullIcon } from 'icons/MagicSkullIcon';
import { MagicCandlesIcon } from 'icons/MagicCandlesIcon';
// Components
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { GameOverWrapper } from 'components/game-over';
import { LoseGameText } from './components/RulesBlobs';
import { Achievements } from 'components/general/Achievements';
import { DoorFrame } from './components/DoorFrame';
import { ImageCard } from 'components/cards';
import { CaretRightOutlined } from '@ant-design/icons';

function PhaseGameOver({ players, state, info }: PhaseProps) {
  const isVictory = state.winCondition === 'WIN';
  const doorWidth = useCardWidth(10, 8, 120, 350, 8);

  const doors = useMemo(() => {
    return Array(7)
      .fill('')
      .map((_, index) => {
        return (state.doors ?? [])?.[index] ?? '';
      });
  }, [state.doors]);

  return (
    <GameOverWrapper
      info={info}
      state={state}
      players={players}
      announcementIcon={isVictory ? <MagicCultLeaderIcon /> : <MagicSkullIcon />}
      announcementTitle={<Translate pt="A jornada chegou ao fim!" en="The journey has come to an end!" />}
      announcementContent={<Instruction>...</Instruction>}
    >
      <Title white>
        {isVictory ? (
          <Translate pt="Conseguimos!" en="We did it!" />
        ) : (
          <Translate pt="Ficamos presos" en="We stayed trapped" />
        )}
      </Title>

      <Space className="space-container">
        <MagicCandlesIcon style={{ width: '4rem' }} />
      </Space>

      <Instruction contained>
        {isVictory ? (
          <Translate
            pt="Quando saímos, formos abortados pelo Líder do Oculto e entramos para um culto de bruxaria!!! Viva!"
            en="As soon as we got out, we were scouted by the Leader of the Occult to join their cult!!! Yay!"
          />
        ) : (
          <LoseGameText players={players} />
        )}
      </Instruction>

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <>
        <Divider />
        <Title size="x-small">
          <Translate pt="O corredor" en="The Corridor" />
        </Title>
        {
          <Space wrap className="space-container">
            {doors.map((doorId: ImageCardId, index, arr) => (
              <Fragment key={doorId || index}>
                <DoorFrame width={doorWidth}>
                  <ImageCard imageId={doorId || 'back-lockedDoor'} cardWidth={150} />
                </DoorFrame>
                {index < arr.length - 1 && <CaretRightOutlined />}
              </Fragment>
            ))}
          </Space>
        }
      </>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
