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
import { IconAvatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
// Internal
import type { DailyResponse, GameSettings } from '../utils/types';
import { ALL_HELPERS } from '../utils/helpers';
import { checkWasPlayedToday, getSourceName, wait } from '../utils';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import type { DailyAquiOEntry } from '../games/AquiO/utils/types';
import type { DailyArteRuimEntry } from '../games/ArteRuim/utils/types';
import type { DailyComunicacaoAlienigenaEntry } from '../games/ComunicacaoAlienigena/utils/types';
import type { DailyControleDeEstoqueEntry } from '../games/ControleDeEstoque/utils/types';
import type { DailyEspionagemEntry } from '../games/Espionagem/utils/types';
import type { DailyFilmacoEntry } from '../games/Filmaco/utils/types';
import type { DailyOrganikuEntry } from '../games/Organiku/utils/types';
import type { DailyPalavreadoEntry } from '../games/Palavreado/utils/types';
import type { DailyPortaisMagicosEntry } from '../games/PortaisMagicos/utils/types';
import type { DailyQuartetosEntry } from '../games/Quartetos/utils/types';
import type { DailyTeoriaDeConjuntosEntry } from '../games/TeoriaDeConjuntos/utils/types';
import type { DailyVitraisEntry } from '../games/Vitrais/utils/types';

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
      message.info(translate('Jogos copiados para a área de transferência!', 'Games copied to clipboard!'));
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
    case 'aqui-o': {
      return ALL_HELPERS.AQUI_O.getWrittenResult({
        data: data as DailyAquiOEntry,
        language,
      });
    }
    case 'arte-ruim': {
      return ALL_HELPERS.ARTE_RUIM.getWrittenResult({
        data: data as DailyArteRuimEntry,
        language,
      });
    }
    case 'comunicacao-alienigena': {
      return ALL_HELPERS.COMUNICACAO_ALIENIGENA.getWrittenResult({
        data: data as DailyComunicacaoAlienigenaEntry,
        language,
      });
    }
    case 'controle-de-estoque': {
      return ALL_HELPERS.CONTROLE_DE_ESTOQUE.getWrittenResult({
        data: data as DailyControleDeEstoqueEntry,
        language,
      });
    }
    case 'espionagem': {
      return ALL_HELPERS.ESPIONAGEM.getWrittenResult({
        data: data as DailyEspionagemEntry,
        language,
      });
    }
    case 'filmaco': {
      return ALL_HELPERS.FILMACO.getWrittenResult({
        data: data as DailyFilmacoEntry,
        language,
      });
    }
    case 'organiku': {
      return ALL_HELPERS.ORGANIKU.getWrittenResult({
        data: data as DailyOrganikuEntry,
        language,
      });
    }
    case 'palavreado': {
      return ALL_HELPERS.PALAVREADO.getWrittenResult({
        data: data as DailyPalavreadoEntry,
        language,
      });
    }
    case 'portais-magicos': {
      return ALL_HELPERS.PORTAIS_MAGICOS.getWrittenResult({
        data: data as DailyPortaisMagicosEntry,
        language,
      });
    }
    case 'quartetos': {
      return ALL_HELPERS.QUARTETOS.getWrittenResult({
        data: data as DailyQuartetosEntry,
        language,
      });
    }
    case 'teoria-de-conjuntos': {
      return ALL_HELPERS.TEORIA_DE_CONJUNTOS.getWrittenResult({
        data: data as DailyTeoriaDeConjuntosEntry,
        language,
      });
    }
    case 'vitrais': {
      return ALL_HELPERS.VITRAIS.getWrittenResult({
        data: data as DailyVitraisEntry,
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
