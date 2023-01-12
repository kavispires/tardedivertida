import { useState } from 'react';
// AntDesign Resources
import { Steps } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { buildSeedingSteps } from './utils/helpers';
import { mockSeeding } from './utils/mock';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { SeedArteRuim } from './components/SeedArteRuim';
import { SeedCaminhosMagicos } from './components/SeedCaminhosMagicos';
import { SeedClubber } from './components/SeedClubber';
import { SeedFileiraDeFatos } from './components/SeedFileiraDeFatos';
import { SeedOndaTelepatica } from './components/SeedOndaTelepatica';
import { SeedPolemicaDaVez } from './components/SeedPolemicaDaVez';
import { SeedRetratoFalado } from './components/SeedRetratoFalado';

type StepSeedingProps = {
  players: GamePlayers;
  user: GamePlayer;
  onSubmitData: GenericFunction;
} & AnnouncementProps;

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
      <Title size="x-small">
        <Translate pt="Termine todas suas obrigações" en="Finish all your chores" />
      </Title>
      <div className="full-width container center">
        <Steps current={currentStep} items={items} />
        {/* DEV only */}
        {Boolean(currentSeed?.type) && <DevMock seeds={seeds} onSubmitData={onSubmitData} />}

        {currentSeed?.type === 'arte-ruim' && <SeedArteRuim seed={currentSeed} updateData={updateData} />}

        {currentSeed?.type === 'caminhos-magicos' && (
          <SeedCaminhosMagicos seed={currentSeed} updateData={updateData} user={user} />
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

        {currentSeed?.type === 'fileira-de-fatos' && (
          <SeedFileiraDeFatos seed={currentSeed} updateData={updateData} />
        )}

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

  return <></>;
}
