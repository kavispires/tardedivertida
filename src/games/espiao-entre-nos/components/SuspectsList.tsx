import clsx from 'clsx';
// Ant Design Resources
import { Button, Tooltip } from 'antd';
import { AimOutlined, ClearOutlined, IssuesCloseOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { Translate } from 'components/language';

type SuspectsListProps = {
  players: GamePlayers;
};

export function SuspectsList({ players }: SuspectsListProps) {
  const { translate } = useLanguage();
  const [cache, setCache] = useGlobalState('cache');
  const sortedPlayers = sortPlayers(players);

  const onCross = (playerId: string) => {
    setCache((s) => {
      const newState = { ...s };
      if (newState[playerId]) {
        delete newState[playerId];
      } else {
        newState[playerId] = true;
      }
      return newState;
    });
  };

  const onClearCrossed = () => {
    setCache((s) => {
      const newState = { ...s };
      Object.keys(newState).forEach((key) => {
        if (key.startsWith('_')) {
          delete newState[key];
        }
      });
      return newState;
    });
  };

  return (
    <div className="e-list">
      <h3 className="e-list__title">
        <AimOutlined /> <Translate pt="Suspeitos" en="Suspects" />
        <Tooltip title={translate('Desmarcar todos', 'Unselect all')}>
          <Button
            shape="circle"
            ghost
            type="default"
            size="small"
            icon={<ClearOutlined />}
            onClick={onClearCrossed}
            className="e-list__clear-button"
          />
        </Tooltip>
      </h3>
      <ul className="e-list__list">
        {sortedPlayers.map((player) => (
          <li
            className={clsx('e-list__item', cache[player.id] && 'e-list__item--crossed')}
            key={player.id}
            role="button"
            onClick={() => onCross(player.id)}
          >
            {player.name}{' '}
            {player.usedAccusation && (
              <Tooltip title="Já usou acusação">
                <IssuesCloseOutlined size={12} />
              </Tooltip>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
