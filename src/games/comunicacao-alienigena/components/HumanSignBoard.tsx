import { orderBy } from 'lodash';
// Ant Design Resources
import { Button, Popconfirm, Space } from 'antd';
// Hooks
import { useCache } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { TransparentButton } from 'components/buttons';
import { DrawingCanvas } from 'components/canvas';
import { DualTranslate, Translate } from 'components/language';
import { Title } from 'components/text';

type HumanSignBoardProps = {
  signs: Sign[];
};

export function HumanSignBoard({ signs }: HumanSignBoardProps) {
  const { cache, setCache } = useCache();
  const { language } = useLanguage();

  const updateCache = (signId: number | string, content: CanvasLine[]) => {
    setCache((prev) => {
      const copy = { ...prev };
      copy[signId] = content ?? [];
      return copy;
    });
  };

  return (
    <Space direction="vertical">
      <Title level={3} size="xx-small">
        <Translate pt="Atributos e Símbolos" en="Attributes and Symbols" />
      </Title>
      <Space direction="vertical" className="board-container">
        <div className="signs-grid">
          {orderBy(signs, `attribute.${language}`).map((sign) => (
            <div className="signs-grid__item" key={sign.signId}>
              <Popconfirm
                title={<Translate pt="Apagar símbolo" en="Erase symbol" />}
                onConfirm={() => updateCache(sign.signId, [])}
                okText={<Translate pt="Sim" en="Yes" />}
                cancelText={<Translate pt="Não" en="No" />}
              >
                <TransparentButton>
                  <DualTranslate>{sign.attribute}</DualTranslate>
                </TransparentButton>
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
          ))}
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