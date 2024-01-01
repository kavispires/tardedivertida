import { Fragment } from 'react';
// AntDesign Resources
import { Space } from 'antd';
import { RightSquareOutlined } from '@ant-design/icons';
// Types
import type { TrackProps } from '../../utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction, TextHighlight } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TransparentButton } from 'components/buttons';
import { TreeOneIcon } from 'icons/TreeOneIcon';
import { TreeTwoIcon } from 'icons/TreeTwoIcon';
import { TreeThreeIcon } from 'icons/TreeThreeIcon';
import { MapIcon } from 'icons/MapIcon';

export const TrackLabirintoSecreto = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: number) => {
    onSubmitAnswer({
      data: { value: String(value) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([0, 1, 2]));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Labirinto Secreto', en: 'Secret Labyrinth' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Para atravessar a floresta, você precisa passar por essas 3 árvores.
              <br />
              Com mapa feito de adjetivos (que útil), qual rota você selecionaria ir da{' '}
              <TextHighlight>{track.data.trees[0].text}</TextHighlight> ao{' '}
              <TextHighlight>{track.data.trees[2].text}</TextHighlight>?
            </>
          }
          en={
            <>
              To cross the woods, you need to pass by 3 trees.
              <br />
              With a map made of adjectives (wow, so useful), what route would to select to go from{' '}
              <TextHighlight>{track.data.trees[0].text}</TextHighlight> to{' '}
              <TextHighlight>{track.data.trees[2].text}</TextHighlight>?
            </>
          }
        />
      </Instruction>

      <div className="cm-trees">
        <div className="cm-trees__tree">
          <IconAvatar icon={<TreeOneIcon />} size={84} />
          <div className="cm-trees__text">{track.data.trees[0].text}</div>
        </div>

        <div className="cm-trees__tree">
          <IconAvatar icon={<TreeTwoIcon />} size={84} />
          <div className="cm-trees__text">{track.data.trees[1].text}</div>
        </div>

        <div className="cm-trees__tree">
          <IconAvatar icon={<TreeThreeIcon />} size={84} />
          <div className="cm-trees__text">{track.data.trees[2].text}</div>
        </div>
      </div>

      <Space className="space-container" direction="vertical">
        <TransparentButton
          className="cm-clues__clue"
          disabled={user.ready || isLoading}
          onClick={() => onSelect(0)}
        >
          {'A'}
          <IconAvatar icon={<MapIcon />} size={48} />
          {Object.values<PlainObject>(track.data.options[0]).map((option, index, arr) => {
            return (
              <Fragment key={`${option.playerId}-${index}`}>
                <span className="cm-clues__clue-text">{option.text}</span>
                {arr.length - 1 > index && <RightSquareOutlined />}
              </Fragment>
            );
          })}
        </TransparentButton>
        <TransparentButton
          className="cm-clues__clue"
          disabled={user.ready || isLoading}
          onClick={() => onSelect(1)}
        >
          {'B'}
          <IconAvatar icon={<MapIcon />} size={48} />
          {Object.values<PlainObject>(track.data.options[1]).map((option, index, arr) => {
            return (
              <Fragment key={`${option.playerId}-${index}`}>
                <span className="cm-clues__clue-text">{option.text}</span>
                {arr.length - 1 > index && <RightSquareOutlined />}
              </Fragment>
            );
          })}
        </TransparentButton>
        <TransparentButton
          className="cm-clues__clue"
          disabled={user.ready || isLoading}
          onClick={() => onSelect(2)}
        >
          {'C'}
          <IconAvatar icon={<MapIcon />} size={48} />
          {Object.values<PlainObject>(track.data.options[2]).map((option, index, arr) => {
            return (
              <Fragment key={`${option.playerId}-${index}`}>
                <span className="cm-clues__clue-text">{option.text}</span>
                {arr.length - 1 > index && <RightSquareOutlined />}
              </Fragment>
            );
          })}
        </TransparentButton>
      </Space>
    </>
  );
};
