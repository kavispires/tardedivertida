// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { AnnouncementContent } from './components/TextBlobs';
import { QuestionsHistory } from './components/QuestionsHistory';
import { GameOverWrapper } from 'components/game-over';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ImageCard } from 'components/cards';
import { CriminalIcon } from 'components/icons/CriminalIcon';
import { NewspaperIcon } from 'components/icons/NewspaperIcon';

function PhaseGameOver({ state, info }: PhaseProps) {
  const { language, translate } = useLanguage();

  const didUserWin = state.outcome === 'WIN';

  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={didUserWin ? <CriminalIcon /> : <NewspaperIcon />}
      announcementDuration={15}
      announcementTitle={
        didUserWin
          ? translate('Capturado!', 'Arrested!')
          : translate('O criminoso escapou!', 'They got away!')
      }
      announcementContent={<AnnouncementContent didUserWin={didUserWin} />}
    >
      <Instruction contained>
        <Translate
          pt={<>O interrogatório durou {state.groupScore ?? '?'} horas.</>}
          en={<>The interrogation lasted for {state.groupScore ?? '?'} hours.</>}
        />
        <br />
        <Translate pt="O criminoso era:" en="The perpetrator was:" />

        <div className="t-suspects-table__suspect">
          <ImageCard
            imageId={state.perpetrator.id}
            className="t-suspects-table__suspect-image"
            cardWidth={150}
          />
          <div className="t-suspects-table__suspect-name">{state.perpetrator.name[language]}</div>
        </div>
      </Instruction>

      <QuestionsHistory history={state.history} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
