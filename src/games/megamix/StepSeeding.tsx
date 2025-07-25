import { useState } from 'react';
// Ant Design Resources
import { Steps } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { SeedEntry, SubmitAnswerPayload } from './utils/types';
import { buildSeedingSteps } from './utils/helpers';
import { mockSeeding } from './utils/mock';
import { SeedArteRuim } from './components/Seeds/SeedArteRuim';
import { SeedLabirintoSecreto } from './components/Seeds/SeedLabirintoSecreto';
import { SeedClubber } from './components/Seeds/SeedClubber';
import { SeedOndaTelepatica } from './components/Seeds/SeedOndaTelepatica';
import { SeedPolemicaDaVez } from './components/Seeds/SeedPolemicaDaVez';
import { SeedRetratoFalado } from './components/Seeds/SeedRetratoFalado';
import { SeedUeSoIsso } from './components/Seeds/SeedUeSoIsso';
import { SeedMenteColetiva } from './components/Seeds/SeedMenteColetiva';
import { SeedContadoresHistorias } from './components/Seeds/SeedContadoresHistorias';
import { SeedParty } from './components/Seeds/SeedParty';

type StepSeedingProps = {
  players: GamePlayers;
  user: GamePlayer;
  onSubmitData: (payload: SubmitAnswerPayload) => void;
} & Pick<StepProps, 'announcement'>;

export const StepSeeding = ({ announcement, user, onSubmitData }: StepSeedingProps) => {
  const { step: currentStep, goToNextStep } = useStep(0);

  const [data, setData] = useState<PlainObject>({});
  const { translate } = useLanguage();

  const updateData = (objValue: PlainObject, next = false) => {
    setData((v) => ({ ...v, ...objValue }));
    if (next) {
      goToNextStep();
    }
  };

  const seeds = user.seeds ?? [];
  const items = buildSeedingSteps(seeds, translate);
  const currentSeed: SeedEntry = seeds[currentStep];

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle size="small">
        {seeds.length > 1 ? (
          <Translate pt="Termine todas suas obrigações" en="Finish all your chores" />
        ) : (
          <Translate pt="Hora de se arrumar" en="Time to get ready" />
        )}
      </StepTitle>
      <div className="full-width container center">
        <Steps current={currentStep} items={items} />
        {/* DEV only */}
        {Boolean(currentSeed?.type) && <DevMock seeds={seeds} onSubmitData={onSubmitData} />}

        {currentSeed?.type === 'arte-ruim' && <SeedArteRuim seed={currentSeed} updateData={updateData} />}

        {currentSeed?.type === 'contadores-historias' && (
          <SeedContadoresHistorias seed={currentSeed} updateData={updateData} />
        )}

        {currentSeed?.type === 'labirinto-secreto' && (
          <SeedLabirintoSecreto seed={currentSeed} updateData={updateData} user={user} />
        )}

        {currentSeed?.type === 'mente-coletiva' && (
          <SeedMenteColetiva seed={currentSeed} updateData={updateData} />
        )}

        {currentSeed?.type === 'onda-telepatica' && (
          <SeedOndaTelepatica seed={currentSeed} updateData={updateData} />
        )}

        {currentSeed?.type === 'polemica-da-vez' && (
          <SeedPolemicaDaVez seed={currentSeed} updateData={updateData} />
        )}

        {currentSeed?.type === 'retrato-falado' && (
          <SeedRetratoFalado seed={currentSeed} updateData={updateData} />
        )}

        {currentSeed?.type === 'ue-so-isso' && <SeedUeSoIsso seed={currentSeed} updateData={updateData} />}

        {currentSeed?.type === 'party' && <SeedParty seed={currentSeed} updateData={updateData} />}

        {currentSeed?.type === 'clubber' && (
          <SeedClubber
            seed={currentSeed}
            updateData={updateData}
            user={user}
            onSubmitData={onSubmitData}
            data={data}
          />
        )}
      </div>
    </Step>
  );
};

type DevMockProps = {
  onSubmitData: GenericFunction;
  seeds: SeedEntry[];
};

function DevMock({ onSubmitData, seeds }: DevMockProps) {
  // DEV
  useMock(() => {
    onSubmitData({ data: mockSeeding(seeds) });
  });

  return null;
}
