import { PlayerGlyphs } from 'games/quem-sou-eu/components/PlayerGlyphs';
import type { FightingContender } from 'games/super-campeonato/utils/type';
import { useMemo } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackQuemSouEu = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(7, { minWidth: 150, maxWidth: 270 });

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockSelection(track.data.contenders, 'id') },
    });
  });

  const botPlayer: GamePlayer = useMemo(() => {
    const selectedGlyphs: BooleanDictionary = {};
    track.data.positive.forEach((glyph: number) => {
      selectedGlyphs[glyph] = true;
    });
    track.data.negative.forEach((glyph: number) => {
      selectedGlyphs[glyph] = false;
    });
    return { id: 'A', avatarId: 'A', name: 'Bob', selectedGlyphs, ready: false, updatedAt: 0 };
  }, [track.data]);

  return (
    <>
      <MinigameTitle title={{ pt: 'Quem Sou Eu?', en: 'Who Am I?' }} />
      <RuleInstruction type="action">
        <Translate
          pt="Decifre os símbolos e selecione o personagem que mais tem aver com eles."
          en="Decipher the glyphs and select the character that has the most to do with them."
        />
      </RuleInstruction>

      <Space className="space-container">
        <PlayerGlyphs player={botPlayer} glyphWidth={50} />
      </Space>

      <Space className="space-container center">
        {track.data.contenders.map((contender: FightingContender) => {
          return (
            <Space direction="vertical" key={contender.id}>
              <CharacterCard size={cardWidth} character={contender} />

              <Button
                shape="round"
                type="primary"
                disabled={user.ready}
                loading={isLoading}
                onClick={() =>
                  onSubmitAnswer({
                    data: { value: contender.id },
                  })
                }
              >
                <Translate pt="Selecionar" en="Select" />
              </Button>
            </Space>
          );
        })}
      </Space>
    </>
  );
};
