import { has, orderBy } from 'lodash';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Avatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { TDIcon } from 'icons/TDIcon';
import { Translate } from 'components/language';
import { SpacePlayerCheckWrapper } from './SpacePlayerCheckWrapper';
import { SplatterSVG } from './TaskPalhetaDeFores';
import { ContenderCard } from './TaskSuperCampeonato';
import { VoteArteRuim } from './VoteArteRuim';
import { VoteCruzaPalavras } from './VoteCruzaPalavras';
import { VoteNamoroOuAmizade } from './VoteNamoroOuAmizade';
import { VoteNaRuaDoMedo } from './VoteNaRuaDoMedo';
import { VoteRetratoFalado } from './VoteRetratoFalado';
import { VoteVamosAoCinema } from './VoteVamosAoCinema';

export const VotesDelegator = (props: Omit<VoteComponentProps, 'playersList'>) => {
  const playersList = orderBy(Object.values(props.players), ['data.value', 'name'], ['asc', 'asc']);

  const width = useCardWidth(playersList.length + 3, 9, 50, 120, 8);

  if (!playersList.every((player) => has(player, 'data.value'))) {
    return <></>;
  }

  switch (props.task.game) {
    case 'cruza-palavras':
      return <VoteCruzaPalavras {...props} playersList={playersList} />;
    case 'onda-telepatica':
      return (
        <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <div className="player-vote__value">
                {player.data?.value === 'center' && <Translate pt="Centro" en="Center" />}
                {player.data?.value === 'left' && <Translate pt="Esquerda" en="Left" />}
                {player.data?.value === 'right' && <Translate pt="Direita" en="Right" />}
              </div>
            </div>
          ))}
        </SpacePlayerCheckWrapper>
      );
    case 'super-campeonato':
      return (
        <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
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
        </SpacePlayerCheckWrapper>
      );
    case 'crimes-hediondos':
    case 'detetives-imaginativos':
    case 'galeria-de-sonhos':
    case 'porta-dos-desesperados':
    case 'testemunha-ocular':
      return (
        <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
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
        </SpacePlayerCheckWrapper>
      );
    case 'palheta-de-cores':
      return (
        <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <SplatterSVG color={player.data.value} style={{ color: player.data.value }} width={48} />
            </div>
          ))}
        </SpacePlayerCheckWrapper>
      );
    case 'fileira-de-fatos':
      return (
        <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <div className="player-vote__value">
                <Translate pt={player.data.value === 'before' ? 'Antes' : 'Depois'} en={player.data.value} />
              </div>
            </div>
          ))}
        </SpacePlayerCheckWrapper>
      );
    case 'namoro-ou-amizade':
      return <VoteNamoroOuAmizade {...props} playersList={playersList} />;
    case 'arte-ruim':
      return <VoteArteRuim {...props} playersList={playersList} />;
    case 'caminhos-magicos':
    case 'na-rua-do-medo':
      return <VoteNaRuaDoMedo {...props} playersList={playersList} />;
    case 'retrato-falado':
      return <VoteRetratoFalado {...props} playersList={playersList} />;
    case 'quem-nao-mata':
      return (
        <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <div className="player-vote__value">{props.players[player.data?.value]?.name}</div>
            </div>
          ))}
        </SpacePlayerCheckWrapper>
      );
    case 'vamos-ao-cinema':
      return <VoteVamosAoCinema {...props} playersList={playersList} />;
    case 'contadores-historias':
    case 'dilema-dos-esquiadores':
    case 'espiao-entre-nos':
    case 'mente-coletiva':
    case 'polemica-da-vez':
    case 'ue-so-isso':
      return (
        <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
          {playersList.map((player) => (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div className="player-vote__name">{player.name}</div>
              <div className="player-vote__value">{player.data?.value}</div>
            </div>
          ))}
        </SpacePlayerCheckWrapper>
      );

    default:
      return <TDIcon />;
  }
};
