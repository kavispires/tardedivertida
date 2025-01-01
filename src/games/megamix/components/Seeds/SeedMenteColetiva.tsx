import { useState } from 'react';
// Ant Design Resources
import { FlagFilled, HeartFilled, MessageFilled } from '@ant-design/icons';
import { Button, Input } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { SixPackIcon } from 'icons/SixPackIcon';
// Components
import { Avatar } from 'components/avatars';
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Title } from 'components/text';
// Internal
import type { SeedEntryMenteColetiva } from '../../utils/types';
import { SVGPhone } from '../SVGPhone';

type SeedMenteColetivaProps = {
  seed: SeedEntryMenteColetiva;
  updateData: GenericComponent;
};

export function SeedMenteColetiva({ seed, updateData }: SeedMenteColetivaProps) {
  const { translate } = useLanguage();
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt="Depois de ver alguns vídeos, você decidiu fazer esse teste no TikTok"
          en="After watching some videos, you decided to do this test on TikTok"
        />
      </Title>

      <SpaceContainer vertical>
        <SVGPhone>
          <div className="tt-phone">
            <div className="tt-phone__header">
              <span>STEM</span>
              <span>Following</span>
              <span>For You</span>
            </div>

            <div className="tt-phone__icons">
              <Avatar id="D" size="large" />
              <MessageFilled />
              <HeartFilled />
              <FlagFilled />
            </div>

            <div className="tt-phone__background">
              <SixPackIcon />
            </div>

            <div className="tt-phone__question">
              <GroupQuestionCard question={seed.card} overrideNumber={2} />
            </div>
          </div>
        </SVGPhone>
        <SpaceContainer>
          <Input
            onChange={(e) => setValue1(e.target.value)}
            size="large"
            placeholder={translate('Resposta 1', 'Answer 1')}
          />
          <Input
            onChange={(e) => setValue2(e.target.value)}
            size="large"
            placeholder={translate('Resposta 2', 'Answer 2')}
          />
        </SpaceContainer>
        <Button
          block
          onClick={() => updateData({ answers: [value1, value2] }, true)}
          disabled={!value1 || !value2}
        >
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </SpaceContainer>
    </div>
  );
}
