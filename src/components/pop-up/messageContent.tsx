import { ReactNode } from "react";
// Icons
import { RulesIcon } from "icons/RulesIcon";
import { VideoGameControllerIcon } from "icons/VideoGameControllerIcon";
// Components
import { Translate } from "components/language";

/**
 * Pops up a modal with a confirmation button but also closing timeout
 * @param title
 * @param description
 * @param id
 * @param duration
 * @param type
 * @returns
 */
export const messageContent = (
  title: ReactNode,
  description: ReactNode,
  id: string,
  duration = 30,
  type: "control" | "rules" = "control",
) => {
  const key = `${id} - ${title}`;

  return {
    content: (
      <div>
        <h3>{title}</h3>
        <div>{description}</div>
        <p>
          <small>
            <Translate
              pt="Popup fecha automaticamente ou clique para fechar"
              en="Auto-close or click to close"
            />
          </small>
        </p>
      </div>
    ),
    top: window.innerWidth / 2 - 100,
    duration,
    key,
    icon:
      type === "control" ? (
        <VideoGameControllerIcon style={{ width: "64px" }} />
      ) : (
        <RulesIcon style={{ width: "64px" }} />
      ),
  };
};
