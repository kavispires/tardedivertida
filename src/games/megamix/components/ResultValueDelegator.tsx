import { AvatarName } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { TDIcon } from 'components/icons/TDIcon';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { DoorFrame } from 'games/porta-dos-desesperados/components/DoorFrame';
import { useCardWidth } from 'hooks/useCardWidth';
import { ResultArteRuim } from './ResultArteRuim';
import { ResultCaminhosMagicos } from './ResultCaminhosMagicos';
import { ResultCruzaPalavras } from './ResultCruzaPalavras';
import { ResultNamoroOuAmizade } from './ResultNamoroOuAmizade';
import { ResultRetratoFalado } from './ResultRetratoFalado';
import { SplatterSVG } from './TaskPalhetaDeFores';
import { ContenderCard } from './TaskSuperCampeonato';

export const ResultValueDelegator = ({ task, winningValues, players }: ResultComponentProps) => {
  const width = useCardWidth(winningValues.length + 1, 9, 80, 200, 0, 'results-values');

  switch (task.game) {
    case 'arte-ruim':
      return <ResultArteRuim task={task} winningValues={winningValues} players={players} />;
    case 'caminhos-magicos':
      return <ResultCaminhosMagicos task={task} winningValues={winningValues} players={players} />;
    case 'contadores-historias':
      return (
        <>
          <Instruction>
            <Translate pt="A história mais popular foi" en="The most popular story was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="O item mais votado foi" en="The most voted item was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((cardId) => (
              <ImageBlurButtonContainer cardId={cardId}>
                <ImageCard
                  key={`table-focus-${cardId}`}
                  imageId={cardId}
                  cardWidth={width}
                  className="d-table__image-card"
                />
              </ImageBlurButtonContainer>
            ))}
          </div>
        </>
      );
    case 'cruza-palavras':
      return <ResultCruzaPalavras task={task} winningValues={winningValues} players={players} />;
    case 'detetives-imaginativos':
      return (
        <>
          <Instruction>
            <Translate pt="O impostor mais votado foi" en="The most voted impostor was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((cardId) => (
              <ImageBlurButtonContainer cardId={cardId}>
                <ImageCard
                  key={`table-focus-${cardId}`}
                  imageId={cardId}
                  cardWidth={width}
                  className="d-table__image-card"
                />
              </ImageBlurButtonContainer>
            ))}
          </div>
        </>
      );
    case 'dilema-dos-esquiadores':
      return (
        <>
          <Instruction>
            <Translate pt="O lado mais popular foi" en="The most popular side was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="Respostas mais dadas" en="Best answers" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="A melhor resposta foi" en="The best answer was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="A sonho mais visitado foi" en="The most visited dream was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="A resposta mais comum foi" en="The most common answer was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );

    case 'namoro-ou-amizade':
      return <ResultNamoroOuAmizade task={task} winningValues={winningValues} players={players} />;
    case 'onda-telepatica':
      return (
        <>
          <Instruction>
            <Translate pt="A mais votado foi" en="The most voted was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="A amostra mais selecionada foi" en="The most selected swatch was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="A quantidade de curtidas foi" en="The number of likes was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="A saída era na porta" en="The Exit was on this door" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((cardId) => (
              <ImageBlurButtonContainer cardId={cardId}>
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
          <Instruction>
            <Translate pt="O mais morto foi" en="The most killed was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                <AvatarName player={players[value]} />
              </div>
            ))}
          </div>
        </>
      );
    case 'retrato-falado':
      return <ResultRetratoFalado task={task} winningValues={winningValues} players={players} />;
    case 'super-campeonato':
      return (
        <>
          <Instruction>
            <Translate pt="O campeão é" en="And the champion is" />:
          </Instruction>
          {winningValues.map((cardId) => (
            <ImageBlurButtonContainer cardId={cardId}>
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
          <Instruction>
            <Translate pt="O criminoso mais votado foi" en="The perpetrator with most votes was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
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
          <Instruction>
            <Translate pt="A dica eliminada foi" en="The eliminated clue was" />:
          </Instruction>
          <div className="task-result-values__cards">
            {winningValues.map((value) => (
              <div key={value} className="task-result-values__text-value">
                {value}
              </div>
            ))}
          </div>
        </>
      );

    default:
      return <TDIcon />;
  }
};
