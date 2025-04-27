import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type PlayerState = 
  | "idle" 
  | "choosing_card" 
  | "waiting" 
  | "card_czar" 
  | "viewing_results" 
  | "game_over";

interface GameState {
  playerName: string | null;
  playerId: string | null;
  gameId: string | null;
  gamePlayerId: string | null;
  playerState: PlayerState;
  isCardCzar: boolean;
  currentRound: string | null;
  submittedCards: string[];
  czarSelection: string | null;
  gameStarted: boolean;
  playerSubmitList: string[];
  currentCardCzarId: string | null; // <-- new!
  setCurrentCardCzarId: (id: string) => void;
  addPlayerSubmit: (playerId: string) => void;
  removePlayerSubmit: (playerId: string) => void;
  clearPlayerSubmitList: () => void;
  setPlayerName: (name: string | null) => void;
  setPlayerId: (id: string) => void;
  setGamePlayerId: (id: string) => void;
  setGameId: (id: string) => void;
  setPlayerState: (state: PlayerState) => void;
  setIsCardCzar: (isCzar: boolean) => void;
  setCurrentRound: (id: string) => void;
  startGame: () => void;
  submitCard: (cardId: string) => void;
  selectWinner: (cardId: string) => void;
  nextRound: () => void;
  resetState: () => void; // ✅ NEW reset function
}

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set) => ({
        playerName: null,
        playerId: null,
        gameId: null,
        gamePlayerId: null,
        playerState: "choosing_card",
        isCardCzar: false,
        currentRound: null,
        submittedCards: [],
        czarSelection: null,
        gameStarted: false,
        playerSubmitList: [],
        currentCardCzarId: null,

        setCurrentCardCzarId: (id) => set({ currentCardCzarId: id }),
        setPlayerName: (name) => set({ playerName: name }),
        setPlayerId: (id) => set({ playerId: id }),
        setGameId: (id) => set({ gameId: id }),
        setGamePlayerId: (id) => set({ gamePlayerId: id }),
        setPlayerState: (state) => set({ playerState: state }),
        setIsCardCzar: (isCzar) => set({ isCardCzar: isCzar, playerState: isCzar ? "card_czar" : "choosing_card" }),
        setCurrentRound: (id) => set({ currentRound: id }),
        startGame: () => set({ gameStarted: true, playerState: "choosing_card" }),
        clearPlayerSubmitList: () => set({ playerSubmitList: [] }),
        addPlayerSubmit: (playerId) => set((state) => ({
          playerSubmitList: [...state.playerSubmitList, playerId]
        })),
        removePlayerSubmit: (playerId) => set((state) => ({
          playerSubmitList: state.playerSubmitList.filter((id) => id !== playerId)
        })),
        submitCard: (cardId) => set((state) => ({
          submittedCards: [...state.submittedCards, cardId],
          playerState: "waiting",
        })),

        selectWinner: (cardId) => set({ czarSelection: cardId, playerState: "viewing_results" }),

        nextRound: () => set(() => ({
          currentRound: null,
          submittedCards: [],
          czarSelection: null,
          playerState: "choosing_card",
          playerSubmitList: [],
        })),
    
        // 🧹 Reset everything back to initial state
        resetState: () => set({
          playerName: null,
          playerId: null,
          gameId: null,
          gamePlayerId: null,
          playerState: "choosing_card",
          isCardCzar: false,
          currentRound: null,
          submittedCards: [],
          czarSelection: null,
          gameStarted: false,
        }),
      }),
      {
        name: "game-storage",
        partialize: (state) => ({
          playerName: state.playerName,
          playerId: state.playerId,
          gamePlayerId: state.gamePlayerId,
          gameStarted: state.gameStarted,
          currentRound: state.currentRound,
          isCardCzar: state.isCardCzar,
          playerState: state.playerState,
        }),
      }
    ),
    { name: "GameStore" }
  )
);
