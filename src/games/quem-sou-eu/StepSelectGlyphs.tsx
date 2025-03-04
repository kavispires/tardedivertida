// Ant Design Resources
import { Popover, Space, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Icons
import { NoIcon } from 'icons/NoIcon';
import { YesIcon } from 'icons/YesIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SendButton, TransparentButton } from 'components/buttons';
import { GlyphCard } from 'components/cards/GlyphCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Characters, SubmitGlyphsPayload } from './utils/types';
import { prepareGlyphs } from './utils/helpers';
import { mockGlyphs } from './utils/mock';
import type { ROUND_TYPE } from './utils/constants';
import { Table } from './components/Table';
import { NegativeHighlight, PositiveHighlight } from './components/Highlights';

type StepSelectGlyphsProps = {
  user: GamePlayer;
  onSelectGlyphs: (payload: SubmitGlyphsPayload) => void;
  characters: Characters;
  tableOrder: CardId[];
  roundType: (typeof ROUND_TYPE)[keyof typeof ROUND_TYPE];
  imageCardMode: boolean;
} & Pick<StepProps, 'announcement'>;

const SELECTIONS_PLACEHOLDER = [0, 1, 2];

export function StepSelectGlyphs({
  user,
  announcement,
  onSelectGlyphs,
  characters,
  tableOrder,
  roundType,
  imageCardMode,
}: StepSelectGlyphsProps) {
  const { translate } = useLanguage();
  const glyphWidth = useCardWidth(20, {
    gap: 16,
    minWidth: 50,
    maxWidth: 75,
  });
  const selectedWidth = glyphWidth + 15;

  const {
    dict: positiveSelection,
    updateDict: updatePositive,
    keys: positiveSelections,
  } = useBooleanDictionary({});

  const {
    dict: negativeSelection,
    updateDict: updateNegative,
    keys: negativeSelections,
  } = useBooleanDictionary({});

  const glyphs = user.glyphs ?? [];

  useMock(() => {
    onSelectGlyphs({ glyphs: mockGlyphs(glyphs) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate
          pt={<>Descreva seu personagem com ícones</>}
          en={<>Describe your character with glyphs</>}
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Dos ícones abaixo, você pode selecionar até <PositiveHighlight>3</PositiveHighlight> positivos e
              até <NegativeHighlight>3</NegativeHighlight> negativos.
              <br /> Quando você clica em ícone, você determina se ele é relacionado ao seu personagem ou não.
              <br />
              <strong>A sua carta é a que tem a borda de bolinhas amarelas!</strong>
            </>
          }
          en={
            <>
              From the glyphs below, you may select up to <PositiveHighlight>3</PositiveHighlight> positive
              and <NegativeHighlight>3</NegativeHighlight> negative glyphs.
              <br />
              When you click on a glyph, you will determine if it's related or not to your character.
              <br />
              <strong>Your card is highlighted with the dotted yellow border!</strong>
            </>
          }
        />
        {roundType === 'SHOW' && (
          <Translate
            pt={
              <>
                <br />
                Você também pode ver todos os personagens abaixo caso queira evitar conflito com outros
                jogadores.
              </>
            }
            en={
              <>
                <br />
                You can also take a look at all the characters for this round so you don't give clues that
                match others.
              </>
            }
          />
        )}
      </RuleInstruction>

      {roundType !== 'SHOW' && (
        <RuleInstruction type="event">
          <Translate
            pt={<>De agora em diante, você vê apenas o seu personagem.</>}
            en={<>From now on, you only see your own character.</>}
          />
        </RuleInstruction>
      )}

      <Table
        characters={characters}
        playerCharacterId={user.character?.id}
        tableOrder={tableOrder}
        showAll={roundType === 'SHOW'}
        imageCardMode={imageCardMode}
      />

      <SpaceContainer className="q-selections">
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
      </SpaceContainer>

      <Space className="glyphs" wrap>
        {glyphs.map((glyphId: string) => (
          <Popover
            key={glyphId}
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

      <SpaceContainer>
        <SendButton
          size="large"
          onClick={() => onSelectGlyphs({ glyphs: prepareGlyphs(positiveSelection, negativeSelection) })}
          disabled={user.ready || (positiveSelections.length < 1 && negativeSelections.length < 1)}
        >
          <Translate pt={<>Enviar ícones</>} en={<>Submit glyphs</>} />
        </SendButton>
      </SpaceContainer>
    </Step>
  );
}

type PopoverGlyphProps = {
  id: CardId;
  updatePositive: (key: string) => void;
  updateNegative: (key: string) => void;
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
