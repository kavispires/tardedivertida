import { Fragment } from 'react';
// Ant Design Resources
import { RightSquareOutlined } from '@ant-design/icons';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Icons
import { MapIcon } from '@icons/MapIcon';
import { TreeOneIcon } from '@icons/TreeOneIcon';
import { TreeThreeIcon } from '@icons/TreeThreeIcon';
import { TreeTwoIcon } from '@icons/TreeTwoIcon';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackLabirintoSecreto = ({ track, onSubmitAnswer, user }: TrackProps) => {
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
      <RuleInstruction type="action">
        <Translate
          pt="Para atravessar a floresta, você precisa passar por essas 3 árvores.
          <br/>
          Com mapa feito de adjetivos (que útil), qual rota você selecionaria ir da {firstTree} ao {lastTree}?"
          en="To cross the woods, you need to pass by 3 trees.
          <br/>
          With a map made of adjectives (wow, so useful), what route would to select to go from {firstTree} to {lastTree}?"
          values={{
            firstTree: <TextHighlight>{track.data.trees[0].text}</TextHighlight>,
            lastTree: <TextHighlight>{track.data.trees[2].text}</TextHighlight>,
          }}
        />
      </RuleInstruction>

      <div className="cm-trees">
        <div className="cm-trees__tree">
          <Icon
            icon={<TreeOneIcon />}
            size={84}
          />
          <div className="cm-trees__text">{track.data.trees[0].text}</div>
        </div>

        <div className="cm-trees__tree">
          <Icon
            icon={<TreeTwoIcon />}
            size={84}
          />
          <div className="cm-trees__text">{track.data.trees[1].text}</div>
        </div>

        <div className="cm-trees__tree">
          <Icon
            icon={<TreeThreeIcon />}
            size={84}
          />
          <div className="cm-trees__text">{track.data.trees[2].text}</div>
        </div>
      </div>

      <SpaceContainer vertical>
        <TransparentButton
          className="cm-clues__clue"
          disabled={user.ready || isLoading}
          onClick={() => onSelect(0)}
        >
          {'A'}
          <Icon
            icon={<MapIcon />}
            size={48}
          />
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
          <Icon
            icon={<MapIcon />}
            size={48}
          />
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
          <Icon
            icon={<MapIcon />}
            size={48}
          />
          {Object.values<PlainObject>(track.data.options[2]).map((option, index, arr) => {
            return (
              <Fragment key={`${option.playerId}-${index}`}>
                <span className="cm-clues__clue-text">{option.text}</span>
                {arr.length - 1 > index && <RightSquareOutlined />}
              </Fragment>
            );
          })}
        </TransparentButton>
      </SpaceContainer>
    </>
  );
};
