import PropTypes from 'prop-types';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { GameOverWrapper, Instruction, Translate, translate } from '../../components/shared';
import { ImageCard } from '../../components/cards';

function PhaseGameOver({ state, info }) {
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
      <Instruction>
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

function AnnouncementContent({ didUserWin }) {
  return didUserWin ? (
    <Instruction>
      <Translate
        pt="O criminoso foi capturado e preso e vai morrer na cadeira elétrica! Obrigado pelo seu serviço e dedicação nesse caso!"
        en="The perpetrator was captured, arrested, and will be executed by the electric chair! Thank you for your service!"
      />
    </Instruction>
  ) : (
    <Instruction>
      <Translate
        pt="O criminoso não foi capturado. Tudo por conta da sua investigação porca. Ele(a) saiu pelo mundo a fora cometendo mais crimes. Saiu até nos jornais!"
        en="The perpetrator got away. Thanks to you and your lousy investigation. Now they are out and about committing more crimes. It was even on the news!"
      />
    </Instruction>
  );
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    groupScore: PropTypes.number,
    outcome: PropTypes.string,
    perpetrator: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.shape({
        pt: PropTypes.string,
        en: PropTypes.string,
      }),
      gender: PropTypes.string,
    }),
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
    }),
  }),
};

export default PhaseGameOver;
