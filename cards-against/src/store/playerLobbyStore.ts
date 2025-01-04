import { create } from 'zustand';

interface PlayerLobbyState {
  playerId: string | null;
  playerLobbyId: string | null;
  playerGameId: string | null;
  setPlayerId: (id: string | null) => void;
  setPlayerLobbyId: (id: string | null) => void;
  setPlayerGameId: (id: string | null) => void;
}

const usePlayerLobbyStore = create<PlayerLobbyState>((set) => ({
  playerId: localStorage.getItem('playerId'), // Initialize from localStorage
  playerLobbyId: localStorage.getItem('playerLobby'), // Initialize from localStorage
  playerGameId: localStorage.getItem('playerGameId'), // Initialize from localStorage
  setPlayerId: (id: string | null) => {
    if (id) {
      localStorage.setItem('playerId', id);
    } else {
      localStorage.removeItem('playerId');
    }
    set({ playerId: id });
  },
  setPlayerLobbyId: (id: string | null) => {
    if (id) {
      localStorage.setItem('playerLobby', id);
    } else {
      localStorage.removeItem('playerLobby');
    }
    set({ playerLobbyId: id });
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

