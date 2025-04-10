import { create } from "zustand";

type PlayerState = "idle" | "choosing_card" | "waiting" | "card_czar" | "viewing_results" | "game_over";

interface GameState {
  playerId: string | null; // ✅ Now stores player ID
  gamePlayerId: string | null; // ✅ Stores game_players ID
  playerState: PlayerState;
  isCardCzar: boolean;
  currentRound: string | null;
  submittedCards: string[];
  czarSelection: string | null;
  gameStarted: boolean;

  setPlayerId: (id: string) => void;
  setGamePlayerId: (id: string) => void; // ✅ Setter for gamePlayerId
  setPlayerState: (state: PlayerState) => void;
  setIsCardCzar: (isCzar: boolean) => void;
  setCurrentRound: (id: string) => void;
  startGame: () => void;
  submitCard: (cardId: string) => void;
  selectWinner: (cardId: string) => void;
  nextRound: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerId: null, // ✅ Stores player ID
  gamePlayerId: null, // ✅ Stores game_players ID
  playerState: "idle",
  isCardCzar: false,
  currentRound: null,
  submittedCards: [],
  czarSelection: null,
  gameStarted: false,

  setPlayerId: (id) => set({ playerId: id }), // ✅ Setter for playerId
  setGamePlayerId: (id) => set({ gamePlayerId: id }), // ✅ Setter for gamePlayerId
  setPlayerState: (state) => set({ playerState: state }),
  setIsCardCzar: (isCzar) => set({ isCardCzar: isCzar, playerState: isCzar ? "card_czar" : "choosing_card" }),
  setCurrentRound: (id) => set({ currentRound: id }), // ✅ new setter
  startGame: () => set({ gameStarted: true, playerState: "choosing_card" }),

  submitCard: (cardId) => set((state) => ({
    submittedCards: [...state.submittedCards, cardId],
    playerState: "waiting",
  })),

  selectWinner: (cardId) => set({ czarSelection: cardId, playerState: "viewing_results" }),

  nextRound: () => set((state) => ({
    currentRound: null,
    submittedCards: [],
    czarSelection: null,
    playerState: "choosing_card",
  })),
}));
