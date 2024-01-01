import moment from 'moment';
// AntDesign Resources
import { Button, Space } from 'antd';
// Types
import type { SeedEntryContadoresHistorias } from '../../utils/types';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { SVGPhone } from '../SVGPhone';
import { ImageCard } from 'components/image-cards';

const now = moment().format('MMMM YYYY, h:mm');

type SeedContadoresHistoriasProps = {
  seed: SeedEntryContadoresHistorias;
  updateData: GenericComponent;
};

export function SeedContadoresHistorias({ seed, updateData }: SeedContadoresHistoriasProps) {
  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt="Sua mãe te mandou uma mensagem e você precisa responder antes de se arrumar"
          en="Your mom sent you a message and you must answer it before leaving"
        />
      </Title>

      <Space className="space-container" direction="vertical">
        <SVGPhone>
          <div className="ff-phone">
            <div className="ff-phone__contact">
              <Avatar id="B" />
              <div className="ff-phone__name">
                <Translate pt="Mamãe" en="Mommy" /> {'>'}
              </div>
            </div>
            <div className="ff-phone__thread">
              <div className="ff-phone__message">
                <Translate pt="Filho(a)" en="Dear" />
              </div>
              <div className="ff-phone__message">
                <Translate pt="O que é isso?" en="What is this?" />
              </div>
              <div className="ff-phone__timestamp">
                <Translate pt="Recebido" en="Received" /> {now}
              </div>
              <div className="ff-phone__message">
                <ImageCard imageId={seed.card} cardWidth={100} />
              </div>
            </div>
          </div>
        </SVGPhone>

        <Instruction>
          <Translate
            pt="Você pode clicar na imagem para ampliá-la."
            en="You can click on the image to enlarge it."
          />
        </Instruction>

        <Space className="space-container" wrap>
          {seed.prompts.map((prompt) => (
            <Button
              key={prompt.id}
              onClick={() => updateData({ prompt: prompt.text }, true)}
              type="primary"
              size="large"
            >
              {prompt.text}
            </Button>
          ))}
        </Space>
      </Space>
    </div>
  );
}
