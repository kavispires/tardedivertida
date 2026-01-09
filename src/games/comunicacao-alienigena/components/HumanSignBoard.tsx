import { orderBy } from 'lodash';
// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Space, Tooltip } from 'antd';
// Hooks
import { useCache } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { TransparentButton } from 'components/buttons';
import { DrawingCanvas } from 'components/canvas';
import { SignCard } from 'components/cards/SignCard';
import { Popconfirm } from 'components/general/Popconfirm';
import { DualTranslate, Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { PhaseBasicState } from '../utils/types';

type HumanSignBoardProps = {
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
};

export function HumanSignBoard({ attributes, startingAttributesIds = [] }: HumanSignBoardProps) {
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
    <Space orientation="vertical">
      <Title
        level={3}
        size="xx-small"
      >
        <Translate
          pt="Atributos e Símbolos"
          en="Attributes and Symbols"
        />
        <Popover
          content={
            <Translate
              pt="Você pode clicar no título do atributo para apagar o que você desenhou"
              en="You may click on the title of an attribute to erase what you drew"
            />
          }
          title={
            <Translate
              pt="Dica"
              en="Hint"
            />
          }
          arrow
        >
          <Button
            type="text"
            style={{ color: 'white' }}
            icon={<InfoCircleOutlined />}
            shape="circle"
          />{' '}
        </Popover>
      </Title>
      <Space
        orientation="vertical"
        className="board-container"
      >
        <div className="attributes-grid">
          {orderBy(attributes, `attribute.${language}`).map((attribute) => {
            if (startingAttributesIds.find((attributeId) => attributeId === attribute.id)) {
              return (
                <div
                  className="attributes-grid__item"
                  key={attribute.id}
                >
                  <Tooltip
                    title={`${dualTranslate(attribute.description ? attribute.description : attribute.name)} (${dualTranslate({ pt: 'Item inicial', en: 'Starting item' })})`}
                    placement="bottom"
                  >
                    <DualTranslate>{attribute.name}</DualTranslate>*
                  </Tooltip>
                  <SignCard
                    signId={`${attribute.spriteId}`}
                    className="transparent"
                    width={48}
                  />
                </div>
              );
            }

            return (
              <div
                className="attributes-grid__item"
                key={attribute.id}
              >
                <Popconfirm
                  title={
                    <Translate
                      pt="Apagar símbolo"
                      en="Erase symbol"
                    />
                  }
                  onConfirm={() => updateCache(attribute.id, [])}
                  okText={
                    <Translate
                      pt="Sim"
                      en="Yes"
                    />
                  }
                  cancelText={
                    <Translate
                      pt="Não"
                      en="No"
                    />
                  }
                >
                  <Tooltip
                    title={dualTranslate(attribute.description ? attribute.description : attribute.name)}
                    placement="bottom"
                  >
                    <TransparentButton>
                      <DualTranslate>{attribute.name}</DualTranslate>
                    </TransparentButton>
                  </Tooltip>
                </Popconfirm>
                <DrawingCanvas
                  lines={cache?.[attribute.id] ?? []}
                  setLines={(content: any) => updateCache(attribute.id, content)}
                  width={60}
                  height={60}
                  showControls={false}
                  strokeWidth="small"
                  className="attributes-grid__canvas"
                  willReadFrequently
                />
              </div>
            );
          })}
        </div>
        <div className="attributes-grid__item">
          <Popconfirm
            title={
              <Translate
                pt="Apagar símbolo"
                en="Erase symbol"
              />
            }
            onConfirm={() => updateCache('unknown', [])}
            okText={
              <Translate
                pt="Sim"
                en="Yes"
              />
            }
            cancelText={
              <Translate
                pt="Não"
                en="No"
              />
            }
          >
            <TransparentButton>
              <Translate
                pt="Símbolos Desconhecidos"
                en="Unknown Symbols"
              />
            </TransparentButton>
          </Popconfirm>
          <DrawingCanvas
            lines={cache?.unknown ?? []}
            setLines={(content: any) => updateCache('unknown', content)}
            width={390}
            height={60}
            showControls={false}
            strokeWidth="small"
            className="attributes-grid__canvas"
            willReadFrequently
          />
        </div>

        <Popconfirm
          title={
            <Translate
              pt="Apagar todos"
              en="Erase Clear all"
            />
          }
          onConfirm={() => setCache({})}
          okText={
            <Translate
              pt="Sim"
              en="Yes"
            />
          }
          cancelText={
            <Translate
              pt="Não"
              en="No"
            />
          }
        >
          <Button
            size="small"
            type="dashed"
          >
            <Translate
              pt="Apagar todos"
              en="Clear all"
            />
          </Button>
        </Popconfirm>
      </Space>
    </Space>
  );
}
