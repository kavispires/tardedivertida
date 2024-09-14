import { orderBy } from 'lodash';
// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Space, Tooltip } from 'antd';
// Hooks
import { useCache } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { TransparentButton } from 'components/buttons';
import { DrawingCanvas } from 'components/canvas';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate, Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { Sign } from '../utils/types';

type HumanSignBoardProps = {
  signs: Sign[];
  startingAttributes: Sign[];
};

export function HumanSignBoard({ signs, startingAttributes = [] }: HumanSignBoardProps) {
  const { cache, setCache } = useCache();
  const { language, dualTranslate } = useLanguage();

  const updateCache = (signId: number | string, content: CanvasLine[]) => {
    setCache((prev) => {
      const copy = { ...prev };
      copy[signId] = content ?? [];
      return copy;
    });
  };

  return (
    <Space direction="vertical">
      <Title level={3} size="xx-small" white>
        <Translate pt="Atributos e Símbolos" en="Attributes and Symbols" />
        <Popover
          content={
            <Translate
              pt="Você pode clicar no título do atributo para apagar o que você desenhou"
              en="You may click on the title of an attribute to erase what you drew"
            />
          }
          title={<Translate pt="Dica" en="Hint" />}
          arrow
        >
          <Button type="text" icon={<InfoCircleOutlined />} shape="circle" />{' '}
        </Popover>
      </Title>
      <Space direction="vertical" className="board-container">
        <div className="signs-grid">
          {orderBy(signs, `attribute.${language}`).map((sign) => {
            if (startingAttributes.find((attr) => attr.signId === sign.signId)) {
              return (
                <div className="signs-grid__item" key={sign.signId}>
                  <Tooltip
                    title={`${dualTranslate(sign.description ? sign.description : sign.attribute)} (${dualTranslate({ pt: 'Item inicial', en: 'Starting item' })})`}
                    placement="bottom"
                  >
                    <DualTranslate>{sign.attribute}</DualTranslate>*
                  </Tooltip>
                  <SignCard id={`${sign.signId}`} className="transparent" />
                </div>
              );
            }

            return (
              <div className="signs-grid__item" key={sign.signId}>
                <Popconfirm
                  title={<Translate pt="Apagar símbolo" en="Erase symbol" />}
                  onConfirm={() => updateCache(sign.signId, [])}
                  okText={<Translate pt="Sim" en="Yes" />}
                  cancelText={<Translate pt="Não" en="No" />}
                >
                  <Tooltip
                    title={dualTranslate(sign.description ? sign.description : sign.attribute)}
                    placement="bottom"
                  >
                    <TransparentButton>
                      <DualTranslate>{sign.attribute}</DualTranslate>
                    </TransparentButton>
                  </Tooltip>
                </Popconfirm>
                <DrawingCanvas
                  lines={cache?.[sign.signId] ?? []}
                  setLines={(content: any) => updateCache(sign.signId, content)}
                  width={60}
                  height={60}
                  showControls={false}
                  strokeWidth="small"
                  className="signs-grid__canvas"
                  willReadFrequently
                />
              </div>
            );
          })}
        </div>
        <div className="signs-grid__item">
          <Popconfirm
            title={<Translate pt="Apagar símbolo" en="Erase symbol" />}
            onConfirm={() => updateCache('unknown', [])}
            okText={<Translate pt="Sim" en="Yes" />}
            cancelText={<Translate pt="Não" en="No" />}
          >
            <TransparentButton>
              <Translate pt="Símbolos Desconhecidos" en="Unknown Symbols" />
            </TransparentButton>
          </Popconfirm>
          <DrawingCanvas
            lines={cache?.['unknown'] ?? []}
            setLines={(content: any) => updateCache('unknown', content)}
            width={390}
            height={60}
            showControls={false}
            strokeWidth="small"
            className="signs-grid__canvas"
            willReadFrequently
          />
        </div>

        <Popconfirm
          title={<Translate pt="Apagar todos" en="Erase Clear all" />}
          onConfirm={() => setCache({})}
          okText={<Translate pt="Sim" en="Yes" />}
          cancelText={<Translate pt="Não" en="No" />}
        >
          <Button size="small" type="dashed">
            <Translate pt="Apagar todos" en="Clear all" />
          </Button>
        </Popconfirm>
      </Space>
    </Space>
  );
}
