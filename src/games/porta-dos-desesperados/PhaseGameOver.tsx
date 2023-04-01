// Ant Design Resources
import { Space } from 'antd';
// Utils
import { achievementsReference } from './utils/achievements';
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

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
