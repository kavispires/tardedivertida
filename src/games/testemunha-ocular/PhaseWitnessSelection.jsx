import { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useAPICall, useLoading, useLanguage } from '../../hooks';
// Resources & Utils
import { TESTEMUNHA_OCULAR_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Title,
  Translate,
  translate,
} from '../../components/shared';
import { AdminOnlyContainer } from '../../components/admin';
import { LoadingClock } from '../../components/icons';
import { AvatarName } from '../../components/avatars';

function PhaseWitnessSelection({ state, players, info }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [step, setStep] = useState(0);

  const onSelectWitness = useAPICall({
    apiFunction: TESTEMUNHA_OCULAR_API.submitAction,
    actionName: 'select-witness',
    successMessage: translate('Testemunha enviada com sucesso', 'Witness submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar selecionar a testemunha',
      'Oops, the application found an error while trying to submit the witness',
      language
    ),
  });

  const onWitnessButtonClick = (witnessId) => {
    onSelectWitness({
      action: 'SELECT_WITNESS',
      witnessId,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.WITNESS_SELECTION}
      className="t-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="crime-scene"
          title={translate('O Caso', 'The Case', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Um crime horrível aconteceu. Tão horrível quem não consigo nem explicar e nem podemos contar
                  com a ciência forense para resolvê-lo. Portanto, só há uma pessoa que pode nos ajudar agora:
                  uma testemunha ocular...
                </>
              }
              en={
                <>
                  A horrible crime has happened. So horrible that I can't even explain, neither can't rely on
                  forensics and science to solve it. So there's only one person that could help us now: An eye
                  witness...
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step key={1}>
          <Title>
            <LoadingClock />
            <br />
            <Translate pt="Quem quer ser a testemunha ocular?" en="Who wants to be the eye witness?" />
          </Title>

          <Instruction contained>
            <Space>
              {Object.values(players).map((player) => (
                <AvatarName key={`p-a-${player.id}`} player={player} />
              ))}
            </Space>
          </Instruction>

          <Instruction>
            (
            <Translate pt="O administrator selecionará a testemunha" en="The VIP will select the witness" />)
          </Instruction>

          <AdminOnlyContainer>
            {Object.values(players).map((player) => (
              <Button
                key={`p-bt-${player.id}`}
                disabled={isLoading}
                onClick={() => onWitnessButtonClick(player.id)}
              >
                {player.name}
              </Button>
            ))}
          </AdminOnlyContainer>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseWitnessSelection.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseWitnessSelection;
