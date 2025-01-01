// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
import { EarthIcon } from 'icons/EarthIcon';
import { HeartIcon } from 'icons/HeartIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function IconsTest({ onResult, step }: TestStepProps) {
  return (
    <SpaceContainer className="full-width" vertical>
      <Title level={2} size="small">
        <Translate pt="Ícones" en="Icons" />
      </Title>

      <Instruction contained>
        <Translate pt="Há 3 ícones abaixo" en="There are 3 icons below" />
      </Instruction>

      <SpaceContainer wrap className="full-width" vertical>
        <IconAvatar icon={<EarthIcon />} className="letter-blank" />
        <AnimatedClockIcon style={{ width: '50px' }} />
        <div style={{ width: '75px', height: '75px', backgroundColor: 'hotpink', padding: 12 }}>
          <HeartIcon />
        </div>
      </SpaceContainer>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          en: 'Were you able to see the Earth icon, an animated Clock icon, and a Heart icon?',
          pt: 'Você conseguiu ver o ícone da Terra, um ícone de Relógio animado e um ícone de Coração?',
        }}
      />
    </SpaceContainer>
  );
}
