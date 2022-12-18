import { Space } from 'antd';
import { Avatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { TDIcon } from 'components/icons/TDIcon';
import { Translate } from 'components/language';
import { useCardWidth } from 'hooks/useCardWidth';
import { SplatterSVG } from './TaskPalhetaDeFores';
import { ContenderCard } from './TaskSuperCampeonato';
import { VoteCruzaPalavras } from './VoteCruzaPalavras';
import { VoteNamoroOuAmizade } from './VoteNamoroOuAmizade';

export const VotesDelegator = ({ task, winningValues, players }: ResultComponentProps) => {
  const width = useCardWidth(Object.keys(players).length + 3, 9, 50, 120, 8);
  const playersList = Object.values(players);

  switch (task.game) {
    case 'cruza-palavras':
      return <VoteCruzaPalavras task={task} winningValues={winningValues} players={players} />;
    case 'onda-telepatica':
      return (
        <Space className="space-container" align="center" wrap>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              {player.data.value === 'center' && <Translate pt="Centro" en="Center" />}
              {player.data.value === 'left' && <Translate pt="Esquerda" en="Left" />}
              {player.data.value === 'right' && <Translate pt="Direita" en="Right" />}
            </div>
          ))}
        </Space>
      );
    case 'super-campeonato':
      return (
        <Space className="space-container" align="center" wrap>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <ImageBlurButtonContainer cardId={player.data.value}>
                <ContenderCard
                  size={width}
                  overlayColor={'yellow'}
                  contender={{
                    id: player.data.value,
                    name: { pt: '', en: '' },
                  }}
                />
              </ImageBlurButtonContainer>
            </div>
          ))}
        </Space>
      );
    case 'crimes-hediondos':
    case 'detetives-imaginativos':
    case 'galeria-de-sonhos':
    case 'porta-dos-desesperados':
    case 'testemunha-ocular':
      return (
        <Space className="space-container" align="center" wrap>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <ImageBlurButtonContainer cardId={player.data.value}>
                <ImageCard
                  key={`table-focus-${player.data.value}`}
                  imageId={player.data.value}
                  cardWidth={width}
                  className="d-table__image-card"
                />
              </ImageBlurButtonContainer>
            </div>
          ))}
        </Space>
      );
    case 'palheta-de-cores':
      return (
        <Space className="space-container" align="center" wrap>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <SplatterSVG color={player.data.value} style={{ color: player.data.value }} width={48} />
            </div>
          ))}
        </Space>
      );
    case 'fileira-de-fatos':
      return (
        <Space className="space-container" align="center" wrap>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <Translate pt={player.data.value === 'before' ? 'Antes' : 'Depois'} en={player.data.value} />
            </div>
          ))}
        </Space>
      );
    case 'namoro-ou-amizade':
      return <VoteNamoroOuAmizade task={task} winningValues={winningValues} players={players} />;
    case 'arte-ruim':
    case 'caminhos-magicos':
    case 'contadores-historias':
    case 'dilema-dos-esquiadores':
    case 'espiao-entre-nos':
    case 'mente-coletiva':
    case 'polemica-da-vez':
    case 'quem-nao-mata':
    case 'retrato-falado':
    case 'ue-so-isso':
      return (
        <Space className="space-container" align="center" wrap>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              {player.data.value}
            </div>
          ))}
        </Space>
      );

    default:
      return <TDIcon />;
  }
};
