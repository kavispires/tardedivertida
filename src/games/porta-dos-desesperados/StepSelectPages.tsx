import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { CloseCircleFilled } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { FloatingHand } from '@components/general/FloatingHand';
import { ImageBlurButton } from '@components/image-cards/ImageBlurButton';
import { ImageCard } from '@components/image-cards/ImageCard';
import { ImageCardHand } from '@components/image-cards/ImageCardHand';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { TitledContainer } from '@components/layout/TitledContainer';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { PORTA_DOS_DESESPERADOS_PHASES, TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';
import { mockPageSelection } from './utils/mock';
import type { SubmitPagesPayload, TrapEntry } from './utils/types';
import { TrapPopupRule } from './components/RulesBlobs';
import { BookHighlight, DoorHighlight } from './components/Highlights';
import { DoorFrame } from '../../components/game-elements/DoorFrame';

type StepSelectPagesProps = {
  pages: UID[];
  currentCorridor: number;
  answerDoorId: UID;
  trap: string;
  trapEntry: TrapEntry | null;
  onSubmitPages: (payload: SubmitPagesPayload) => void;
};

export function StepSelectPages({
  pages,
  currentCorridor,
  answerDoorId,
  trap,
  trapEntry,
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

  const selectedIds = Object.keys(selections);

  // DEV Only
  useMock(() => {
    onSubmitPages({ pageIds: mockPageSelection(pages, trap) });
  });

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate
          pt="Ajude os jogadores a encontrar a porta {door}:"
          en="Help players find the door {door}:"
          values={{
            door: <DoorHighlight>{currentCorridor}</DoorHighlight>,
          }}
        />
      </StepTitle>

      {showTrap && <TrapPopupRule trapEntry={trapEntry} />}

      <SpaceContainer>
        <DoorFrame width={200}>
          <ImageCard
            cardId={answerDoorId}
            cardWidth={150}
            className={clsx(trap === TRAPS.FADED_DOORS && 'i-faded-card')}
            preview={{
              // TODO: AntD bug: it should be classnames.body but it's not working
              rootClassName: clsx({ 'image-preview-fading': trap === TRAPS.FADED_DOORS }),
            }}
          />
        </DoorFrame>

        <ImageBlurButton cardId={answerDoorId} />
      </SpaceContainer>

      <RuleInstruction type="action">
        <Translate
          pt="Acima está a porta que você deve ajudar os outros jogadores a selecionar.
          <br/>
          Consulte as páginas do livro (cartas) abaixo e <strong>selecione</strong> as que você acha que mais vão ajudar!"
          en="Above it's the door you need to help the other players to find.
          <br/>
          Check the book pages(cards) below and <strong>select</strong> the one you think will help them best!"
        />

        {trap === TRAPS.MORE_CLUES && (
          <>
            <br />
            <strong>
              <Translate
                pt="Selecione exatamente {pageCount} páginas do livro"
                en="Select exactly {pageCount} book pages"
                values={{
                  pageCount: <BookHighlight>3</BookHighlight>,
                }}
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
          onClick={() => onSubmitPages({ pageIds: selectedIds })}
          className={getAnimationClass('tada')}
        >
          <Translate
            pt="Enviar Páginas"
            en="Submit Pages"
          />
        </SendButton>
      )}

      <TitledContainer
        title={
          <Translate
            pt="Páginas selecionadas"
            en="Selected Pages"
          />
        }
      >
        <Surface
          contained
          style={{ margin: 0, padding: 16 }}
        >
          <div>
            {trap === TRAPS.MORE_CLUES ? (
              <Translate
                pt="Selecione exatamente {pageCount} páginas do livro"
                en="Select exactly {pageCount} book pages"
                values={{
                  pageCount: <BookHighlight>3</BookHighlight>,
                }}
              />
            ) : (
              <Translate
                pt="Selecione <pages>ou</pages> páginas do livro"
                en="Select <pages>or</pages> book pages"
                values={{
                  pages: (text) => (
                    <BookHighlight>
                      <strong>1</strong> {text} <strong>2</strong>
                    </BookHighlight>
                  ),
                }}
              />
            )}
          </div>

          <ImageCardHand
            hand={selectedIds}
            cardSize={100}
            selectButtonIcon={<CloseCircleFilled />}
            selectButtonText={
              <Translate
                pt="Remover"
                en="Remove"
              />
            }
            onSelectCard={select}
            cardClassName={clsx(trap === TRAPS.SEPIA && 'i-sepia-card')}
            imageGroupPreview={trap === TRAPS.SEPIA}
            imageGroupPreviewClassNames={{
              popup: {
                body: 'image-preview-sepia',
              },
            }}
          />
        </Surface>
      </TitledContainer>

      <FloatingHand
        title={
          <Translate
            pt="Páginas do Livro"
            en="Book Pages"
          />
        }
      >
        {trap === TRAPS.FLIP_BOOK ? (
          <FlipBookHand
            pages={pages}
            onSelectPage={select}
            disabledSelectButton={selectedIds.length === 4 || isLoading}
            selectedCards={selections}
          />
        ) : (
          <Flex>
            <ImageCardHand
              hand={pages}
              onSelectCard={select}
              disabledSelectButton={selectedIds.length === 4 || isLoading}
              sizeRatio={8}
              preview={trap !== TRAPS.NO_PREVIEW}
              selectedCards={selections}
              cardClassName={clsx({ 'i-sepia-card': trap === TRAPS.SEPIA })}
              imageGroupPreview={trap !== TRAPS.NO_PREVIEW}
              imageGroupPreviewClassNames={
                trap === TRAPS.SEPIA
                  ? {
                      popup: {
                        body: 'image-preview-sepia',
                      },
                    }
                  : undefined
              }
            />
          </Flex>
        )}
      </FloatingHand>
    </Step>
  );
}

type FlipBookHandProps = {
  pages: UID[];
  onSelectPage: (pageId: UID) => void;
  disabledSelectButton?: boolean;
  selectedCards: Dictionary<boolean>;
};

function FlipBookHand({ pages, onSelectPage, disabledSelectButton, selectedCards }: FlipBookHandProps) {
  const [spread, setSpread] = useState(0);

  // Every spread should show 2 pages and the user must decide to select them or now and the only option to go forward until the final spread
  const currentPages = pages.slice(spread * 2, spread * 2 + 2);

  const isFinalPage = (spread + 1) * 2 >= pages.length;

  return (
    <Flex
      align="center"
      justify="center"
      gap={16}
    >
      <div className="i-flip-book-hand">
        <ImageCardHand
          hand={currentPages}
          onSelectCard={onSelectPage}
          disabledSelectButton={disabledSelectButton}
          sizeRatio={8}
          selectedCards={selectedCards}
        />
      </div>
      {!isFinalPage && (
        <Flex
          vertical
          align="center"
          gap={8}
        >
          <Typography.Text
            style={{ maxWidth: 256 }}
            className="i-text-center"
          >
            <Translate
              pt="Você deve decidir se quer alguma dessas páginas ou não antes de prosseguir. Você pode selecionar até 4 páginas no total, antes de finalizar as (no máximo) 2 escolhas finais."
              en="You must decide whether you want any of these pages or not before proceeding. You can select up to 4 pages in total, before finalizing the (at most) 2 final choices."
            />
          </Typography.Text>
          <Button
            size="large"
            disabled={(spread + 1) * 2 >= pages.length}
            onClick={() => setSpread((s) => s + 1)}
          >
            <Translate
              pt="Próxima Página Para Sempre ({remaining} restantes)"
              en="Next Page Forever ({remaining} left)"
              values={{
                remaining: pages.length - (spread + 1) * 2,
              }}
            />
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
