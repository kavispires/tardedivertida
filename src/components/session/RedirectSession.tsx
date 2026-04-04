import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Flex, Modal } from 'antd';
// Types
import type { GameState } from 'types/game';
// Hooks
import { useGameList } from 'hooks/useGameList';
// Components
import { GameStrip } from 'components/general/GameBanner';
import { Translate } from 'components/language/Translate';
import { Title } from 'components/text/Title';

type RedirectSessionProps = {
  /**
   * The current game state
   */
  state: GameState;
};

export function RedirectSession({ state }: RedirectSessionProps) {
  const navigate = useNavigate();
  const { data: gameList } = useGameList();

  const [open, setOpen] = useState<boolean | null>(null);
  const [isLoading, setLoading] = useState(false);

  const redirect = state.redirect;
  const gameInfo = redirect && gameList ? gameList[redirect.gameName] : null;

  const hideModal = () => {
    setOpen(false);
  };

  if (redirect && gameInfo) {
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours
    const currentMilliseconds = Date.now();

    if (redirect.redirectAt - currentMilliseconds > twoHoursInMilliseconds) {
      return null;
    }

    return (
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
        okText={
          <Translate
            pt="Quero participar!"
            en="Take me there!"
          />
        }
        cancelText={
          <Translate
            pt="Cancelar"
            en="Cancel"
          />
        }
      >
        <Flex
          align="center"
          justify="center"
        >
          <GameStrip
            width={340}
            title={gameInfo.title}
            gameName={gameInfo.gameName}
            className="lobby-step__banner"
          />
        </Flex>

        <Title colorScheme="light">{redirect.gameId}</Title>
      </Modal>
    );
  }

  return null;
}
