// store/playerLobbyStore.ts
import { create } from 'zustand';

interface PlayerLobbyState {
  playerId: string | null;
  playerLobbyId: string | null;
  setPlayerId: (id: string | null) => void;
  setPlayerLobbyId: (id: string | null) => void;
}

const usePlayerLobbyStore = create<PlayerLobbyState>((set) => ({
  playerId: localStorage.getItem('playerId'),
  playerLobbyId: localStorage.getItem('playerLobby'),
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
}));

export default usePlayerLobbyStore;
