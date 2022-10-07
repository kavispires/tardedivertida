import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useSepiaPreview } from './utils/useSepiaPreview';
// Utils
import { PHASES } from 'utils/phases';
import { TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';
import { mockPageSelection } from './utils/mock';
// Components
import { FloatingHand, ImageBlurButton, ImageCard, ImageCardHand } from 'components/cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { DoorFrame } from './components/DoorFrame';
import { TrapPopupRule } from './components/RulesBlobs';
import { getAnimationClass } from 'utils/helpers';

type StepSelectPagesProps = {
  pages: CardId[];
  currentCorridor: number;
  answerDoorId: CardId;
  trap: string;
  onSubmitPages: GenericFunction;
};

export function StepSelectPages({
  pages,
  currentCorridor,
  answerDoorId,
  trap,
  onSubmitPages,
}: StepSelectPagesProps) {
  const { isLoading } = useLoading();
  const [selections, select] = useBooleanDictionary({});

  const totalSelections = Object.keys(selections).length;
  const isSelectionComplete =
    trap === TRAPS.MORE_CLUES ? totalSelections === 3 : totalSelections > 0 && totalSelections < 3;

  const showTrap = useMemo(
    () => shouldAnnounceTrap(trap, PHASES.PORTA_DOS_DESESPERADOS.BOOK_POSSESSION),
    [trap]
  );

  useSepiaPreview(trap === TRAPS.SEPIA);

  // DEV Only
  useMock(() => {
    onSubmitPages({ pageIds: mockPageSelection(pages, trap) });
  });

  return (
    <Step fullWidth>
      <Title size="medium" white>
        <Translate
          pt={
            <>
              Ajude os jogadores a encontrar a <TextHighlight>Porta {currentCorridor}</TextHighlight>:
            </>
          }
          en={
            <>
              Help players find <TextHighlight>Door {currentCorridor}</TextHighlight>:
            </>
          }
        />
      </Title>

      {showTrap && <TrapPopupRule trap={trap} />}

      <Space className="space-container">
        <DoorFrame width={200}>
          <ImageCard imageId={answerDoorId} cardWidth={150} />
        </DoorFrame>

        <ImageBlurButton cardId={answerDoorId} />
      </Space>

      <Instruction contained>
        <Translate
          pt={
            <>
              Acima está a porta que você deve ajudar os outros jogadores a selecionar. <br />
              Consulte as páginas do livro (cartas) e selecione as que você acha que mais vão ajudar!
            </>
          }
          en={
            <>
              Above it's the door you need to help the other players to find.
              <br />
              Check the book pages(cards) below and select the one you think will help them best!
            </>
          }
        />

        {trap === TRAPS.MORE_CLUES && (
          <>
            <br />
            <strong>
              <Translate pt="Selecione exatamente 3 páginas do livro." en="Select exactly 3 book pages." />
            </strong>
          </>
        )}
      </Instruction>

      {isSelectionComplete && (
        <Button
          type="primary"
          size="large"
          loading={isLoading}
          disabled={!isSelectionComplete}
          onClick={() => onSubmitPages({ pageIds: Object.keys(selections) })}
          className={getAnimationClass('tada')}
        >
          <Translate pt="Enviar Páginas" en="Submit Pages" />
        </Button>
      )}

      <Instruction contained>
        <Title size="xx-small">
          <Translate pt="Páginas selecionadas" en="Selected Pages" />
        </Title>

        {Object.keys(selections).length === 0 && (
          <p>
            {trap === TRAPS.MORE_CLUES ? (
              <Translate pt="Selecione exatamente 3 páginas do livro" en="Select exactly 3 book pages" />
            ) : (
              <Translate pt="Selecione 1 ou 2 páginas do livro" en="Select 1 or 2 book pages" />
            )}
          </p>
        )}

        <ImageCardHand
          hand={Object.keys(selections)}
          cardSize={100}
          selectButtonIcon={<CloseCircleFilled />}
          selectButtonLabel={<Translate pt="Remover" en="Remove" />}
          onSelectCard={select}
          cardClassName={clsx(trap === TRAPS.SEPIA && 'i-sepia-card')}
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
        />
      </FloatingHand>
    </Step>
  );
}
