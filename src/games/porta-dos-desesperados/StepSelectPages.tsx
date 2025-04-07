import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { CloseCircleFilled } from '@ant-design/icons';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { SendButton } from 'components/buttons';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageBlurButton, ImageCard, ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle, Title } from 'components/text';
// Internal
import { PORTA_DOS_DESESPERADOS_PHASES, TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';
import { mockPageSelection } from './utils/mock';
import type { SubmitPagesPayload } from './utils/types';
import { TrapPopupRule } from './components/RulesBlobs';
import { BookHighlight, DoorHighlight } from './components/Highlights';
import { DoorFrame } from '../../components/game/DoorFrame';

type StepSelectPagesProps = {
  pages: CardId[];
  currentCorridor: number;
  answerDoorId: CardId;
  trap: string;
  onSubmitPages: (payload: SubmitPagesPayload) => void;
};

export function StepSelectPages({
  pages,
  currentCorridor,
  answerDoorId,
  trap,
  onSubmitPages,
}: StepSelectPagesProps) {
  const { isLoading } = useLoading();
  const { dict: selections, updateDict: select, length: totalSelections } = useBooleanDictionary({});

  const isSelectionComplete =
    trap === TRAPS.MORE_CLUES ? totalSelections === 3 : totalSelections > 0 && totalSelections < 3;

  const showTrap = useMemo(
    () => shouldAnnounceTrap(trap, PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION),
    [trap],
  );

  // DEV Only
  useMock(() => {
    onSubmitPages({ pageIds: mockPageSelection(pages, trap) });
  });

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate
          pt={
            <>
              Ajude os jogadores a encontrar a porta <DoorHighlight>{currentCorridor}</DoorHighlight>:
            </>
          }
          en={
            <>
              Help players find the door <DoorHighlight>{currentCorridor}</DoorHighlight>:
            </>
          }
        />
      </StepTitle>

      {showTrap && <TrapPopupRule trap={trap} />}

      <SpaceContainer>
        <DoorFrame width={200}>
          <ImageCard
            id={answerDoorId}
            cardWidth={150}
            className={clsx(trap === TRAPS.FADED_DOORS && 'i-faded-card')}
            preview={{
              className: clsx(trap === TRAPS.FADED_DOORS && 'image-preview-faded'),
            }}
          />
        </DoorFrame>

        <ImageBlurButton cardId={answerDoorId} />
      </SpaceContainer>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Acima está a porta que você deve ajudar os outros jogadores a selecionar. <br />
              Consulte as páginas do livro (cartas) e <strong>selecione</strong> as que você acha que mais vão
              ajudar!
            </>
          }
          en={
            <>
              Above it's the door you need to help the other players to find.
              <br />
              Check the book pages(cards) below and <strong>select</strong> the one you think will help them
              best!
            </>
          }
        />

        {trap === TRAPS.MORE_CLUES && (
          <>
            <br />
            <strong>
              <Translate
                pt={
                  <>
                    Selecione exatamente <BookHighlight>3</BookHighlight> páginas do livro
                  </>
                }
                en={
                  <>
                    Select exactly <BookHighlight>3</BookHighlight> book pages
                  </>
                }
              />
            </strong>
          </>
        )}
      </RuleInstruction>

      {isSelectionComplete && (
        <SendButton
          type="primary"
          size="large"
          loading={isLoading}
          disabled={!isSelectionComplete}
          onClick={() => onSubmitPages({ pageIds: Object.keys(selections) })}
          className={getAnimationClass('tada')}
        >
          <Translate pt="Enviar Páginas" en="Submit Pages" />
        </SendButton>
      )}

      <Instruction contained>
        <Title size="xx-small">
          <Translate pt="Páginas selecionadas" en="Selected Pages" />
        </Title>

        {Object.keys(selections).length < 2 && (
          <p>
            {trap === TRAPS.MORE_CLUES ? (
              <Translate
                pt={
                  <>
                    Selecione exatamente <BookHighlight>3</BookHighlight> páginas do livro
                  </>
                }
                en={
                  <>
                    Select exactly <BookHighlight>3</BookHighlight> book pages
                  </>
                }
              />
            ) : (
              <Translate
                pt={
                  <>
                    Selecione <BookHighlight>1</BookHighlight> ou <BookHighlight>2</BookHighlight> páginas do
                    livro
                  </>
                }
                en={
                  <>
                    Select <BookHighlight>1</BookHighlight> or <BookHighlight>2</BookHighlight> book pages
                  </>
                }
              />
            )}
          </p>
        )}

        <ImageCardHand
          hand={Object.keys(selections)}
          cardSize={100}
          selectButtonIcon={<CloseCircleFilled />}
          selectButtonText={<Translate pt="Remover" en="Remove" />}
          onSelectCard={select}
          cardClassName={clsx(trap === TRAPS.SEPIA && 'i-sepia-card')}
          imageGroupPreview={{
            className: clsx(trap === TRAPS.SEPIA && 'image-preview-sepia'),
          }}
        />
      </Instruction>

      <FloatingHand title={<Translate pt="Páginas do Livro" en="Book Pages" />}>
        <ImageCardHand
          hand={pages}
          onSelectCard={select}
          disabledSelectButton={isLoading}
          sizeRatio={8}
          selectedCards={selections}
          cardClassName={clsx(trap === TRAPS.SEPIA && 'i-sepia-card')}
          imageGroupPreview={{
            className: clsx(trap === TRAPS.SEPIA && 'image-preview-sepia'),
          }}
        />
      </FloatingHand>
    </Step>
  );
}
