// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { CriminalIcon } from 'icons/CriminalIcon';
import { NewspaperIcon } from 'icons/NewspaperIcon';
// Components
import { AnnouncementContent } from './components/TextBlobs';
import { QuestionsHistory } from './components/QuestionsHistory';
import { GameOverWrapper } from 'components/game-over';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ImageCard } from 'components/image-cards';
import { TimeHighlight } from 'components/metrics/TimeHighlight';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  const { language } = useLanguage();

  const didUserWin = state.outcome === 'WIN';

  return (
    <GameOverWrapper
      info={info}
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
              O interrogatório durou <TimeHighlight>{state.groupScore ?? '?'}</TimeHighlight> horas.
            </>
          }
          en={
            <>
              The interrogation lasted for <TimeHighlight>{state.groupScore ?? '?'}</TimeHighlight> hours.
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

      <QuestionsHistory history={state.history} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
