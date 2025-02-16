import { useMutation } from "@tanstack/react-query";
import { leaveGame } from "@/api/api";
import usePlayerLobbyStore from "@/store/playerLobbyStore";

export function useLeaveGame() {
  const { setPlayerGameId } = usePlayerLobbyStore();

  return useMutation({
    mutationFn: (playerId: string) => leaveGame(playerId),

    onSuccess: () => {
      setPlayerGameId(null);
      console.log("Player successfully left the game.");
    },

    onError: (error) => {
      console.error("Failed to leave game:", error);
    },
  });
}
