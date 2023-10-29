import { FireFilled, HeartFilled, HeartOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { Button, Popover, Space, Typography } from 'antd';
import { LanguageSwitch, Translate } from 'components/language';
import { useState } from 'react';

type MenuProps = {
  userDaily: Me['daily'];
  hearts: number;
};

export function Menu({ userDaily, hearts }: MenuProps) {
  return (
    <div className="menu">
      <StreakCount userDaily={userDaily} />
      <div className="menu-hearts">
        {hearts > 0 ? <HeartFilled /> : <HeartOutlined />}
        {hearts > 1 ? <HeartFilled /> : <HeartOutlined />}
        {hearts > 2 ? <HeartFilled /> : <HeartOutlined />}
      </div>
      <Rules />
    </div>
  );
}

function StreakCount({ userDaily }: Pick<MenuProps, 'userDaily'>) {
  return (
    <Popover
      title={<Translate pt="Estatísticas" en="Stats" />}
      content={
        <Space direction="vertical" size="small">
          <Typography.Paragraph>
            <Translate pt="Maior sequência" en="Longest streak" />: {userDaily.longestStreak}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Translate pt="Desafios completados" en="Challenges completed" />: {userDaily.streak}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Translate pt="Desafios jogados" en="Challenges played" />: {userDaily.total}
          </Typography.Paragraph>
        </Space>
      }
      trigger="click"
      className="menu-entry"
    >
      <FireFilled />
    </Popover>
  );
}

function Rules() {
  const [open, setOpen] = useState(true);

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
                      Tente adivinhar a expressão secreta observando os desenhos e apertando letra por letra.
                    </li>
                    <li>
                      Cada letra que você aperta que não está presente na resposta remove um coração e você
                      tem apenas 3 <HeartFilled />.
                    </li>
                    <li>O 'espaço' também é uma opção que pode estar presente ou não. Boa sorte!</li>
                  </>
                }
                en={
                  <>
                    <li>
                      Try to guess the secret expression by observing the drawings and then pressing letter by
                      letter.
                    </li>
                    <li>
                      Each letter you press that is not present in the answer removes a heart and you only
                      have 3 <HeartFilled />.
                    </li>
                    <li>The 'space' is also an option that may or may not be present. Good luck!</li>
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
