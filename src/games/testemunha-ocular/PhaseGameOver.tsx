// Types
import type { PhaseProps } from 'types/game';
// Icons
import { CriminalIcon } from 'icons/CriminalIcon';
import { NewspaperIcon } from 'icons/NewspaperIcon';
// Components
import { GameOverWrapper } from 'components/game-over/GameOverWrapper';
import { Achievements } from 'components/general/Achievements';
import { ImageCard } from 'components/image-cards/ImageCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { Instruction } from 'components/text/Instruction';
// Internal
import achievementsReference from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { OUTCOME } from './utils/constants';
import { AnnouncementContent } from './components/TextBlobs';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Suspects } from './components/Suspects';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const didUserWin = state.outcome === OUTCOME.WIN;
  const perpetrator = state.suspectsDict[state.perpetratorId];

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={didUserWin ? <CriminalIcon /> : <NewspaperIcon />}
      announcementDuration={15}
      announcementTitle={
        didUserWin ? (
          <Translate
            pt="Capturado!"
            en="Arrested!"
          />
        ) : (
          <Translate
            pt="O criminoso escapou!"
            en="They got away!"
          />
        )
      }
      announcementContent={<AnnouncementContent didUserWin={didUserWin} />}
    >
      <Instruction colorScheme="dark">
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
        <Translate
          pt="O criminoso era:"
          en="The perpetrator was:"
        />
      </Instruction>
      <SpaceContainer>
        <div className="t-suspects-table__suspect">
          <ImageCard
            cardId={perpetrator.id}
            className="t-suspects-table__suspect-image"
            cardWidth={150}
          />
          <div className="t-suspects-table__suspect-name">
            <DualTranslate>{perpetrator.name}</DualTranslate>
          </div>
        </div>
      </SpaceContainer>
      <Instruction colorScheme="dark">
        <Translate
          pt="Crime:"
          en="Crime:"
        />{' '}
        <DualTranslate>{state.reason.title}</DualTranslate>
      </Instruction>

      <Achievements
        achievements={state.achievements}
        players={players}
        reference={achievementsReference}
      />

      <QuestionsHistory
        history={state.history}
        suspectsDict={state.suspectsDict}
      />

      <Suspects
        suspectsIds={state.suspectsIds}
        suspectsDict={state.suspectsDict}
        perpetratorId={state.perpetratorId}
      />
    </GameOverWrapper>
  );
}
