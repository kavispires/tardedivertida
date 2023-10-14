import { Space } from 'antd';
import { Attribute } from './types';
import { SignCard } from 'components/cards/SignCard';
import { ATTRIBUTES, ATTRIBUTE_SIGN_DICT } from './constants';
import { DualTranslate } from 'components/language';

export function Sign({ attribute }: { attribute: Attribute }) {
  return (
    <Space size="small" direction="vertical" align="center" className="sign">
      <SignCard id={ATTRIBUTE_SIGN_DICT[attribute]} width={35} />
      <span className="sign-attribute">
        <DualTranslate>{ATTRIBUTES[attribute].name}</DualTranslate>
      </span>
    </Space>
  );
}
