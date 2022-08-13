import { Button, Space } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTimer } from 'react-timer-hook';

import { AdminNextPhaseButton } from 'components/admin';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { inNSeconds } from 'utils/helpers';
import { Album } from './components/Album';
import { PAGE_DURATION } from './utils/constants';

type StepAlbumProps = {
  players: GamePlayers;
  album: LAlbumEntry[];
};

export function StepAlbum({ players, album }: StepAlbumProps) {
  const [areControlsLocked, setAreControlsLocked] = useState(true);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [barSize, setBarSize] = useState(1);

  const totalPages = useMemo(() => {
    return album.reduce((total, albumEntry) => total + albumEntry.slides.length, 0);
  }, [album]);

  const totalTime = PAGE_DURATION * totalPages;

  const { minutes, seconds, isRunning } = useTimer({
    expiryTimestamp: inNSeconds(PAGE_DURATION * totalPages),
    autoStart: true,
    onExpire: () => setAreControlsLocked(false),
  });

  const currentAlbumEntry = album[currentEntry];
  const currentAlbumLastPageIndex = (currentAlbumEntry?.slides?.length || 0) - 1;
  const isLastAlbum = !Boolean(album[currentEntry + 1]);

  const time = minutes * 60 + seconds;

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

  useEffect(() => {
    if (isRunning && time < totalTime && time % PAGE_DURATION === 0) {
      // If next page exists, go for it, otherwise, next album
      if (currentPage < currentAlbumLastPageIndex) {
        onNextPage();
      } else if (!isLastAlbum) {
        onNextAlbum();
      }
    }
  }, [time, isRunning, currentAlbumLastPageIndex]); // eslint-disable-line

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
      <Space className="space-container" align="center">
        <Button disabled={areControlsLocked || currentEntry === 0} onClick={onPrevAlbum}>
          Prev Album
        </Button>
        <Button disabled={areControlsLocked || currentPage === 0} onClick={onPrevPage}>
          Prev Page
        </Button>
        <Button
          disabled={areControlsLocked || currentPage === currentAlbumLastPageIndex}
          onClick={onNextPage}
        >
          Next Page
        </Button>
        <Button disabled={areControlsLocked || isLastAlbum} onClick={onNextAlbum}>
          Next Album
        </Button>
      </Space>
      <AdminNextPhaseButton />
    </Step>
  );
}
