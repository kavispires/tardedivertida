import { FireFilled, HeartFilled, HeartOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { Button, Popover, Space, Typography } from 'antd';
import { LanguageSwitch, Translate } from 'components/language';
import { useState } from 'react';

type MenuProps = {
  userDaily: Me['daily'];
  hearts: number;
  openRules: boolean;
};

export function Menu({ userDaily, hearts, openRules }: MenuProps) {
  return (
    <div className="menu">
      <StreakCount userDaily={userDaily} />
      <div className="menu-hearts">
        {hearts > 0 ? <HeartFilled /> : <HeartOutlined />}
        {hearts > 1 ? <HeartFilled /> : <HeartOutlined />}
        {hearts > 2 ? <HeartFilled /> : <HeartOutlined />}
      </div>
      <Rules defaultOpen={openRules} />
    </div>
  );
}

function StreakCount({ userDaily }: Pick<MenuProps, 'userDaily'>) {
  return (
    <Popover
      title={<Translate pt="Estatísticas" en="Stats" />}
      content={
        <Space direction="vertical" size="small">
          <ul className="list">
            <li>
              <Typography>
                <Translate pt="Maior sequência" en="Longest streak" />: {userDaily.longestStreak}
              </Typography>
            </li>
            <li>
              <Typography>
                <Translate pt="Desafios completados" en="Challenges completed" />: {userDaily.streak}
              </Typography>
            </li>
            <li>
              <Typography>
                <Translate pt="Desafios jogados" en="Challenges played" />: {userDaily.total}
              </Typography>
            </li>
          </ul>
        </Space>
      }
      trigger="click"
      className="menu-entry"
    >
      <FireFilled />
    </Popover>
  );
}

function Rules({ defaultOpen = true }: { defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Popover
      title={<Translate pt="Regras" en="Rules" />}
      trigger="click"
      open={open}
      onOpenChange={(o) => setOpen(o)}
      content={
        <Space direction="vertical" size="small">
          <LanguageSwitch />
          <ul className="list">
            <Typography>
              <Translate
                pt={
                  <>
                    <li>
                      Há 3 temas secretos que agrupam os 9 itens em 3 grupos de 3 itens cada. Você sabe quais
                      são?
                    </li>
                    <li>
                      Cada grupo que você tenta fazer e que não está presente na resposta remove um coração e
                      você tem apenas 3 <HeartFilled />.
                    </li>
                    <li>Boa sorte!</li>
                  </>
                }
                en={
                  <>
                    <li>
                      There are 3 secret themes that group the 9 items into 3 groups of 3 items each. Do you
                      know what they are?
                    </li>
                    <li>
                      Each group you try to make and that is not present in the answer removes a heart and you
                      have only 3 <HeartFilled />.
                    </li>
                    <li>Good luck!</li>
                  </>
                }
              />
            </Typography>
          </ul>
          <Space className="space-container">
            <Button size="small" onClick={() => setOpen(false)}>
              <Translate pt="Fechar" en="Close" />
            </Button>
          </Space>
        </Space>
      }
      className="menu-entry"
    >
      <QuestionCircleFilled />
    </Popover>
  );
}
