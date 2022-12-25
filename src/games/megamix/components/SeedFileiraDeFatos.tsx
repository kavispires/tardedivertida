import { Button, InputNumber, Slider, Space } from 'antd';
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import moment from 'moment';
import { useState } from 'react';

type SeedFileiraDeFatosProps = {
  seed: SeedEntryFileiraDeFatos;
  updateData: GenericComponent;
};

const now = moment().format('MMMM YYYY, h:mm');

export function SeedFileiraDeFatos({ seed, updateData }: SeedFileiraDeFatosProps) {
  const [value, setValue] = useState(0);

  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt="Você recebeu o torpedo de um amigo e precisa responder antes de se arrumar"
          en="You received the following text message from a friend and you must answer before leaving"
        />
      </Title>

      <Space className="space-container" direction="vertical">
        <div className="ff-phone">
          <div className="ff-phone__contact">
            <Avatar id="B" />
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
              <Translate pt="De 0 a 100..." en="From 0 to 100" />
            </div>
            <div className="ff-phone__timestamp">
              <Translate pt="Recebido" en="Received" /> {now}
            </div>
            <div className="ff-phone__message">{seed.card.question}</div>
          </div>
        </div>

        <Space className="space-container">
          <Slider min={0} max={100} onChange={(e) => setValue(e)} className="ff-slider" value={value} />
          <InputNumber
            min={0}
            max={100}
            style={{ margin: '0 16px' }}
            value={value}
            onChange={(e) => setValue(e ?? 0)}
          />
        </Space>

        <Button block onClick={() => updateData({ fact: value }, true)}>
          <Translate pt="Enviar" en="Submit" /> ({value})
        </Button>
      </Space>
    </div>
  );
}
