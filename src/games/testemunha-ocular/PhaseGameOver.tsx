// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { CriminalIcon } from 'icons/CriminalIcon';
import { NewspaperIcon } from 'icons/NewspaperIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { Instruction } from 'components/text';
// Internal
import achievementsReference from './utils/achievements';
import { AnnouncementContent } from './components/TextBlobs';
import { QuestionsHistory } from './components/QuestionsHistory';

function PhaseGameOver({ state, players }: PhaseProps) {
  const { language } = useLanguage();

  const didUserWin = state.outcome === 'WIN';

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={didUserWin ? <CriminalIcon /> : <NewspaperIcon />}
      announcementDuration={15}
      announcementTitle={
        didUserWin ? (
          <Translate pt="Capturado!" en="Arrested!" />
        ) : (
          <Translate pt="O criminoso escapou!" en="They got away!" />
        )
      }
      announcementContent={<AnnouncementContent didUserWin={didUserWin} />}
    >
      <Instruction contained>
        <Translate
          pt={
            <>
              O interrogatório durou <TimeHighlight>{state.round.current ?? '?'}</TimeHighlight> horas.
            </>
          }
          en={
            <>
              The interrogation lasted for <TimeHighlight>{state.round.current ?? '?'}</TimeHighlight> hours.
            </>
          }
        />
        <br />
        <Translate pt="O criminoso era:" en="The perpetrator was:" />

        <div className="t-suspects-table__suspect">
          <ImageCard id={state.perpetrator.id} className="t-suspects-table__suspect-image" cardWidth={150} />
          <div className="t-suspects-table__suspect-name">{state.perpetrator.name[language]}</div>
        </div>
      </Instruction>

      <Achievements achievements={state.achievements} players={players} reference={achievementsReference} />

      <QuestionsHistory history={state.history} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
