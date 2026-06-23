import clsx from 'clsx';
import { keyBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { CheckCircleFilled, CheckSquareOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Space, Tooltip } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { SignCard } from '@components/cards/SignCard';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { Title } from '@components/text/Title';
// Internal
import type { PhaseBasicState } from '../utils/types';
import { SPRITE_SIZE } from '../utils/constants';

type SignsKeyCardProps = {
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  inquiryHistory: PhaseBasicState['inquiryHistory'];
};

export function SignsKeyCard({ attributes, startingAttributesIds = [], inquiryHistory }: SignsKeyCardProps) {
  const { language } = useLanguage();

  const useAttributesDict = useMemo(() => {
    const dict: Record<string, 'used' | 'starting'> = {};
    const spriteDict = keyBy(attributes, 'spriteId');

    inquiryHistory.forEach((entry) => {
      if (entry.answer && spriteDict[entry.answer]) {
        dict[spriteDict[entry.answer].id] = 'used';
      }
    });
    startingAttributesIds.forEach((id) => {
      dict[id] = 'starting';
    });
    return dict;
  }, [inquiryHistory, startingAttributesIds, attributes]);

  return (
    <Space orientation="vertical">
      <Title
        level={3}
        size="xx-small"
        marginBottom={0}
      >
        <Translate
          pt="Atributos e Símbolos"
          en="Attributes and Symbols"
        />
        <Tooltip
          title={
            <Translate
              pt="Passando o mouse sobre os nomes dos atributos dá dicas de significados adicionais que eles tem"
              en="Hovering over the attribute names gives additional meaning hints"
            />
          }
        >
          <Button
            type="text"
            style={{ color: 'white' }}
            icon={<InfoCircleOutlined />}
            shape="circle"
          />
        </Tooltip>
      </Title>
      <div className="attributes-grid">
        {attributes.map((attribute) => {
          const isStarting = useAttributesDict[attribute.id] === 'starting';
          const isUsed = useAttributesDict[attribute.id] === 'used';
          return (
            <div
              className={clsx('attributes-grid__item', {
                'attributes-grid__item--used': isUsed || isStarting,
              })}
              key={attribute.name[language]}
            >
              <Popover
                title={
                  <>
                    <DualTranslate>{attribute.name}</DualTranslate>{' '}
                    {isStarting && (
                      <Translate
                        pt=" (Atributo inicial)"
                        en=" (Starting attribute)"
                      />
                    )}
                  </>
                }
                content={
                  attribute.description ? (
                    <span className="attributes-grid__mini-description">
                      <DualTranslate>{attribute.description}</DualTranslate>
                    </span>
                  ) : undefined
                }
                trigger="hover"
              >
                <TransparentButton>
                  <DualTranslate>{attribute.name}</DualTranslate> {isStarting && <CheckSquareOutlined />}
                  {isUsed && <CheckCircleFilled />}
                </TransparentButton>
              </Popover>
              <SignCard
                signId={`${attribute.spriteId}`}
                className="transparent"
                width={SPRITE_SIZE}
              />
            </div>
          );
        })}
      </div>
    </Space>
  );
}
