import { useState } from 'react';
// Design Resources
import { Space } from 'antd';
// Hooks
import { useLoading, useLanguage, useGlobalState } from '../../hooks';
import { useOnSelectWitnessAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  AvatarCard,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Title,
  Translate,
  AvatarIcon,
  TransparentButton,
} from '../../components';
import { WitnessRules } from './TextBlobs';

function PhaseWitnessSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [isLoading] = useLoading();
  const [step, setStep] = useState(0);
  const [isAdmin] = useGlobalState('isAdmin');

  const onWitnessButtonClick = useOnSelectWitnessAPIRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.WITNESS_SELECTION}
      className="t-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="crime-scene"
          title={translate('O Caso', 'The Case')}
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
            <AvatarIcon type="animated-clock" size="large" />
            <br />
            <Translate pt="Quem quer ser a testemunha ocular?" en="Who wants to be the eye witness?" />
          </Title>

          <WitnessRules />

          <Instruction contained>
            <Space>
              {Object.values(players).map((player) => {
                if (isAdmin) {
                  return (
                    <TransparentButton
                      key={`p-bt-${player.id}`}
                      disabled={isLoading}
                      onClick={() => onWitnessButtonClick({ witnessId: player.id })}
                    >
                      <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />
                    </TransparentButton>
                  );
                }

                return <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />;
              })}
            </Space>
          </Instruction>

          <Instruction>
            (
            <Translate pt="O administrator selecionará a testemunha" en="The VIP will select the witness" />)
          </Instruction>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseWitnessSelection;
