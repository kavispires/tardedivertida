import { Avatar, Space } from 'antd';
import { IconAvatar } from 'components/avatars';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
import { LettersDictionary } from 'pages/Daily/utils/types';
import { useMemo } from 'react';

import { cleanupLetter, isLetter } from '../utils/helpers';

type PromptProps = {
  text: string;
  guesses: LettersDictionary;
};

export function Prompt({ text, guesses }: PromptProps) {
  const prompt = useMemo(() => text.split(' ').map((word) => word.split('')), [text]);
  return (
    <Space className="prompt" wrap align="center">
      {prompt.map((word, i, p) => {
        return (
          <Space key={`word-${i}`} className="prompt-word" wrap align="center">
            {word.map((l, j) => {
              const letter = cleanupLetter(l);
              const isCorrect = guesses?.[letter]?.state === 'correct';
              const key = `${j}-${l}-${i}`;
              if (isLetter(letter, true)) {
                return isCorrect ? (
                  <Avatar key={key} className="letter-correct" shape="square">
                    {l}
                  </Avatar>
                ) : (
                  <IconAvatar key={key} icon={<BoxBlankIcon />} className="letter-blank" />
                );
              }

              return (
                <Avatar key={key} shape="square">
                  {l}
                </Avatar>
              );
            })}
            {i + 1 < p.length && <Avatar shape="square"></Avatar>}
          </Space>
        );
      })}
    </Space>
  );
}
