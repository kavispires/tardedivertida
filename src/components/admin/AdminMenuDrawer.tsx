import { useState } from 'react';
// Ant Design Resources
import { FireFilled } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
// Types
import type { GameState } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGameMeta } from 'hooks/useGameMeta';
import { useGlobalState } from 'hooks/useGlobalState';
import { useHostActionRequest } from 'hooks/useHostActionRequest';
import { useLoading } from 'hooks/useLoading';
// Services
import { HOST_API_ACTIONS } from 'services/adapters';
import { getFirestoreConsoleUrl } from 'services/firebase';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language';
// Internal
import { AdminPerformActionButton } from './_internal/AdminPerformActionButton';
import { ForceStateForm } from './_internal/ForceStateForm';
import { PlayersReadyState } from './_internal/PlayersReadyState';
// Sass
import './AdminMenuDrawer.scss';

type AdminMenuDrawerProps = {
  /**
   * The game state
   */
  state: GameState;
  /**
   * The game players
   */
  players: GamePlayers;
};

export const AdminMenuDrawer = ({ state, players }: AdminMenuDrawerProps) => {
  const { isLoading } = useLoading();
  const { isAdmin } = useCurrentUserContext();
  const [usingFirestoreEmulator] = useGlobalState('usingFirestoreEmulator');
  const [isAdminEnabled] = useGlobalState('isAdminEnabled');
  const [visible, setVisible] = useState(false);
  const { meta } = useGameMeta();

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onPerformAdminAction = useHostActionRequest({
    actionName: 'perform-admin-action',
    successMessage: 'Admin action performed successfully',
    errorMessage: 'The selected admin action has failed',
    onAfterCall: onClose,
  });

  if (!isAdmin || !isAdminEnabled || !state.phase) return <span></span>;

  return (
    <div className="admin-menu-drawer">
      <FixedMenuButton
        position={-1}
        icon={<FireFilled />}
        type="button"
        label={<Translate pt=" Admin" en=" Admin" />}
        onClick={showDrawer}
        buttonProps={{
          type: 'default',
        }}
      />

      <Drawer title="Admin Menu" placement="left" closable={false} open={visible} onClose={onClose}>
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
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.GO_TO_NEXT_PHASE })}
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
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.PLAY_AGAIN })}
            >
              <AdminPerformActionButton
                // Not every game is currently working with this feature
                // disabled={isLoading || !(state.phase === 'GAME_OVER')}
                disabled
                label="Play Again"
                className="admin-menu-drawer__button"
              />
            </Popconfirm>
            <Popconfirm
              placement="right"
              title="Are you sure you want to go to end the game by the end of this round?"
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.FORCE_END_GAME })}
            >
              <AdminPerformActionButton
                disabled={
                  state?.round?.forceLastRound || isLoading || ['LOBBY', 'GAME_OVER'].includes(state.phase)
                }
                label={
                  state?.round.forceLastRound
                    ? 'This is already set as the last round'
                    : 'Make this the last round'
                }
                className="admin-menu-drawer__button"
              />
            </Popconfirm>
            <Popconfirm
              placement="right"
              title="Are you sure you want to go to the lobby and unlock the game?"
              onConfirm={() => onPerformAdminAction({ action: HOST_API_ACTIONS.RESET_GAME })}
            >
              <AdminPerformActionButton
                disabled={state?.phase === 'LOBBY'}
                label="Reset and restart"
                className="admin-menu-drawer__button"
              />
            </Popconfirm>
          </li>
          <li>
            <hr />
          </li>
          <li>
            <ForceStateForm isLoading={isLoading} onPerformAdminAction={onPerformAdminAction} state={state} />
          </li>
          <li>
            <hr />
          </li>
          <li>
            <h3>Firebase</h3>
            <Button
              target="_blank"
              href={getFirestoreConsoleUrl(
                `games/${meta.gameName}/${meta.gameId}/state`,
                !!usingFirestoreEmulator,
              )}
            >
              Visit Firebase Collection
            </Button>
          </li>
        </ul>
      </Drawer>
    </div>
  );
};
