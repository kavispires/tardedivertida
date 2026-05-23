import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
// Ant Design Resources
import { ShareAltOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Flex, Modal, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import type { DailyResponse, GameSettings } from '../utils/types';
import { ALL_HELPERS } from '../utils/helpers';
import { ALL_SETTINGS } from '../utils/settings';
import { checkWasPlayedToday, getSourceName, wait } from '../utils';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import type { DailyAquiOEntry } from '../games/AquiO/utils/types';
import type { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import type { DailyAlienadoEntry } from '../games/Alienado/utils/types';
import type { DailyEstoquistaEntry } from '../games/Estoquista/utils/types';
import type { DailyInvestigacaoEntry } from '../games/Investigacao/utils/types';
import type { DailyFilmacoEntry } from '../games/Filmaco/utils/types';
import type { DailyOrganikuEntry } from '../games/Organiku/utils/types';
import type { DailyPalavreadoEntry } from '../games/Palavreado/utils/types';
import type { DailyPortaisEntry } from '../games/Portais/utils/types';
import type { DailyQuartetosEntry } from '../games/Quartetos/utils/types';
import type { DailyConjuntosEntry } from '../games/Conjuntos/utils/types';
import type { DailyVitralEntry } from '../games/Vitral/utils/types';
import type { DailyMapeamentoEntry } from '../games/Mapeamento/utils/types';
import type { DailyPirralhosEntry } from '../games/Pirralhos/utils/types';
import type { DailyPanicoEntry } from '../games/Panico/utils/types';

type BundleResultsProps = {
  list: (GameSettings & { disabled?: boolean })[];
};

export function BundleResults({ list }: BundleResultsProps) {
  const challengeQuery = useDailyChallenge();
  const [open, setOpen] = useState(false);
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { language } = useLanguage();
  const [, copyToClipboard] = useCopyToClipboard();

  const playedGames = useMemo(
    () =>
      orderBy(
        list.filter((game) => !game.disabled && checkWasPlayedToday(game.KEY)),
        [`game.NAME.${language}`],
        ['asc'],
      ),
    [list, language],
  );
  const [selected, setSelected] = useState<string[]>(playedGames.map((game) => game.ROUTE));

  const copyResults = async () => {
    if (challengeQuery.data) {
      copyToClipboard(prepareResults(selected, challengeQuery.data, language));
      await wait(250); // Wait for the copy to complete
      message.info(
        translate({ pt: 'Jogos copiados para a área de transferência!', en: 'Games copied to clipboard!' }),
      );
    }
  };

  return (
    <>
      <Flex
        justify="center"
        align="center"
        className="my-6"
      >
        <Button
          className="daily-ghost-button"
          ghost
          icon={<ShareAltOutlined />}
          onClick={() => setOpen(true)}
          disabled={playedGames.length === 0}
        >
          <Translate
            en="Share Bundled Results"
            pt="Compartilhar Resultados"
          />
        </Button>
      </Flex>
      <Modal
        title={
          <Flex gap={4}>
            <IconAvatar
              icon={<SpeechBubbleAcceptedIcon />}
              size="small"
            />
            <Translate
              en="Bundled results"
              pt="Resultados agrupados"
            />
          </Flex>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Typography.Paragraph>
          Selecione os jogos que você deseja enviar os resultados e então clique em copiar.
        </Typography.Paragraph>

        <ul className="list-played-games">
          {playedGames.map((game) => (
            <li
              key={game.KEY}
              className="list-played-games__item"
              style={{ backgroundColor: game.COLOR }}
            >
              <Checkbox
                checked={selected.includes(game.ROUTE)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected((prev) => [...prev, game.ROUTE]);
                  } else {
                    setSelected((prev) => prev.filter((key) => key !== game.ROUTE));
                  }
                }}
                className="full-width"
              >
                <IconAvatar
                  icon={<game.HUB_ICON />}
                  size="small"
                />
                <span className="ml-2">
                  <DualTranslate>{game.NAME}</DualTranslate>
                </span>
              </Checkbox>
            </li>
          ))}
        </ul>

        <Flex
          justify="center"
          className="mt-4"
        >
          <Button
            type="primary"
            disabled={selected.length === 0}
            onClick={copyResults}
          >
            <Translate
              en="Copy results"
              pt="Copiar resultados"
            />
          </Button>
        </Flex>
      </Modal>
    </>
  );
}

function getResultForGame(data: DailyResponse[keyof DailyResponse], language: Language) {
  if (!data || typeof data !== 'object' || !('type' in data) || !data.type) {
    return '';
  }

  switch (data.type) {
    case ALL_SETTINGS.ALIENADO.ROUTE: {
      return ALL_HELPERS.ALIENADO.getWrittenResult({
        data: data as DailyAlienadoEntry,
        language,
      });
    }
    case ALL_SETTINGS.AQUI_O.ROUTE: {
      return ALL_HELPERS.AQUI_O.getWrittenResult({
        data: data as DailyAquiOEntry,
        language,
      });
    }
    case ALL_SETTINGS.ARTE_RUIM.ROUTE: {
      return ALL_HELPERS.ARTE_RUIM.getWrittenResult({
        data: data as DailyArteRuimEntry,
        language,
      });
    }
    case ALL_SETTINGS.CONJUNTOS.ROUTE: {
      return ALL_HELPERS.CONJUNTOS.getWrittenResult({
        data: data as DailyConjuntosEntry,
        language,
      });
    }
    case ALL_SETTINGS.ESTOQUISTA.ROUTE: {
      return ALL_HELPERS.ESTOQUISTA.getWrittenResult({
        data: data as DailyEstoquistaEntry,
        language,
      });
    }
    case ALL_SETTINGS.INVESTIGACAO.ROUTE: {
      return ALL_HELPERS.INVESTIGACAO.getWrittenResult({
        data: data as DailyInvestigacaoEntry,
        language,
      });
    }
    case ALL_SETTINGS.FILMACO.ROUTE: {
      return ALL_HELPERS.FILMACO.getWrittenResult({
        data: data as DailyFilmacoEntry,
        language,
      });
    }
    case ALL_SETTINGS.MAPEAMENTO.ROUTE: {
      return ALL_HELPERS.MAPEAMENTO.getWrittenResult({
        data: data as DailyMapeamentoEntry,
        language,
      });
    }
    case ALL_SETTINGS.ORGANIKU.ROUTE: {
      return ALL_HELPERS.ORGANIKU.getWrittenResult({
        data: data as DailyOrganikuEntry,
        language,
      });
    }
    case ALL_SETTINGS.PALAVREADO.ROUTE: {
      return ALL_HELPERS.PALAVREADO.getWrittenResult({
        data: data as DailyPalavreadoEntry,
        language,
      });
    }
    case ALL_SETTINGS.PANICO.ROUTE: {
      return ALL_HELPERS.PANICO.getWrittenResult({
        data: data as DailyPanicoEntry,
        language,
      });
    }
    case ALL_SETTINGS.PIRRALHOS.ROUTE: {
      return ALL_HELPERS.PIRRALHOS.getWrittenResult({
        data: data as DailyPirralhosEntry,
        language,
      });
    }
    case ALL_SETTINGS.PORTAIS.ROUTE: {
      return ALL_HELPERS.PORTAIS.getWrittenResult({
        data: data as DailyPortaisEntry,
        language,
      });
    }
    case ALL_SETTINGS.QUARTETOS.ROUTE: {
      return ALL_HELPERS.QUARTETOS.getWrittenResult({
        data: data as DailyQuartetosEntry,
        language,
      });
    }
    case ALL_SETTINGS.VITRAL.ROUTE: {
      return ALL_HELPERS.VITRAL.getWrittenResult({
        data: data as DailyVitralEntry,
        language,
      });
    }

    // Add other games here as needed
    default:
      return 'N/A';
  }
}

function prepareResults(selected: string[], data: DailyResponse, language: Language) {
  let results = selected
    .map((key) => {
      const gameData = data[key as keyof DailyResponse];
      if (gameData) {
        return getResultForGame(gameData, language);
      }
      return null;
    })
    .filter(Boolean)
    .join('\n\n');

  if (results) {
    results += `\n\nhttps://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`;
  }

  return results || '';
}
