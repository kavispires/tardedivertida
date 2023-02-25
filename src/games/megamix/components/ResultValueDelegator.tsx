// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { AvatarName } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { TDIcon } from 'icons/TDIcon';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { DoorFrame } from 'games/porta-dos-desesperados/components/DoorFrame';
import { ResultArteRuim } from './ResultArteRuim';
import { ResultCaminhosMagicos } from './ResultCaminhosMagicos';
import { ResultCruzaPalavras } from './ResultCruzaPalavras';
import { ResultNamoroOuAmizade } from './ResultNamoroOuAmizade';
import { ResultNaRuaDoMedo } from './ResultNaRuaDoMedo';
import { ResultRetratoFalado } from './ResultRetratoFalado';
import { ResultVamosAoCinema } from './ResultVamosNoCinema';
import { SplatterSVG } from './TaskPalhetaDeFores';
import { ContenderCard } from './TaskSuperCampeonato';
import { WinningCount } from './WinningCount';

export const ResultValueDelegator = (props: Omit<ResultComponentProps, 'playersList'>) => {
  const width = useCardWidth(props.winningValues.length + 1, 9, 80, 200, 0, 'results-values');

  switch (props.task.game) {
    case 'arte-ruim':
      return <ResultArteRuim {...props} />;
    case 'caminhos-magicos':
      return <ResultCaminhosMagicos {...props} />;
    case 'contadores-historias':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A história mais popular foi" en="The most popular story was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );
    case 'crimes-hediondos':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="O item mais votado foi" en="The most voted item was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((cardId) => (
              <ImageBlurButtonContainer cardId={cardId} key={`table-focus-${cardId}`}>
                <ImageCard imageId={cardId} cardWidth={width} className="d-table__image-card" />
              </ImageBlurButtonContainer>
            ))}
          </div>
        </>
      );
    case 'cruza-palavras':
      return <ResultCruzaPalavras {...props} />;
    case 'detetives-imaginativos':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="O impostor mais votado foi" en="The most voted impostor was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((cardId) => (
              <ImageBlurButtonContainer cardId={cardId} key={`table-focus-${cardId}`}>
                <ImageCard imageId={cardId} cardWidth={width} className="d-table__image-card" />
              </ImageBlurButtonContainer>
            ))}
          </div>
        </>
      );
    case 'dilema-dos-esquiadores':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="O lado mais popular foi" en="The most popular side was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );
    case 'espiao-entre-nos':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="Respostas mais dadas" en="Best answers" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );
    case 'fileira-de-fatos':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A melhor resposta foi" en="The best answer was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                <Translate pt={value === 'before' ? 'Antes' : 'Depois'} en={value} />
              </div>
            ))}
          </div>
        </>
      );
    case 'galeria-de-sonhos':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A sonho mais visitado foi" en="The most visited dream was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                <ImageBlurButtonContainer cardId={value}>
                  <ImageCard
                    key={`table-focus-${value}`}
                    imageId={value}
                    cardWidth={width}
                    className="d-table__image-card"
                  />
                </ImageBlurButtonContainer>
              </div>
            ))}
          </div>
        </>
      );
    case 'mente-coletiva':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A resposta mais comum foi" en="The most common answer was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );

    case 'namoro-ou-amizade':
      return <ResultNamoroOuAmizade {...props} />;
    case 'na-rua-do-medo':
      return <ResultNaRuaDoMedo {...props} />;
    case 'onda-telepatica':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A mais votado foi" en="The most voted was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value === 'center' && <Translate pt="Centro" en="Center" />}
                {value === 'left' && <Translate pt="Esquerda" en="Left" />}
                {value === 'right' && <Translate pt="Direita" en="Right" />}
              </div>
            ))}
          </div>
        </>
      );
    case 'palheta-de-cores':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A amostra mais selecionada foi" en="The most selected swatch was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                <SplatterSVG color={value} style={{ color: value }} width={48} />
              </div>
            ))}
          </div>
        </>
      );
    case 'polemica-da-vez':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A quantidade de curtidas foi" en="The number of likes was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );

    case 'porta-dos-desesperados':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A saída era na porta" en="The Exit was on this door" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((cardId) => (
              <ImageBlurButtonContainer cardId={cardId} key={cardId}>
                <DoorFrame width={width}>
                  <ImageCard imageId={cardId} cardWidth={150} />
                </DoorFrame>
              </ImageBlurButtonContainer>
            ))}
          </div>
        </>
      );
    case 'quem-nao-mata':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="O mais morto foi" en="The most killed was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                <AvatarName player={props.players[value]} />
              </div>
            ))}
          </div>
        </>
      );
    case 'retrato-falado':
      return <ResultRetratoFalado {...props} />;
    case 'super-campeonato':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="O campeão é" en="And the champion is" />:
          </Instruction>
          {props.winningValues.map((cardId) => (
            <ImageBlurButtonContainer cardId={cardId} key={cardId}>
              <ContenderCard
                size={width}
                overlayColor={'yellow'}
                contender={{
                  id: cardId,
                  name: { pt: '', en: '' },
                }}
              />
            </ImageBlurButtonContainer>
          ))}
        </>
      );
    case 'testemunha-ocular':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="O criminoso mais votado foi" en="The perpetrator with most votes was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                <ImageCard
                  key={`table-focus-${value}`}
                  imageId={value}
                  cardWidth={width}
                  className="d-table__image-card"
                />
              </div>
            ))}
          </div>
        </>
      );
    case 'ue-so-isso':
      return (
        <>
          <WinningCount>{props.winningTeam.length}</WinningCount>
          <Instruction>
            <Translate pt="A dica eliminada foi" en="The eliminated clue was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {props.winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );
    case 'vamos-ao-cinema':
      return <ResultVamosAoCinema {...props} />;

    default:
      return <TDIcon />;
  }
};
