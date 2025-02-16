import { useMutation } from "@tanstack/react-query";
import { joinGame } from "@/api/api";
import { JoinGameData } from "@/lib/interface";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useGameStore } from "@/store/useGameStore";

export function useJoinGame() {
  const { setPlayerGameId } = usePlayerLobbyStore();
  const { setPlayerId } = useGameStore();

  return useMutation({
    mutationFn: ({ gameId, playerId, score }: JoinGameData) => {
      if (!playerId) throw new Error("Player ID is required to join a game.");
      return joinGame({ gameId, playerId, score });
    },

    onSuccess: (gamePlayerId, { gameId }) => {
      setPlayerGameId(gameId);
      setPlayerId(gamePlayerId);
      console.log("Player successfully joined the game.");
    },

    onError: (error) => {
      console.error("Failed to join game:", error);
    },
  });
}
