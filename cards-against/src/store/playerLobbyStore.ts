import { create } from 'zustand';

interface PlayerLobbyState {
  playerId: string | null;
  playerGameId: string | null;
  setPlayerId: (id: string | null) => void;
  setPlayerGameId: (id: string | null) => void;
}

const usePlayerLobbyStore = create<PlayerLobbyState>((set) => ({
  playerId: localStorage.getItem('playerId'), // Initialize from localStorage
  playerGameId: localStorage.getItem('playerGameId'), // Initialize from localStorage
  setPlayerId: (id: string | null) => {
    if (id) {
      localStorage.setItem('playerId', id);
    } else {
      localStorage.removeItem('playerId');
    }
    set({ playerId: id });
  },

  setPlayerGameId: (id: string | null) => {
    if (id) {
      localStorage.setItem('playerGameId', id);
    } else {
      localStorage.removeItem('playerGameId');
    }
    set({ playerGameId: id });
  },
}));

export default usePlayerLobbyStore;

