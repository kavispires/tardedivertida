import { Button, Layout, Modal, Space } from 'antd';
import { Translate } from 'components/language';
import { CalendarIcon } from 'icons/CalendarIcon';
import { useDailyChallengeMutation } from 'pages/Daily/hooks/useDailyChallengeMutation';

import { useEffect, useState } from 'react';
import { Me } from 'types/user';
import { removeDuplicates } from 'utils/helpers';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { getSourceName } from '../../../utils';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { SETTINGS } from '../utils/settings';
import { DailyPalavreadoEntry } from '../utils/type';
import { useLanguage } from 'hooks/useLanguage';
import { Keyboard } from 'pages/Daily/components/Keyboard';

type DailyPalavreadoProps = {
  data: DailyPalavreadoEntry;
  currentUser: Me;
  wordList: string[];
};

export function DailyPalavreado({ data }: DailyPalavreadoProps) {
  const { language } = useLanguage();
  const source = getSourceName(language);

  // Build game: word, letters, lives
  const [hearts, setHearts] = useState<number>(SETTINGS.HEARTS);

  return (
    <Layout className="app">
      <Header icon={<CalendarIcon />}>
        TD <Translate pt="Diário" en="Daily" /> #{data.number}
      </Header>
      <Layout.Content>
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules />} />
        <Keyboard
          onLetterClick={(l) => console.log('clicou na letra', l)}
          lettersState={{
            q: 'disabled',
            w: 'disabled',
            a: 'correct',
            d: 'incorrect',
            g: 'intermediate',
            x: 'used',
          }}
        />
      </Layout.Content>
    </Layout>
  );
}
