import { Avatar, Space } from 'antd';
import { IconAvatar } from 'components/avatars';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
import { useMemo } from 'react';
import { cleanupLetter, isLetter } from '../utils';

type PromptProps = {
  text: string;
  correctLetters: BooleanDictionary;
};

export function Prompt({ text, correctLetters }: PromptProps) {
  const prompt = useMemo(() => text.split(''), [text]);
  return (
    <Space className="prompt" wrap align="center">
      {prompt.map((l, i) => {
        const letter = cleanupLetter(l);
        const isCorrect = correctLetters[letter];
        if (isLetter(letter)) {
          return isCorrect ? (
            <Avatar key={`${l}-${i}`} className="letter-correct" shape="square">
              {l}
            </Avatar>
          ) : (
            <IconAvatar key={`${l}-${i}`} icon={<BoxBlankIcon />} />
          );
        }

        if (l === ' ') {
          return correctLetters[l] ? (
            <Avatar key={`${l}-${i}`} className="letter-correct" shape="square">
              {l}
            </Avatar>
          ) : (
            <IconAvatar key={`${l}-${i}`} icon={<BoxBlankIcon />} />
          );
        }

        return (
          <Avatar key={`${l}-${i}`} shape="square">
            {l}
          </Avatar>
        );
      })}
    </Space>
  );
}
