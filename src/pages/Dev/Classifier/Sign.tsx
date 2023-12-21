import { Badge, Space } from 'antd';
import { Attribute } from './types';
import { SignCard } from 'components/cards/SignCard';
import { ATTRIBUTES, ATTRIBUTE_SIGN_DICT } from './constants';
import { DualTranslate } from 'components/language';
import clsx from 'clsx';

type SignProps = {
  attribute: Attribute;
  value?: number;
  very?: boolean;
  not?: boolean;
  hideName?: boolean;
};

const colors: Record<string, string> = {
  '-5': 'red',
  '-3': 'orange',
  '-1': 'yellow',
  0: 'gray',
  1: 'green',
  3: 'cyan',
  5: 'blue',
};

export function Sign({ attribute, value, very, not, hideName }: SignProps) {
  return (
    <Space size="small" direction="vertical" align="center" className="sign">
      <SignCard
        id={ATTRIBUTE_SIGN_DICT[attribute]}
        width={35}
        className={clsx(very && 'sign-attribute__very', not && 'sign-attribute__not')}
      />
      {!hideName && (
        <span className="sign-attribute">
          <DualTranslate>{ATTRIBUTES[attribute].name}</DualTranslate>
        </span>
      )}
      {value !== undefined && (
        <Badge
          className="sign-attribute"
          count={value}
          size="small"
          color={colors?.[String(value)] ?? 'gray'}
        />
      )}
    </Space>
  );
}
