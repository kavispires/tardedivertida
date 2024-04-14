// Ant Design Resources
import { Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { DecisionButtons } from './DecisionButtons';
import { TestStepProps } from '../TestArea';
import { IconAvatar } from 'components/avatars';
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
import { EarthIcon } from 'icons/EarthIcon';
import { HeartIcon } from 'icons/HeartIcon';

export function IconsTest({ onResult, step }: TestStepProps) {
  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Ícones" en="Icons" />
      </Title>

      <Instruction contained>
        <Translate pt="Há 3 ícones abaixo" en="There are 3 icons below" />
      </Instruction>

      <Space wrap className="space-container full-width">
        <IconAvatar icon={<EarthIcon />} className="letter-blank" />
        <AnimatedClockIcon style={{ width: '50px' }} />
        <div style={{ width: '75px', height: '75px', backgroundColor: 'hotpink', padding: 12 }}>
          <HeartIcon />
        </div>
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          en: 'Were you able to see the Earth icon, an animated Clock icon, and a Heart icon?',
          pt: 'Você conseguiu ver o ícone da Terra, um ícone de Relógio animado e um ícone de Coração?',
        }}
      />
    </Space>
  );
}
