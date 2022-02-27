import { useEffect, useState } from 'react';
// Design Resources
import { message } from 'antd';
// Hooks
import { useWhichPlayerIsThe, useUser, useLoading, useLanguage } from '../../hooks';
import { useOnPlayCardAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  messageContent,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
} from '../../components';

import StepPlayCard from './StepPlayCard';

function PhaseCardPlay({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [isLoading] = useLoading();
  const user = useUser(players);
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);
  const [, isUserTheImpostor] = useWhichPlayerIsThe('impostorId', state, players);
  const [step, setStep] = useState(0);

  const onPlayCard = useOnPlayCardAPIRequest();
  // const onPlayCard = (e: any) => console.log(e);

  useEffect(() => {
    if (isUserTheCurrentPlayer && step === 1 && !isLoading) {
      message.info(
        messageContent(
          translate('Escolha uma carta!', 'Choose a card to play'),
          translate(
            'Aperte o botão Selecionar acima da carta escolhida',
            'Press the select button above each card'
          ),

          currentPlayer.id,
          3
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer.id, step, translate, isLoading]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY}
      className="d-phase d-play-card-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="hanging-photograph"
          title={translate('Apresentação das Evidências', 'Evidence')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt="Agora, jogadores selecionarão duas cartas, uma de cada vez, como evidência que eles não sao o impostor. Enquanto isso, o impostor está prestando bastante atenção nas cartas selecionadas e escolhendo algo que o(a) ajude a passar despercebido."
              en="Now players will play 2 cards, one at a time, as evidence that they are not the impostor while the impostor is looking closely to what others are playing and trying to go unnoticed."
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepPlayCard
          clue={state.clue}
          currentPlayer={currentPlayer}
          isLoading={isLoading}
          isUserTheImpostor={isUserTheImpostor}
          isUserTheCurrentPlayer={isUserTheCurrentPlayer}
          onPlayCard={onPlayCard}
          players={players}
          table={state.table}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCardPlay;
