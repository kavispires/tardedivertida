import { Fragment, useState } from 'react';
// Design Resources
import { Affix, Button, Popover, Spin } from 'antd';
import { FireFilled } from '@ant-design/icons';
// Hooks and API
import { GAME_API } from '../../adapters';
import { useAPICall, useGlobalState, useLoading } from '../../hooks';
// Components
import { ForceNextPhaseButton } from './ForceNextPhaseButton';
import { ForceStateForm } from './ForceStateForm';

type AdminMenuProps = {
  state: GameState;
  players: GamePlayers;
};

type PlayerStatus = {
  readyPlayers: PlayerName[];
  pendingPlayers: PlayerName[];
};

export const AdminMenu = ({ state, players }: AdminMenuProps) => {
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');
  const [visible, setVisible] = useState(false);

  const onGoToNextPhase = useAPICall({
    apiFunction: GAME_API.goToNextPhase,
    actionName: 'force-next-phase',
    successMessage: 'Funcionou, próxima fase!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
    onAfterCall: () => setVisible(false),
  });

  const onForceStateProperty = useAPICall({
    apiFunction: GAME_API.forceStateProperty,
    actionName: 'force-state-property',
    successMessage: 'Estato forçado com sucesso!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar forçar uma propriedade do estado',
    onAfterCall: () => setVisible(false),
  });

  if (!isAdmin) return <span></span>;

  const handleVisibility = (isVisible: boolean) => setVisible(isVisible);
  const showMenu = () => setVisible(true);

  const { readyPlayers, pendingPlayers }: PlayerStatus = Object.values(players).reduce(
    (acc: PlayerStatus, player) => {
      if (player.ready) {
        acc.readyPlayers.push(player.name);
      } else {
        acc.pendingPlayers.push(player.name);
      }

      return acc;
    },
    {
      readyPlayers: [],
      pendingPlayers: [],
    }
  );

  return (
    <Fragment>
      <Affix offsetBottom={10} className="admin-menu__affix">
        <Popover
          placement="topLeft"
          title="Admin Actions"
          content={
            <ul>
              <li>Ready Players: {readyPlayers.join(', ')}</li>
              <li>Pending Players: {pendingPlayers.join(', ')}</li>
              <li>
                <hr />
              </li>
              <li>
                <ForceNextPhaseButton isLoading={isLoading} onGoToNextPhase={onGoToNextPhase} />
              </li>
              <li>
                <hr />
              </li>
              <li>
                <ForceStateForm
                  isLoading={isLoading}
                  onForceStateProperty={onForceStateProperty}
                  state={state}
                />
              </li>
            </ul>
          }
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibility}
        >
          <Button
            type="primary"
            danger
            shape="circle"
            size="large"
            className="admin-menu__affix-button"
            onClick={showMenu}
            disabled={isLoading}
            icon={isLoading ? <Spin /> : <FireFilled />}
          />
        </Popover>
      </Affix>
    </Fragment>
  );
};
