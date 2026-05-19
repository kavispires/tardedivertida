import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useHost } from 'hooks/useHost';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { HostButton } from 'components/host/HostButton';
import { HostOnlyContainer } from 'components/host/HostOnlyContainer';
import { Translate } from 'components/language/Translate';
import { SpaceFloat } from 'components/layout/SpaceFloat';
import { messageContent } from 'components/pop-up/messageContent';
import { PopoverRule } from 'components/rules/PopoverRule';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type {
  SecretWord,
  SubmitValidationsPayload,
  Suggestion,
  ValidateSuggestionPayload,
} from './utils/types';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { ComparisonDetailedRules, ComparisonPhaseRules } from './components/RulesBlobs';
import { Cards } from './components/Cards';

type StepCompareSuggestionsProps = {
  isUserTheController: boolean;
  controller: GamePlayer;
  onValidateSuggestions: (payload: SubmitValidationsPayload) => void;
  onUpdateSuggestions: (payload: ValidateSuggestionPayload) => void;
  players: GamePlayers;
  secretWord: SecretWord;
  suggestions: Suggestion[];
} & Pick<StepProps, 'announcement'>;

export function StepCompareSuggestions({
  isUserTheController,
  controller,
  onValidateSuggestions,
  onUpdateSuggestions,
  players,
  secretWord,
  suggestions,
  announcement,
}: StepCompareSuggestionsProps) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [myRecommendation, setMyRecommendation] = useState<Suggestion[]>(cloneDeep(suggestions));
  const isHost = useHost();
  const [wasMessageShown, setWasMessageShown] = useState(false);

  const onSetValidation = (index: number, suggestionEntry: Suggestion, notAllowed?: boolean) => {
    if (notAllowed) return;

    const newRecommendation = [...myRecommendation];
    if (newRecommendation[index]) {
      newRecommendation[index].invalid = !newRecommendation[index].invalid;
    } else {
      newRecommendation[index] = {
        ...suggestionEntry,
        invalid: true,
      };
    }

    onUpdateSuggestions({ suggestions: newRecommendation });
    setMyRecommendation(newRecommendation);
  };

  useEffect(() => {
    if (isUserTheController && !wasMessageShown && !isLoading) {
      message.info(
        messageContent(
          translate({ pt: 'Você controla!', en: 'You control!' }),
          translate({ pt: 'Siga as instruções na página', en: 'Follow the instructions on the page' }),
          controller.id,
          3,
        ),
      );
      setWasMessageShown(true);
    }
  }, [isUserTheController, controller.id, translate, wasMessageShown, isLoading, message]);

  const suggestionsValues = Object.values(myRecommendation);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Comparem as Dicas"
          en="Compare Clues"
        />
      </StepTitle>

      <Card word={secretWord.text} />

      <PopoverRule content={<ComparisonDetailedRules />} />

      <ComparisonPhaseRules controller={controller} />

      <Cards
        suggestions={suggestions}
        readOnly={!isUserTheController}
        players={players}
        onSetValidation={onSetValidation}
        isLoading={isLoading}
        myRecommendation={myRecommendation}
      />

      <ViewIf condition={isUserTheController}>
        <SpaceFloat>
          <SendButton
            type="primary"
            onClick={() =>
              onValidateSuggestions({
                validSuggestions: suggestionsValues.filter((suggestion) => !suggestion.invalid),
              })
            }
          >
            <Translate
              pt="Confirmar dicas válidas"
              en="Confirm valid clues"
            />
          </SendButton>
        </SpaceFloat>
      </ViewIf>

      <ViewIf condition={!isUserTheController}>
        <HostOnlyContainer
          label={
            <Translate
              pt="Host Controls (use somente se o jogador controlador não controlar)"
              en="Host Controls (only use if the assign player doesn't)"
            />
          }
          orientation="vertical"
          align="center"
        >
          <Cards
            suggestions={suggestions}
            readOnly={!isHost}
            players={players}
            onSetValidation={onSetValidation}
            isLoading={isLoading}
            myRecommendation={myRecommendation}
          />
          <HostButton
            onClick={() =>
              onValidateSuggestions({
                validSuggestions: suggestionsValues.filter((suggestion) => !suggestion.invalid),
              })
            }
          >
            <Translate
              pt="Confirmar dicas válidas como Admin"
              en="Confirm valid clues as Admin"
            />
          </HostButton>
        </HostOnlyContainer>
      </ViewIf>
    </Step>
  );
}
