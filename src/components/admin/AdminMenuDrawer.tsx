import { FireFilled } from '@ant-design/icons';
import { Button, Drawer, Popconfirm, Spin } from 'antd';
import { useAPICall, useGlobalState, useLoading } from 'hooks';
import { useState } from 'react';
import { ADMIN_API } from 'services/adapters';
import { ADMIN_ACTIONS } from 'utils/constants';

import { AdminPerformActionButton } from './_internal/AdminPerformActionButton';
import { ForceStateForm } from './_internal/ForceStateForm';
import { PlayersReadyState } from './_internal/PlayersReadyState';

type AdminMenuDrawerProps = {
  state: GameState;
  players: GamePlayers;
};

export const AdminMenuDrawer = ({ state, players }: AdminMenuDrawerProps) => {
  const { isLoading } = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onPerformAdminAction = useAPICall({
    apiFunction: ADMIN_API.performAdminAction,
    actionName: 'perform-admin-action',
    successMessage: 'Admin action performed successfully',
    errorMessage: 'The selected admin action has failed',
    onAfterCall: onClose,
  });

  if (!isAdmin || !isAdminEnabled) return <span></span>;

  return (
    <>
      <div className="admin-menu-drawer">
        <Button
          type="primary"
          danger
          size="small"
          onClick={showDrawer}
          disabled={isLoading}
          icon={isLoading ? <Spin /> : <FireFilled />}
        >
          Admin
        </Button>

        <Drawer title="Admin Menu" placement="left" closable={false} visible={visible} onClose={onClose}>
          <ul>
            <PlayersReadyState players={players} />
            <li>
              <hr />
            </li>
            <li className="admin-menu-drawer__buttons">
              <h3>Actions</h3>
              <Popconfirm
                placement="right"
                title="Are you sure you want to go to the next phase?"
                onConfirm={() => onPerformAdminAction({ action: ADMIN_ACTIONS.GO_TO_NEXT_PHASE })}
              >
                <AdminPerformActionButton
                  disabled={isLoading || state.phase === 'GAME_OVER'}
                  label="Force Next Phase"
                  className="admin-menu-drawer__button"
                />
              </Popconfirm>
              <Popconfirm
                placement="right"
                title="Are you sure you want to go to play again?"
                onConfirm={() => onPerformAdminAction({ action: ADMIN_ACTIONS.PLAY_AGAIN })}
              >
                <AdminPerformActionButton
                  // disabled={isLoading || !(state.phase === 'GAME_OVER')}
                  // Not every game is currently working with this feature
                  disabled={false}
                  label="Play Again"
                  className="admin-menu-drawer__button"
                />
              </Popconfirm>
              <Popconfirm
                placement="right"
                title="Are you sure you want to go to end the game by the end of this round?"
                onConfirm={() => onPerformAdminAction({ action: ADMIN_ACTIONS.FORCE_END_GAME })}
              >
                <AdminPerformActionButton
                  disabled={
                    state?.lastRound || isLoading || ['LOBBY', 'RULES', 'GAME_OVER'].includes(state.phase)
                  }
                  label="Make this the last round"
                  className="admin-menu-drawer__button"
                />
              </Popconfirm>
            </li>
            <li>
              <hr />
            </li>
            <li>
              <ForceStateForm
                isLoading={isLoading}
                onPerformAdminAction={onPerformAdminAction}
                state={state}
              />
            </li>
          </ul>
        </Drawer>
      </div>
    </>
  );
};
