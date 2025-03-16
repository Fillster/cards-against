import { useMutation } from "@tanstack/react-query";
import { joinGame, drawUniqueCard } from "@/api/api";
import { JoinGameData } from "@/lib/interface";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useGameStore } from "@/store/useGameStore";

export function useJoinGame() {
  const { setPlayerGameId } = usePlayerLobbyStore();
  const { setPlayerId, setGamePlayerId } = useGameStore(); // ✅ Added setGamePlayerId

  return useMutation({
    mutationFn: async ({ gameId, playerId, score }: JoinGameData) => {
      if (!playerId) throw new Error("Player ID is required to join a game.");
      return await joinGame({ gameId, playerId, score }); // ✅ Returns gamePlayerId
    },

    onSuccess: async (gamePlayerId, { gameId }) => {
      setPlayerGameId(gameId);
      setPlayerId(gamePlayerId); // ✅ Store in playerId
      setGamePlayerId(gamePlayerId); // ✅ Store in gamePlayerId

      console.log("Player successfully joined the game with ID:", gamePlayerId);
      console.log("setPlayerGameId: ", gameId)

      // Draw 10 unique cards for the player
      for (let i = 0; i < 3; i++) {
        try {
          await drawUniqueCard(gamePlayerId, gameId);
        } catch (error) {
          console.error("Failed to draw card:", error);
          break;
        }
      }
    },

    onError: (error) => {
      console.error("Failed to join game:", error);
    },
  });
}
