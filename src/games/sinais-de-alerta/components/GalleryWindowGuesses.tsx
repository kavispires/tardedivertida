import { orderBy } from "lodash";
import { useMemo } from "react";
// Ant Design Resources
import { CrownFilled, MessageFilled } from "@ant-design/icons";
import { Avatar as AntAvatar, Flex, Typography } from "antd";
// Types
import type { GamePlayers } from "types/player";
import { TextCard } from "types/tdr";
// Utils
import { getContrastColor, getPlayersFromIds } from "utils/helpers";
// Icons
import { StarIcon } from "icons/StarIcon";
// Components
import { Avatar, IconAvatar } from "components/avatars";
import { Translate } from "components/language";
// Internal
import type { GalleryEntry } from "../utils/types";
import { getTitle } from "../utils/helpers";

type GalleryWindowGuessesProps = {
  players: GamePlayers;
  cards: Dictionary<TextCard>;
  artistColor: string;
  galleryEntry: GalleryEntry;
  gameLanguage: Language;
};

export function GalleryWindowGuesses({
  players,
  cards,
  artistColor,
  galleryEntry,
  gameLanguage,
}: GalleryWindowGuessesProps) {
  const entries = useMemo(
    () =>
      orderBy(
        galleryEntry.playersSay.map((playerStayEntry) => {
          const title = getTitle(
            cards,
            playerStayEntry.subjectId,
            playerStayEntry.descriptorId,
            gameLanguage,
          );
          const isSubjectCorrect =
            galleryEntry.subjectId === playerStayEntry.subjectId;
          const isDescriptorCorrect =
            galleryEntry.descriptorId === playerStayEntry.descriptorId;
          return {
            id: title,
            playersIds: playerStayEntry.playersIds,
            score: playerStayEntry.score,
            subject: cards[playerStayEntry.subjectId],
            subjectCorrect: isSubjectCorrect,
            descriptor: cards[playerStayEntry.descriptorId],
            descriptorCorrect: isDescriptorCorrect,
            correctness: Number(isSubjectCorrect) + Number(isDescriptorCorrect),
            count: playerStayEntry.playersIds.length,
          };
        }),
        ["correctness", "count", "id"],
        ["desc", "desc", "asc"],
      ),
    [cards, galleryEntry, gameLanguage],
  );

  return (
    <div className="sda-gallery__guesses">
      <div className="sda-gallery__label">
        <Translate pt="Participantes votaram" en="Players voted" />
      </div>
      {entries.map((entry, index) => {
        const subjectName = (
          <Typography.Text
            keyboard={entry.subjectCorrect}
            style={
              entry.subjectCorrect && entry.correctness === 1
                ? {
                    backgroundColor: artistColor,
                    color: getContrastColor(artistColor),
                  }
                : { color: "inherit", backgroundColor: "inherit" }
            }
          >
            {entry.subject.text}
          </Typography.Text>
        );

        const descriptorName = (
          <Typography.Text
            keyboard={entry.descriptorCorrect}
            style={
              entry.descriptorCorrect && entry.correctness === 1
                ? {
                    backgroundColor: artistColor,
                    color: getContrastColor(artistColor),
                  }
                : { color: "inherit", backgroundColor: "inherit" }
            }
          >
            {entry.descriptor.text}
          </Typography.Text>
        );

        return (
          <div
            key={`guess-${entry.id}-${index}`}
            className="sda-gallery__guess"
          >
            <div
              className="sda-gallery__speech-bubble"
              style={
                entry.correctness === 2
                  ? {
                      backgroundColor: artistColor,
                      color: getContrastColor(artistColor),
                    }
                  : {}
              }
            >
              {entry.correctness === 2 ? (
                <CrownFilled
                  className="sda-gallery__speech-bubble-icon"
                  style={{ color: "white" }}
                />
              ) : (
                <MessageFilled className="sda-gallery__speech-bubble-icon" />
              )}

              {gameLanguage === "pt" ? (
                <span>
                  {subjectName} {descriptorName}
                </span>
              ) : (
                <span>
                  {descriptorName} {subjectName}
                </span>
              )}

              <Flex align="center" gap={3}>
                <IconAvatar icon={<StarIcon />} size="small" /> {entry.score}
              </Flex>
            </div>
            <div className="sda-gallery__players">
              <AntAvatar.Group>
                {entry.playersIds.map((playerId) => (
                  <Avatar
                    id={players[playerId].avatarId}
                    key={`guess-avatar-${players[playerId].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
              <span className="sda-gallery__players-names">
                {getPlayersFromIds(entry.playersIds, players, true).join(", ")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
