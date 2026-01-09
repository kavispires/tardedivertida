import { orderBy } from 'lodash';
import debounce from 'lodash/debounce';
import { useCallback, useMemo, useState } from 'react';
// Ant Design Resources
import {
  DashOutlined,
  StepBackwardOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Input, Spin, Tooltip } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { LETTERS } from 'utils/constants';
import { stringRemoveAccents } from 'utils/helpers';
// Components
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate } from 'components/language';
// Internal
import { useAlienAttributes } from './useAlienAttributes';
// Sass
import './AlienKeyboard.scss';

type AlienKeyboardProps = {
  /**
   * The current sentence
   */
  value: string;
  /**
   * Callback to update the sentence
   */
  onChange: (value: string) => void;
  /**
   * If provided, only these keys will be available on the keyboard
   */
  availableAttributeKeys?: string[];
  /**
   * Disable the keyboard
   */
  disabled?: boolean;
};

export function AlienKeyboard({ value, onChange, availableAttributeKeys, disabled }: AlienKeyboardProps) {
  const { language } = useLanguage();
  const { isLoading, data: attributes = {} } = useAlienAttributes(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create a debounced function to handle search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    [],
  );

  const allowedAttributes = useMemo(() => {
    return orderBy(
      availableAttributeKeys
        ? Object.values(attributes).filter((attribute) => availableAttributeKeys.includes(attribute.id))
        : Object.values(attributes),
      [`name.${language}`],
      ['asc'],
    );
  }, [attributes, availableAttributeKeys, language]);

  const searchDict = useMemo(() => {
    return allowedAttributes.reduce((acc: StringDictionary, attribute) => {
      acc[attribute.id] = stringRemoveAccents(
        `${attribute.name[language]} ${attribute.description[language]} ${attribute.keywords}`,
      ).toLowerCase();
      return acc;
    }, {});
  }, [allowedAttributes, language]);

  const attributesList = useMemo(() => {
    return allowedAttributes.filter((a) => {
      return searchQuery === '' || searchDict[a.id].includes(stringRemoveAccents(searchQuery.toLowerCase()));
    });
  }, [allowedAttributes, searchDict, searchQuery]);

  const onTap = (key: string, type: 'attribute' | 'helper') => {
    onChange(updateSentence(value, key, type));
  };

  return (
    <Spin spinning={isLoading}>
      <div
        className="alien-keyboard"
        style={{ width: '100%' }}
      >
        <div className="alien-keyboard__keys">
          {HELPER_KEYS.map((key) => {
            return (
              <button
                type="button"
                className="alien-keyboard__key alien-keyboard__key--helper"
                key={key.id}
                onClick={() => onTap(key.id, 'helper')}
                disabled={disabled}
              >
                {key.icon}
                <small>
                  <DualTranslate>{key.name}</DualTranslate>
                </small>
              </button>
            );
          })}
          <div className="alien-keyboard__search">
            <Input.Search
              placeholder="Search"
              onChange={(e) => debouncedSearch(e.target.value)}
              onSearch={(value) => debouncedSearch(value)}
              style={{ width: 156 }}
              disabled={disabled}
              allowClear
            />
          </div>
        </div>
        <div className="alien-keyboard__keys">
          {attributesList.map((attribute) => {
            return (
              <Tooltip
                key={attribute.id}
                title={
                  <div className="center">
                    <DualTranslate>{attribute.description}</DualTranslate>
                  </div>
                }
              >
                <button
                  type="button"
                  className="alien-keyboard__key"
                  onClick={() => onTap(attribute.id, 'attribute')}
                  disabled={disabled}
                >
                  <SignCard
                    width={32}
                    signId={`${attribute.spriteId.split('-')[1]}`}
                    className="transparent"
                  />

                  <small>
                    <DualTranslate>{attribute.name}</DualTranslate>
                  </small>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </Spin>
  );
}

const HELPER_KEYS = [
  {
    id: '^',
    name: { en: 'NOT', pt: 'NÃO' },
    icon: <VerticalAlignTopOutlined />,
    type: 'helper',
  },
  {
    id: '~',
    name: { en: 'SORTA', pt: 'MEIO' },
    icon: <DashOutlined />,
    type: 'helper',
  },
  {
    id: '*',
    name: { en: 'VERY', pt: 'MUITO' },
    icon: <VerticalAlignBottomOutlined />,
    type: 'helper',
  },
  {
    id: '<',
    name: { en: 'Backspace', pt: 'Apagar' },
    icon: <StepBackwardOutlined />,
  },
];

const updateSentence = (prev: string, key: string, type: 'attribute' | 'helper') => {
  const lastChar = prev[prev.length - 1] ?? '';
  const isLastHelper = !LETTERS.includes(lastChar.toUpperCase());

  if (type === 'attribute') {
    if (isLastHelper) {
      return `${prev}${key}`;
    }
    if (!prev.includes(key)) {
      return `${prev}+${key}`;
    }
    return prev;
  }

  if (type === 'helper') {
    if (key === '<') {
      if (isLastHelper) {
        return prev.slice(0, -1);
      }
      return prev.slice(0, -4);
    }
    if (isLastHelper) {
      return `${prev.slice(0, -1)}${key}`;
    }
    return `${prev}${key}`;
  }

  return prev;
};
