import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Image, Modal } from 'antd';
// Types
import type { GameState } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
import GAME_LIST from 'utils/info';
// Components
import { Translate } from 'components/language';
import { Title } from 'components/text';

type RedirectSessionProps = {
  state: GameState;
};

export function RedirectSession({ state }: RedirectSessionProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean | null>(null);
  const [isLoading, setLoading] = useState(false);

  const hideModal = () => {
    setOpen(false);
  };

  const redirect = state.redirect;

  if (redirect) {
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours
    const currentMilliseconds = Date.now();

    if (redirect.redirectAt - currentMilliseconds > twoHoursInMilliseconds) {
      return <></>;
    }

    const gameInfo = GAME_LIST[redirect.gameName];
    return (
      <>
        <Modal
          title={
            <Translate
              pt="Você está convidado para uma nova partida"
              en="You've been invited to a new session"
            />
          }
          open={open ?? true}
          onCancel={hideModal}
          onOk={() => {
            setLoading(true);
            navigate(`/${redirect.gameId}`);
          }}
          okButtonProps={{ loading: isLoading }}
          okText={<Translate pt="Quero participar!" en="Take me there!" />}
          cancelText={<Translate pt="Cancelar" en="Cancel" />}
        >
          <Image
            alt={gameInfo.title[language]}
            src={`${PUBLIC_URL.BANNERS}${gameInfo.gameName}-${language}.jpg`}
            fallback={`${PUBLIC_URL.BANNERS}/em-breve-${language}.jpg`}
            className="round-corners"
          />
          <Title>{redirect.gameId}</Title>
        </Modal>
      </>
    );
  }

  return <></>;
}
