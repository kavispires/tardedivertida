// Ant Design Resources
import { Space } from 'antd';
// Components
import { Instruction, Title } from 'components/text';
import { MagicCultLeaderIcon } from 'components/icons/MagicCultLeaderIcon';
import { MagicSkullIcon } from 'components/icons/MagicSkullIcon';
import { Translate } from 'components/language';
import { GameOverWrapper } from 'components/game-over';
import { MagicCandlesIcon } from 'components/icons/MagicCandlesIcon';
import { LoseGameText } from './components/RulesBlobs';

function PhaseGameOver({ players, state, info }: PhaseProps) {
  const isVictory = state.winCondition === 'WIN';

  return (
    <GameOverWrapper
      info={info}
      state={state}
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
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
