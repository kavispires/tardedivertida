// Hooks
import { useLanguage } from '../../hooks';
// Components
import { GameOverWrapper, ImageCard, Instruction, Translate, translate } from '../../components';
import { AnnouncementContent } from './TextBlobs';

function PhaseGameOver({ state, info }: PhaseProps) {
  const language = useLanguage();

  const didUserWin = state.outcome === 'WIN';

  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={didUserWin ? 'criminal' : 'newspaper'}
      announcementDuration={15}
      announcementTitle={
        didUserWin
          ? translate('Capturado!', 'Arrested!', language)
          : translate('O criminoso escapou!', 'They got away!', language)
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
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
