import moment from 'moment';
import { useState } from 'react';
import clsx from 'clsx';
// AntDesign Resources
import { Button, Input, Space } from 'antd';
// Types
import type { SeedEntryUeSoIsso } from '../../utils/types';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { SVGPhone } from '../SVGPhone';

type SeedUeSoIssoProps = {
  seed: SeedEntryUeSoIsso;
  updateData: GenericComponent;
};

const now = moment().format('MMMM YYYY, h:mm');

export function SeedUeSoIsso({ seed, updateData }: SeedUeSoIssoProps) {
  const [value, setValue] = useState('');
  const { translate } = useLanguage();

  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt="Você recebeu o torpedo de um amigo e precisa responder antes de se arrumar"
          en="You received the following text message from a friend and you must answer it before leaving"
        />
      </Title>

      <Space className="space-container" direction="vertical">
        <SVGPhone>
          <div className="ff-phone">
            <div className="ff-phone__contact">
              <Avatar id="B" size="large" />
              <div className="ff-phone__name">Bob {'>'}</div>
            </div>
            <div className="ff-phone__thread">
              <div className="ff-phone__message">
                <Translate pt="Ow" en="Dude" />
              </div>
              <div className="ff-phone__message">
                <Translate pt="fala aí" en="Answer this" />
              </div>
              <div className="ff-phone__message">
                <Translate pt="Diga uma palavra relacionada à..." en="Say a single word related to..." />
              </div>
              <div className="ff-phone__timestamp">
                <Translate pt="Recebido" en="Received" /> {now}
              </div>
              <div
                className={clsx('ff-phone__message ff-phone__message--important', getAnimationClass('tada'))}
              >
                {seed.card.text}
              </div>
            </div>
          </div>
        </SVGPhone>

        <Input
          onChange={(e) => setValue(e.target.value)}
          size="large"
          placeholder={translate('Escreva aqui', 'Write here')}
          onPressEnter={() => updateData({ singleClue: value }, true)}
        />

        <Button block onClick={() => updateData({ singleClue: value }, true)} type="primary">
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Space>
    </div>
  );
}
