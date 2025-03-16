import { useMutation } from "@tanstack/react-query";
import { leaveGame } from "@/api/api";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useGameStore } from "@/store/useGameStore";
import { deletePlayerCards } from "@/api/api";

export function useLeaveGame() {
  const { setPlayerGameId } = usePlayerLobbyStore();
  const { gamePlayerId, setGamePlayerId } = useGameStore();

  return useMutation({
    mutationFn: async (playerId: string) => {
      try {
  
          // Ensure gamePlayerId is valid before proceeding
          if (gamePlayerId) {
            await deletePlayerCards(gamePlayerId);
          }  else {
            console.warn("No gamePlayerId found. Skipping card deletion.");
          }
  

        // Leave the game
        await leaveGame(playerId);
      } catch (error) {
        console.error("Error leaving game and removing cards:", error);
        throw error;
      }
    },

    onSuccess: () => {
      setPlayerGameId(null);
      setGamePlayerId(null);
      console.log("Player successfully left the game and cards were removed.");
    },

    onError: (error) => {
      console.error("Failed to leave game:", error);
    },
  });
}
