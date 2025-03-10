import { useCallback, useEffect, useMemo, useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { Title } from 'components/text';
// Internal
import type { AlbumEntry } from './utils/types';
import { SLIDE_DURATION } from './utils/constants';
import { Album } from './components/Album';

type StepAlbumProps = {
  players: GamePlayers;
  album: AlbumEntry[];
};

export function StepAlbum({ players, album }: StepAlbumProps) {
  useTemporarilyHidePlayersBar();
  const [areControlsLocked, setAreControlsLocked] = useState(true);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [barSize, setBarSize] = useState(1);

  const totalPages = useMemo(() => {
    return album.reduce((total, albumEntry) => total + albumEntry.slides.length, 0);
  }, [album]);

  const totalTime = SLIDE_DURATION * totalPages;

  const { timeLeft, isRunning } = useCountdown({
    duration: SLIDE_DURATION * totalPages,
    autoStart: true,
    onExpire: () => setAreControlsLocked(false),
  });

  const currentAlbumEntry = album[currentEntry];
  const currentAlbumLastPageIndex = (currentAlbumEntry?.slides?.length || 0) - 1;
  const isLastAlbum = !album[currentEntry + 1];

  // Control Functions
  const onPrevAlbum = () => {
    setCurrentEntry(currentEntry - 1);
    setCurrentPage(0);
    if (areControlsLocked) {
      setBarSize((s) => s + 1);
    }
  };
  const onPrevPage = () => setCurrentPage((c) => c - 1);
  const onNextPage = useCallback(() => {
    setCurrentPage((c) => c + 1);
    if (areControlsLocked) {
      setBarSize((s) => s + 1);
    }
  }, [areControlsLocked]);
  const onNextAlbum = useCallback(() => {
    setCurrentEntry((c) => c + 1);
    setCurrentPage(0);
    if (areControlsLocked) {
      setBarSize((s) => s + 1);
    }
  }, [areControlsLocked]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isRunning && timeLeft < totalTime && timeLeft % SLIDE_DURATION === 0) {
      // If next page exists, go for it, otherwise, next album
      if (currentPage < currentAlbumLastPageIndex) {
        onNextPage();
      } else if (!isLastAlbum) {
        onNextAlbum();
      }
    }
  }, [timeLeft, isRunning, currentAlbumLastPageIndex]);

  return (
    <Step className="l-step-album">
      <Title>
        <Translate pt="Álbum de Fotos" en="Photo Album" />
      </Title>
      {currentPage < 0 || !currentAlbumEntry ? (
        <div className="a">?</div>
      ) : (
        <Album albumEntry={currentAlbumEntry} currentPage={currentPage} players={players} />
      )}
      <div className="l-timer-bar">
        <span
          className="l-timer-bar__pill"
          style={{
            width: `${Math.abs((100 * barSize) / totalPages)}%`,
            backgroundColor: 'gray',
          }}
        />
      </div>
      <SpaceContainer>
        <Space.Compact>
          <Button disabled={areControlsLocked || currentEntry === 0} onClick={onPrevAlbum}>
            <Translate pt="Álbum Anterior" en="Previous Album" />
          </Button>
          <Button disabled={areControlsLocked || currentPage === 0} onClick={onPrevPage}>
            <Translate pt="Página Anterior" en="Previous Page" />
          </Button>
          <Button
            disabled={areControlsLocked || currentPage === currentAlbumLastPageIndex}
            onClick={onNextPage}
          >
            <Translate pt="Próxima Página" en="Next Page" />
          </Button>
          <Button disabled={areControlsLocked || isLastAlbum} onClick={onNextAlbum}>
            <Translate pt="Próximo Álbum" en="Next Album" />
          </Button>
        </Space.Compact>
      </SpaceContainer>

      <HostNextPhaseButton autoTriggerTime={0} />
    </Step>
  );
}
