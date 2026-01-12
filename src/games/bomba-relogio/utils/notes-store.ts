import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

type PlayerNote = 'agent' | 'terrorist' | '';

type NotesState = {
  /**
   * Dictionary of player notes indexed by playerId
   */
  notes: Dictionary<PlayerNote>;
};

const initialState: NotesState = {
  notes: {},
};

const notesStore = new Store<NotesState>(initialState);

/**
 * Set a note for a specific player
 */
export const setPlayerNote = (playerId: PlayerId, note: PlayerNote) => {
  notesStore.setState((prev) => ({
    notes: {
      ...prev.notes,
      [playerId]: note,
    },
  }));
};

/**
 * Clear a note for a specific player
 */
export const clearPlayerNote = (playerId: PlayerId) => {
  notesStore.setState((prev) => {
    const newNotes = { ...prev.notes };
    delete newNotes[playerId];
    return { notes: newNotes };
  });
};

/**
 * Clear all notes
 */
export const clearAllNotes = () => {
  notesStore.setState({ notes: {} });
};

/**
 * Custom hook to manage player notes for the Bomba Relógio game.
 * Tracks whether each player is an agent or terrorist.
 * @returns An object containing:
 * - `notes` {Dictionary<PlayerNote>}: Dictionary of player notes indexed by playerId.
 * - `setPlayerNote` {(playerId: PlayerId, note: PlayerNote) => void}: Function to set a note for a specific player.
 * - `clearPlayerNote` {(playerId: PlayerId) => void}: Function to clear a note for a specific player.
 * - `clearAllNotes` {() => void}: Function to clear all notes.
 * - `getPlayerNote` {(playerId: PlayerId) => PlayerNote}: Function to get a note for a specific player.
 */
export function useNotesStore() {
  const { notes } = useStore(notesStore, () => notesStore.state);

  const getPlayerNote = (playerId: PlayerId): PlayerNote => {
    return notes[playerId] ?? '';
  };

  return {
    notes,
    setPlayerNote,
    clearPlayerNote,
    clearAllNotes,
    getPlayerNote,
  };
}
