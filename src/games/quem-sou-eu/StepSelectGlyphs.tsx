// Ant Design Resources
import { Button, Popover, Space, Tooltip } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useCardWidth } from 'hooks/useCardWidth';
import { useDelayedMock } from 'hooks/useMock';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { prepareGlyphs } from './utils/helpers';
import { mockGlyphs } from './utils/mock';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { Table } from './components/Table';
import { GlyphCard } from 'components/cards/GlyphCard';
import { YesIcon } from 'components/icons/YesIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { NoIcon } from 'components/icons/NoIcon';
import { NegativeHighlight, PositiveHighlight } from './components/Highlights';

type StepSelectGlyphsProps = {
  user: GamePlayer;
  onSelectGlyphs: GenericFunction;
  characters: Characters;
  tableOrder: CardId[];
  roundType: 'SHOW' | 'HIDE';
} & AnnouncementProps;

const SELECTIONS_PLACEHOLDER = [0, 1, 2];

export function StepSelectGlyphs({
  user,
  announcement,
  onSelectGlyphs,
  characters,
  tableOrder,
  roundType,
}: StepSelectGlyphsProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const glyphWidth = useCardWidth(20, 16, 50, 75);
  const selectedWidth = glyphWidth + 15;

  const [positiveSelection, updatePositive] = useBooleanDictionary({});
  const positiveSelections = Object.keys(positiveSelection);
  const [negativeSelection, updateNegative] = useBooleanDictionary({});
  const negativeSelections = Object.keys(negativeSelection);

  const glyphs = user.glyphs ?? [];

  useDelayedMock(() => {
    onSelectGlyphs({ glyphs: mockGlyphs(glyphs) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={<>Descreva seu personagem com ícones</>}
          en={<>Describe your character with glyphs</>}
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Dos ícones abaixo, você pode selecionar até <PositiveHighlight>3</PositiveHighlight> positivos e
              até <NegativeHighlight>3</NegativeHighlight> negativos.
              <br /> Quando você clica em ícone, você determina se ele é relacionado ao seu personagem ou não.
              <br />
              Você também pode ver todos os personagens abaixo caso queira evitar conflito com outros
              jogadores.
            </>
          }
          en={
            <>
              From the glyphs below, you may select up to <PositiveHighlight>3</PositiveHighlight> positive
              and <NegativeHighlight>3</NegativeHighlight> negative glyphs.
              <br />
              When you click on a glyph, you will determine if it's related or not to your character.
              <br />
              You can also take a look at all the characters for this round so you don't give clues that match
              others.
            </>
          }
        />
      </Instruction>

      <Table
        characters={characters}
        playerCharacterId={user.character?.id}
        tableOrder={tableOrder}
        showAll={roundType === 'SHOW'}
      />

      <Space className="space-container q-selections">
        <div className="q-selections__section q-selections__section--positive">
          {SELECTIONS_PLACEHOLDER.map((entry) => {
            const id = positiveSelections[entry];

            return (
              <div className="q-selections__positive" key={`pos-${entry}-${id}`}>
                <div className="q-selections__entry">
                  <IconAvatar icon={<YesIcon />} />
                  {id !== undefined ? (
                    <TransparentButton
                      onClick={() => updatePositive(id)}
                      title={translate('Remover', 'Remove')}
                    >
                      <Tooltip title={<Translate pt="Remover" en="Remove" />}>
                        <GlyphCard width={selectedWidth} id={id} />
                      </Tooltip>
                    </TransparentButton>
                  ) : (
                    <div
                      className="q-selections__no-glyph"
                      style={{ width: `${selectedWidth}px`, height: `${selectedWidth}px` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="q-selections__section q-selections__section--negative">
          {SELECTIONS_PLACEHOLDER.map((entry) => {
            const id = negativeSelections[entry];
            return (
              <div className="q-selections__positive" key={`neg-${entry}-${id}`}>
                <div className="q-selections__entry">
                  <IconAvatar icon={<NoIcon />} />
                  {id !== undefined ? (
                    <TransparentButton onClick={() => updateNegative(id)}>
                      <Tooltip title={<Translate pt="Remover" en="Remove" />} trigger="hover">
                        <GlyphCard width={selectedWidth} id={id} />
                      </Tooltip>
                    </TransparentButton>
                  ) : (
                    <div
                      className="q-selections__no-glyph"
                      style={{ width: `${selectedWidth}px`, height: `${selectedWidth}px` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Space>

      <Space className="glyphs" wrap>
        {glyphs.map((glyphId: string) => (
          <Popover
            content={
              <PopoverGlyph
                id={glyphId}
                updatePositive={updatePositive}
                updateNegative={updateNegative}
                disablePositive={positiveSelections.length === 3}
                disableNegative={negativeSelections.length === 3}
              />
            }
            title={<Translate pt="Positivo ou Negativo?" en="Positive or Negative" />}
            trigger="click"
          >
            <TransparentButton>
              <GlyphCard width={glyphWidth} id={glyphId} />
            </TransparentButton>
          </Popover>
        ))}
      </Space>

      <Space className="space-container">
        <Button
          size="large"
          type="primary"
          onClick={() => onSelectGlyphs({ glyphs: prepareGlyphs(positiveSelection, negativeSelection) })}
          disabled={
            isLoading || user.ready || (positiveSelections.length < 1 && negativeSelections.length < 1)
          }
        >
          <Translate pt={<>Enviar ícones</>} en={<>Submit glyphs</>} />
        </Button>
      </Space>
    </Step>
  );
}

type PopoverGlyphProps = {
  id: CardId;
  updatePositive: GenericFunction;
  updateNegative: GenericFunction;
  disablePositive: boolean;
  disableNegative: boolean;
};

function PopoverGlyph({
  id,
  updatePositive,
  updateNegative,
  disablePositive,
  disableNegative,
}: PopoverGlyphProps) {
  return (
    <Space>
      <TransparentButton onClick={() => updatePositive(id)} disabled={disablePositive}>
        <IconAvatar icon={<YesIcon />} size="large" />
      </TransparentButton>
      <TransparentButton onClick={() => updateNegative(id)} disabled={disableNegative}>
        <IconAvatar icon={<NoIcon />} size="large" />
      </TransparentButton>
    </Space>
  );
}
